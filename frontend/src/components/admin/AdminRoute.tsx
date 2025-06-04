import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../../api/axios';

interface Props {
  children: React.ReactNode;
}

const AdminRoute: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    API.get('/admin/me')
      .then(() => setAuthorized(true))
      .catch(() => setAuthorized(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Проверка авторизации администратора...</p>;
  return authorized ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;
