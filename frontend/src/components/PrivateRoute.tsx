import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api/axios';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<'loading' | 'ok' | 'fail'>('loading');

  useEffect(() => {
    API.get('/me')
      .then(() => setAuth('ok'))
      .catch(() => setAuth('fail'));
  }, []);

  if (auth === 'loading') return <div>Загрузка...</div>;
  return auth === 'ok' ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
