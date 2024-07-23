import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import '../utils/StylesTotal.css';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await Axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: 'Riobamba', // Ciudad
            appid: 'bd011c8ff583dc8f7275e6bc41af1697', // Reemplaza con tu clave de API
            lang: 'es', // Idioma en español
            units: 'metric' // Para grados Celsius
          }
        });
        setWeather(response.data);
      } catch (error) {
        setError('Error al obtener la información del clima.');
        console.error(error);
      }
    };

    fetchWeather();
  }, []);

  if (error) return <div>{error}</div>;

  if (!weather) return <div>Cargando...</div>;

  const weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;

  return (
    <div className="weather-widget">
      <h2>Clima en {weather.name}</h2>
      <div className="weather-info">
        <img src={weatherIcon} alt={weather.weather[0].description} className="weather-icon" />
        <div className="temperature">{weather.main.temp} °C</div>
        <div className="condition">{weather.weather[0].description}</div>
      </div>
    </div>
  );
};

export default WeatherWidget;
