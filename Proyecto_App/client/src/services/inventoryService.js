// services/inventarioService.js

export const validateInventarioPTFormData = (data) => {
    const errors = {};
    if (!data.id_produccion) errors.id_produccion = "ID Producción es requerido";
    if (!data.id_venta) errors.id_venta = "ID Venta es requerido";
    if (!data.cantidad_disponible) {
      errors.cantidad_disponible = "Cantidad Disponible es requerido";
    } else if (isNaN(data.cantidad_disponible)) {
      errors.cantidad_disponible = "Cantidad Disponible debe ser un número";
    }
    return errors;
  };
  
  export const validateInventarioMPFormData = (data) => {
    const errors = {};
    if (!data.nombre) errors.nombre = "Nombre es requerido";
    if (!data.descripcion) errors.descripcion = "Descripción es requerida";
    if (!data.proveedor) errors.proveedor = "Proveedor es requerido";
    if (!data.cantidad_ingreso) {
      errors.cantidad_ingreso = "Cantidad Ingreso es requerido";
    } else if (isNaN(data.cantidad_ingreso)) {
      errors.cantidad_ingreso = "Cantidad Ingreso debe ser un número";
    }
    if (!data.cantidad_disponible) {
      errors.cantidad_disponible = "Cantidad Disponible es requerido";
    } else if (isNaN(data.cantidad_disponible)) {
      errors.cantidad_disponible = "Cantidad Disponible debe ser un número";
    }
    return errors;
  };
  