import * as tf from '@tensorflow/tfjs';

export const predecirNecesidad = async (datosEntrenamiento, cantidadesDisponibles) => {
  const materiaPrimas = Object.keys(datosEntrenamiento[0].totalMateriaPrimaUsada);
  const inputs = datosEntrenamiento.map(d => [
    d.totalProduccion, 
    ...materiaPrimas.map(mp => d.totalMateriaPrimaUsada[mp] || 0)
  ]);

  const labels = materiaPrimas.reduce((acc, mp) => {
    acc[mp] = datosEntrenamiento.map(d => d.totalMateriaPrimaUsada[mp] || 0);
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

  // Predicción de la última semana
  const ultimaSemana = datosEntrenamiento[datosEntrenamiento.length - 1];
  const inputParaPrediccion = tf.tensor2d([[
    ultimaSemana.totalProduccion, 
    ...materiaPrimas.map(mp => ultimaSemana.totalMateriaPrimaUsada[mp] || 0)
  ]]);
  const normalizedInputParaPrediccion = inputParaPrediccion.sub(inputMean).div(inputVariance.sqrt());

  const predicciones = {};
  const tendencia = {};
  let totalProduccionPrevista = 0;

  for (const mp of materiaPrimas) {
    const { model, labelMean, labelVariance } = modelos[mp];
    const prediccion = model.predict(normalizedInputParaPrediccion);
    const resultado = prediccion.mul(labelVariance.sqrt()).add(labelMean);
    const resultadoArray = await resultado.data();
    const cantidadUsadaPrevista = resultadoArray[0];
    const cantidadDisponible = cantidadesDisponibles.find(m => m.nombre === mp)?.cantidad_disponible || 0;

    tendencia[mp] = Math.ceil(cantidadUsadaPrevista); // Redondear al inmediato superior

    const margen = (cantidadUsadaPrevista - cantidadDisponible) * 0.3; // 30% de margen
    const cantidadConExceso = Math.ceil(cantidadUsadaPrevista - cantidadDisponible + margen); // Redondear al inmediato superior

    if (cantidadUsadaPrevista <= cantidadDisponible) {
      predicciones[mp] = 0;
    } else {
      predicciones[mp] = cantidadConExceso;
    }
  }

  // Calcular la predicción total de producción
  const inputsParaProduccion = datosEntrenamiento.map(d => [
    d.totalProduccion, 
    ...materiaPrimas.map(mp => d.totalMateriaPrimaUsada[mp] || 0)
  ]);
  const inputTensorParaProduccion = tf.tensor2d(inputsParaProduccion);
  const normalizedInputsParaProduccion = inputTensorParaProduccion.sub(inputMean).div(inputVariance.sqrt());
  const prediccionProduccion = modelos[materiaPrimas[0]].model.predict(normalizedInputsParaProduccion);
  const resultadoProduccion = prediccionProduccion.mul(tf.sqrt(inputVariance)).add(inputMean);
  totalProduccionPrevista = Math.ceil((await resultadoProduccion.data())[0]); // Redondear al inmediato superior

  tendencia.totalProduccion = totalProduccionPrevista;

  return { tendencia, predicciones };
};
