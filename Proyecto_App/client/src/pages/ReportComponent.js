import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getReportData } from '../services/reportService';
import '../utils/StylesTotal.css'; 

const ReportComponent = () => {
  const [reportData, setReportData] = useState({ reportData: [], inventarioMateriaPrima: [] });

  const fetchReportData = async () => {
    try {
      const data = await getReportData();
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report data", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    doc.text('Reportes', 20, yPosition);
    yPosition += 10;

    // Generar reporte de Inventario de Materia Prima
    if (reportData.inventarioMateriaPrima.length) {
      doc.text('Inventario Materia Prima', 20, yPosition);
      yPosition += 10;
      doc.autoTable({
        startY: yPosition,
        head: [['Nombre', 'Proveedor', 'Cantidad Disponible']],
        body: reportData.inventarioMateriaPrima.map(item => [item.nombre || '', item.proveedor || '', item.cantidad_disponible || ''])
      });
      yPosition = doc.autoTable.previous.finalY + 10; // Update yPosition after autoTable
    }

    // Generar reporte de Inventario de Producto Terminado
    if (reportData.reportData.length) {
      const inventarioProductoTerminado = reportData.reportData
        .filter(row => row.nombre_producto_terminado)
        .map(row => [row.nombre_producto_terminado, row.cantidad_producto_terminado_disponible]);

      if (inventarioProductoTerminado.length) {
        if (yPosition + 30 > doc.internal.pageSize.height) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text('Inventario Producto Terminado', 20, yPosition);
        yPosition += 10;
        doc.autoTable({
          startY: yPosition,
          head: [['Nombre', 'Cantidad Disponible']],
          body: inventarioProductoTerminado
        });
        yPosition = doc.autoTable.previous.finalY + 10; // Update yPosition after autoTable
      }
    }

    // Generar reporte de Producción
    if (reportData.reportData.length) {
      const produccion = reportData.reportData.map(row => [row.fecha || '', row.descripcion_produccion || '']);

      if (produccion.length) {
        if (yPosition + 30 > doc.internal.pageSize.height) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text('Producción', 20, yPosition);
        yPosition += 10;
        doc.autoTable({
          startY: yPosition,
          head: [['Fecha', 'Descripción']],
          body: produccion
        });
        yPosition = doc.autoTable.previous.finalY + 10; // Update yPosition after autoTable
      }
    }

    // Generar reporte de Inconvenientes
    if (reportData.reportData.length) {
      const inconvenientes = reportData.reportData
        .filter(row => row.descripcion_inconveniente)
        .map(row => [row.descripcion_inconveniente]);

      if (inconvenientes.length) {
        if (yPosition + 30 > doc.internal.pageSize.height) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text('Inconvenientes', 20, yPosition);
        yPosition += 10;
        doc.autoTable({
          startY: yPosition,
          head: [['Descripción']],
          body: inconvenientes
        });
        yPosition = doc.autoTable.previous.finalY + 10; // Update yPosition after autoTable
      }
    }

    // Generar reporte completo con toda la información (similar a la consulta SQL)
    if (reportData.reportData.length) {
      if (yPosition + 30 > doc.internal.pageSize.height) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text('Reporte Completo', 20, yPosition);
      yPosition += 10;

      const reportBody = reportData.reportData.map(row => [
        row.fecha || '',
        row.nombre_materia_prima || '',
        row.proveedor || '',
        row.descripcion_produccion || '',
        row.cantidad_materia_prima_disponible || 0,
        row.cantidad_uso || 0,
        row.nombre_producto_terminado || '',
        row.cantidad_producto_terminado_disponible || 0,
        row.descripcion_inconveniente || ''
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Fecha', 'Nombre Materia Prima', 'Proveedor', 'Descripción Producción', 'Cantidad Materia Prima Disponible', 'Cantidad Uso', 'Nombre Producto Terminado', 'Cantidad Producto Terminado Disponible', 'Descripción Inconveniente']],
        body: reportBody
      });
    }

    doc.save('report.pdf');
  };

  return (
    <div>
      <h2>Reportes</h2>
      <button className="styled-button" onClick={fetchReportData}>Generar Reporte</button>
      {reportData.reportData.length > 0 && (
        <button className="styled-button" onClick={generatePDF}>Descargar PDF</button>
      )}
    </div>
  );
};

export default ReportComponent;
