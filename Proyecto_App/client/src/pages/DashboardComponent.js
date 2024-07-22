import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import moment from 'moment';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Select from 'react-select';
import '../utils/DashboardStyles.css';

const DashboardComponent = () => {
    const [materiasPrimas, setMateriasPrimas] = useState([]);
    const [filteredMateriasPrimas, setFilteredMateriasPrimas] = useState([]);
    const [fecha, setFecha] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [currentGroup, setCurrentGroup] = useState(0);
    const itemsPerPage = 5; // Maximum items to show per page

    useEffect(() => {
        fetchMateriasPrimas();
        setFecha(moment().format('DD-MM-YYYY'));
    }, []);

    const fetchMateriasPrimas = () => {
        Axios.get('http://localhost:3307/inventario-materia-prima')
            .then(response => {
                setMateriasPrimas(response.data);
                setFilteredMateriasPrimas(response.data.slice(0, itemsPerPage));
            })
            .catch(error => {
                console.error('Error fetching materias primas:', error);
            });
    };

    const handleSelectChange = (selected) => {
        setSelectedOptions(selected);
        if (selected.length === 0) {
            setFilteredMateriasPrimas(materiasPrimas.slice(currentGroup * itemsPerPage, (currentGroup + 1) * itemsPerPage));
        } else {
            const selectedNames = selected.map(option => option.value);
            setFilteredMateriasPrimas(materiasPrimas.filter(mp => selectedNames.includes(mp.nombre)));
        }
    };

    const options = materiasPrimas.map(mp => ({ value: mp.nombre, label: mp.nombre }));

    const handleNext = () => {
        const nextGroup = currentGroup + 1;
        if (nextGroup * itemsPerPage < materiasPrimas.length) {
            setCurrentGroup(nextGroup);
            setFilteredMateriasPrimas(materiasPrimas.slice(nextGroup * itemsPerPage, (nextGroup + 1) * itemsPerPage));
        }
    };

    const handlePrev = () => {
        const prevGroup = currentGroup - 1;
        if (prevGroup >= 0) {
            setCurrentGroup(prevGroup);
            setFilteredMateriasPrimas(materiasPrimas.slice(prevGroup * itemsPerPage, (prevGroup + 1) * itemsPerPage));
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Materias Primas</h1>
            <p className="fecha">Fecha: {fecha}</p>
            <Select
                isMulti
                name="materiasPrimas"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Seleccionar materias primas"
                onChange={handleSelectChange}
            />
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={filteredMateriasPrimas}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        barCategoryGap="10%"
                        barSize={50}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nombre" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="cantidad_disponible" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="navigation-buttons">
                <button onClick={handlePrev} disabled={currentGroup === 0 || selectedOptions.length > 0}>Anterior</button>
                <button onClick={handleNext} disabled={(currentGroup + 1) * itemsPerPage >= materiasPrimas.length || selectedOptions.length > 0}>Siguiente</button>
            </div>
        </div>
    );
};

export default DashboardComponent;
