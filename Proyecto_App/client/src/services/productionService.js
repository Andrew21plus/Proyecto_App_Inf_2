import Axios from 'axios';

export const validateProduccionFormData = async (formData, producciones) => {
  let errors = {};

  // Validar fecha (si se necesitara alguna validación adicional)
  if (!formData.fecha) {
    errors.fecha = "La fecha es obligatoria.";
  }

  // Validar descripción
  if (!formData.descripcion) {
    errors.descripcion = "La descripción es obligatoria.";
  } /*else {
    // Verificar si la descripción ya existe en producciones
    const descripcionExistente = producciones.some(produccion => produccion.descripcion.toLowerCase() === formData.descripcion.toLowerCase());
    if (descripcionExistente) {
      errors.descripcion = "La producción ya existe. Ingrese una diferente.";
    }
  }*/
// Validar duplicados de materias primas
const selectedMateriasPrimas = formData.materiasPrimas.map(mp => mp.id_materia_prima);
const hasDuplicates = new Set(selectedMateriasPrimas).size !== selectedMateriasPrimas.length;
if (hasDuplicates) {
  errors.materiasPrimas = 'No se pueden seleccionar materias primas duplicadas';
}
  // Validar cantidad de uso para cada materia prima
  formData.materiasPrimas.forEach((mp, index) => {
    if (!mp.id_materia_prima) {
      errors[`id_materia_prima_${index}`] = "Selecciona una materia prima.";
    }
    if (mp.cantidad_uso <= 0) {
      errors[`cantidad_uso_${index}`] = "La cantidad de uso debe ser mayor que 0.";
    }
  });

  return errors;
};