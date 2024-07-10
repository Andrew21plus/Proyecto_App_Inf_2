import { useState, useEffect } from 'react';
import Axios from 'axios';

const useServerStatus = (checkInterval = 60000) => {
  const [serverStatus, setServerStatus] = useState(true);

  useEffect(() => {
    const checkServerStatus = () => {
      Axios.get('http://localhost:3307/health-check')
        .then(() => setServerStatus(true))
        .catch(() => setServerStatus(false));
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, checkInterval);

    return () => clearInterval(interval);
  }, [checkInterval]);

  return serverStatus;
};

export default useServerStatus;