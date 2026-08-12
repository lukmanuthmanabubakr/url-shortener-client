import { useEffect } from 'react';
import { apiClient } from './api/client';

const App = () => {
  useEffect(() => {
    apiClient.get('/health').then((response) => {
      console.log('Health check:', response.data);
    }).catch((error) => {
      console.error('Health check failed:', error);
    });
  }, []);

  return (
    <div>App</div>
  );
};

export default App;