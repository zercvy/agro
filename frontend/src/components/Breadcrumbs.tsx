import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const labelMap: Record<string, string> = {
  'dashboard': 'Личный кабинет',
  'cultures': 'Мои культуры',
  'plots': 'Участки',
  'pots': 'Горшки',
  'calendar': 'Календарь',
  'windowsills': 'Подоконники',
  'admin': 'Админка',
  'create-plot': 'Создание участка',
  'my-cultures': 'Мои культуры',
  'fertilizer': 'Удобрения',
  'analytics': 'Аналитика'
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const state = location.state as { fromDashboard?: boolean } | null;

  // Показываем "Личный кабинет" только если не на /dashboard
  const showDashboard = state?.fromDashboard && segments[0] !== 'dashboard';

  const crumbs = segments.map((seg, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/');
    const label = labelMap[seg] || decodeURIComponent(seg);
    return { path, label };
  });

  return (
    <nav className="text-sm text-gray-600 mb-4">
      <Link to="/" className="text-blue-600 hover:underline">Главная</Link>

      {showDashboard && (
        <span>
          {' / '}
          <Link to="/dashboard" className="text-blue-600 hover:underline">Личный кабинет</Link>
        </span>
      )}

      {crumbs.map((c, i) => (
        <span key={i}>
          {' / '}
          {i === crumbs.length - 1 ? (
            <span className="font-medium text-gray-800">{c.label}</span>
          ) : (
            <Link to={c.path} className="text-blue-600 hover:underline">{c.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
