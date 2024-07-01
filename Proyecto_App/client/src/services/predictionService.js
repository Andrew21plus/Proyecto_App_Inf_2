import * as tf from '@tensorflow/tfjs';

export const predecirNecesidad = async (datosEntrenamiento) => {
  // Preparar los datos
  const materiaPrimas = Object.keys(datosEntrenamiento[0].totalMateriaPrimaUsada);
  const inputs = datosEntrenamiento.map(d => [
    d.totalProduccion, 
    ...materiaPrimas.map(mp => d.totalMateriaPrimaUsada[mp] || 0),
    ...materiaPrimas.map(mp => d.materiaPrimaRestante[mp] || 0),
    ...materiaPrimas.map(mp => d.ultimoIngreso[mp] || 0)
  ]);

  const labels = materiaPrimas.reduce((acc, mp) => {
    acc[mp] = datosEntrenamiento.map(d => d.ultimoIngreso[mp] || 0);
    return acc;
  }, {});

  // Normalizar los datos
  const inputTensor = tf.tensor2d(inputs);
  const { mean: inputMean, variance: inputVariance } = tf.moments(inputTensor, 0);
  const normalizedInputs = inputTensor.sub(inputMean).div(inputVariance.sqrt());

  const modelos = {};

  for (const mp of materiaPrimas) {
    const labelTensor = tf.tensor2d(labels[mp], [labels[mp].length, 1]);
    const { mean: labelMean, variance: labelVariance } = tf.moments(labelTensor, 0);
    const normalizedLabels = labelTensor.sub(labelMean).div(labelVariance.sqrt());

    // Crear y entrenar el modelo
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 8, activation: 'relu', inputShape: [inputs[0].length] }));
    model.add(tf.layers.dense({ units: 4, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    await model.fit(normalizedInputs, normalizedLabels, {
      epochs: 300,
      batchSize: 8
    });

    modelos[mp] = { model, labelMean, labelVariance };
  }

  // Predecir el próximo ingreso para cada materia prima
  const [ultimaSemana] = datosEntrenamiento.slice(-1);
  const inputParaPrediccion = tf.tensor2d([[
    ultimaSemana.totalProduccion, 
    ...materiaPrimas.map(mp => ultimaSemana.totalMateriaPrimaUsada[mp] || 0),
    ...materiaPrimas.map(mp => ultimaSemana.materiaPrimaRestante[mp] || 0),
    ...materiaPrimas.map(mp => ultimaSemana.ultimoIngreso[mp] || 0)
  ]]);
  const normalizedInputParaPrediccion = inputParaPrediccion.sub(inputMean).div(inputVariance.sqrt());

  const predicciones = {};
  for (const mp of materiaPrimas) {
    const { model, labelMean, labelVariance } = modelos[mp];
    const prediccion = model.predict(normalizedInputParaPrediccion);
    const resultado = prediccion.mul(labelVariance.sqrt()).add(labelMean);
    const resultadoArray = await resultado.data();
    predicciones[mp] = Math.max(0, resultadoArray[0]); // Asegurarse de que no haya valores negativos
  }

  console.log('Resultado de las predicciones:', predicciones);
  return predicciones;
};
