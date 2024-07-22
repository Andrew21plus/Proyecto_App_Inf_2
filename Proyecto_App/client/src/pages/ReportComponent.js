import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getReportData } from '../services/reportService';
import { Button, Checkbox, FormControlLabel, FormGroup, Typography, Paper, Container, Box, CircularProgress } from '@mui/material';
import { CheckCircleOutline, FileDownload } from '@mui/icons-material';

const ReportComponent = () => {
  const [reportData, setReportData] = useState({ reportData: [], inventarioMateriaPrima: [] });
  const [selectedReports, setSelectedReports] = useState({
    materiaPrima: false,
    productoTerminado: false,
    produccion: false,
    inconvenientes: false,
    completo: false,
  });
  const [loading, setLoading] = useState(false);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const data = await getReportData();
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    if (name === 'completo') {
      setSelectedReports({
        materiaPrima: false,
        productoTerminado: false,
        produccion: false,
        inconvenientes: false,
        completo: checked,
      });
    } else {
      setSelectedReports((prev) => ({
        ...prev,
        [name]: checked,
        completo: prev.completo && !checked ? false : prev.completo,
      }));
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 30;

    const addHeader = () => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text("Reportes de Inventario", pageWidth / 2, 15, { align: 'center' });
      doc.setLineWidth(0.5);
      doc.line(10, 20, pageWidth - 10, 20);
    };

    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
    };

    const addSection = (title, head, body) => {
      if (yPosition + 30 > pageHeight) {
        doc.addPage();
        yPosition = 30;
        addHeader();
      }
      doc.text(title, 14, yPosition);
      yPosition += 10;
      doc.autoTable({
        startY: yPosition,
        theme: 'striped',
        headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        styles: { font: 'helvetica', fontSize: 10, cellPadding: 3 },
        head,
        body,
      });
      yPosition = doc.autoTable.previous.finalY + 10;
    };

    addHeader();

    if (selectedReports.materiaPrima && reportData.inventarioMateriaPrima.length) {
      const materiaPrimaBody = reportData.inventarioMateriaPrima.map(item => [item.nombre || '', item.proveedor || '', item.cantidad_disponible || '']);
      addSection('Inventario Materia Prima', [['Nombre', 'Proveedor', 'Cantidad Disponible']], materiaPrimaBody);
    }

    if (selectedReports.productoTerminado && reportData.reportData.length) {
      const inventarioProductoTerminado = reportData.reportData
        .filter(row => row.nombre_producto_terminado)
        .map(row => [row.nombre_producto_terminado, row.cantidad_producto_terminado_disponible]);
      addSection('Inventario Producto Terminado', [['Nombre', 'Cantidad Disponible']], inventarioProductoTerminado);
    }

    if (selectedReports.produccion && reportData.reportData.length) {
      const produccion = reportData.reportData.map(row => [row.fecha || '', row.descripcion_produccion || '']);
      addSection('Producción', [['Fecha', 'Descripción']], produccion);
    }

    if (selectedReports.inconvenientes && reportData.reportData.length) {
      const inconvenientes = reportData.reportData
        .filter(row => row.descripcion_inconveniente)
        .map(row => [row.descripcion_inconveniente]);
      addSection('Inconvenientes', [['Descripción']], inconvenientes);
    }

    if (selectedReports.completo) {
      if (reportData.inventarioMateriaPrima.length) {
        const materiaPrimaBody = reportData.inventarioMateriaPrima.map(item => [item.nombre || '', item.proveedor || '', item.cantidad_disponible || '']);
        addSection('Inventario Materia Prima', [['Nombre', 'Proveedor', 'Cantidad Disponible']], materiaPrimaBody);
      }
      
      if (reportData.reportData.length) {
        const inventarioProductoTerminado = reportData.reportData
          .filter(row => row.nombre_producto_terminado)
          .map(row => [row.nombre_producto_terminado, row.cantidad_producto_terminado_disponible]);
        addSection('Inventario Producto Terminado', [['Nombre', 'Cantidad Disponible']], inventarioProductoTerminado);
      
        const produccion = reportData.reportData.map(row => [row.fecha || '', row.descripcion_produccion || '']);
        addSection('Producción', [['Fecha', 'Descripción']], produccion);

        const inconvenientes = reportData.reportData
          .filter(row => row.descripcion_inconveniente)
          .map(row => [row.descripcion_inconveniente]);
        addSection('Inconvenientes', [['Descripción']], inconvenientes);
      }
    }

    addFooter();
    doc.save('report.pdf');

    // Recargar la página después de descargar el PDF
    window.location.reload();
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generador de Reportes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleOutline />}
          onClick={fetchReportData}
          disabled={loading}
          fullWidth
        >
          {loading ? 'Cargando...' : 'Obtener Datos'}
        </Button>
        <Box mt={3}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  name="materiaPrima"
                  checked={selectedReports.materiaPrima}
                  onChange={handleCheckboxChange}
                  disabled={selectedReports.completo}
                />
              }
              label="Inventario Materia Prima"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="productoTerminado"
                  checked={selectedReports.productoTerminado}
                  onChange={handleCheckboxChange}
                  disabled={selectedReports.completo}
                />
              }
              label="Inventario Producto Terminado"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="produccion"
                  checked={selectedReports.produccion}
                  onChange={handleCheckboxChange}
                  disabled={selectedReports.completo}
                />
              }
              label="Producción"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="inconvenientes"
                  checked={selectedReports.inconvenientes}
                  onChange={handleCheckboxChange}
                  disabled={selectedReports.completo}
                />
              }
              label="Inconvenientes"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="completo"
                  checked={selectedReports.completo}
                  onChange={handleCheckboxChange}
                  disabled={selectedReports.materiaPrima || selectedReports.productoTerminado || selectedReports.produccion || selectedReports.inconvenientes}
                />
              }
              label="Reporte Completo"
            />
          </FormGroup>
        </Box>
        {reportData.reportData.length > 0 && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<FileDownload />}
            onClick={generatePDF}
            fullWidth
            sx={{ marginTop: 3 }}
          >
            Descargar PDF
          </Button>
        )}
      </Paper>
    </Container>
  );
};

export default ReportComponent;
