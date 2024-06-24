import * as tf from '@tensorflow/tfjs';
import axios from 'axios';

// Obtener datos históricos
async function obtenerDatosHistoricos() {
  const response = await axios.get('http://localhost:3307/produccion');
  return response.data;
}

// Entrenar el modelo
async function entrenarModelo() {
  const datos = await obtenerDatosHistoricos();
  console.log('Datos históricos:', datos);

  // Filtrar datos inválidos
  const datosFiltrados = datos.filter(d => {
    const cantidadUso = parseFloat(d.cantidad_uso);
    const cantidadProducida = parseFloat(d.cantidad_producida);
    const materiaPrimaRestante = parseFloat(d.materia_prima_restante);
    return !isNaN(cantidadUso) && !isNaN(cantidadProducida) && !isNaN(materiaPrimaRestante);
  });

  console.log('Datos filtrados:', datosFiltrados);

  const inputs = datosFiltrados.map(d => [
    parseFloat(d.cantidad_uso),
    parseFloat(d.cantidad_producida),
    parseFloat(d.materia_prima_restante)
  ]);
  const labels = datosFiltrados.map(d => parseFloat(d.cantidad_uso)); // Asumiendo que queremos predecir la cantidad de uso

  console.log('Inputs:', inputs);
  console.log('Labels:', labels);

  const inputTensor = tf.tensor2d(inputs, [inputs.length, 3]);
  const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

  console.log('Input Tensor:', inputTensor.toString());
  console.log('Label Tensor:', labelTensor.toString());

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [3], units: 16, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

  await model.fit(inputTensor, labelTensor, { epochs: 50 });

  console.log('Modelo entrenado:', model);

  return model;
}

// Predecir la necesidad de materia prima
export async function predecirNecesidad(cantidadProduccion, materiaPrimaUsada, materiaPrimaRestante) {
  console.log('Cantidad Producción para predicción:', cantidadProduccion);
  console.log('Materia Prima Usada para predicción:', materiaPrimaUsada);
  console.log('Materia Prima Restante para predicción:', materiaPrimaRestante);

  const model = await entrenarModelo();

  const input = tf.tensor2d([[parseFloat(cantidadProduccion), parseFloat(materiaPrimaUsada), parseFloat(materiaPrimaRestante)]], [1, 3]);
  console.log('Input para predicción:', input.toString());

  const prediccion = model.predict(input);
  console.log('Predicción:', prediccion.toString());

  const resultado = (await prediccion.data())[0];
  console.log('Resultado de la predicción:', resultado);

  return resultado;
}





