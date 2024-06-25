import * as tf from '@tensorflow/tfjs';

export const predecirNecesidad = async (datosEntrenamiento) => {
  // Preparar los datos
  const inputs = datosEntrenamiento.map(d => [d.totalProduccion, d.totalMateriaPrimaUsada, d.materiaPrimaRestante, d.ultimoIngreso]);
  const labels = datosEntrenamiento.map(d => d.ultimoIngreso);

  const inputTensor = tf.tensor2d(inputs);
  const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

  // Crear y entrenar el modelo
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 8, activation: 'relu', inputShape: [4] }));
  model.add(tf.layers.dense({ units: 4, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

  await model.fit(inputTensor, labelTensor, {
    epochs: 100,
    batchSize: 1
  });

  // Predecir el próximo ingreso
  const [ultimaSemana] = datosEntrenamiento.slice(-1);
  const inputParaPrediccion = tf.tensor2d([[ultimaSemana.totalProduccion, ultimaSemana.totalMateriaPrimaUsada, ultimaSemana.materiaPrimaRestante, ultimaSemana.ultimoIngreso]]);

  const prediccion = model.predict(inputParaPrediccion);
  const resultado = await prediccion.data();

  console.log('Resultado de la predicción:', resultado[0]);
  return resultado[0];
};







