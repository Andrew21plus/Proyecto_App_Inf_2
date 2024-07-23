import React, { useState, useEffect } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import '../utils/StylesTotal.css';

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  const [isDigital, setIsDigital] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const toggleClockType = () => {
    setIsDigital(!isDigital);
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="clock-widget" onClick={toggleClockType}>
      {isDigital ? (
        <div className="digital-clock">
          {formatTime(time)}
        </div>
      ) : (
        <div className="analog-clock">
          <Clock value={time} />
        </div>
      )}
    </div>
  );
};

export default ClockWidget;
