// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import LoginModal from './LoginModal';
// import RegisterModal from './RegisterModal';
// import API from '../api/axios';
// import { useAuth } from '../context/AuthContext';

// const Header: React.FC = () => {
//   const [showLogin, setShowLogin] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();
  

//   const checkAuth = async () => {
//     try {
//       await API.get('/me');
//       setIsAuthenticated(true);
//     } catch {
//       setIsAuthenticated(false);
//     }
//   };

// const handleLogout = async () => {
//   try {
//     const res = await API.get('/csrf-token'); // 🛡 получить токен
//     const csrfToken = res.data.csrfToken;

//     await API.post('/logout', null, {
//       headers: {
//         'X-CSRF-Token': csrfToken,
//       },
//     });

//     setIsAuthenticated(false);
//     navigate('/');
//   } catch (err) {
//     console.error('Ошибка выхода', err);
//   }
// };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   return (
//     <>
//       <header className="bg-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <Link to="/" className="text-2xl font-bold text-green-600">🌱 Агроассистент</Link>
//           <nav className="space-x-4 flex items-center">
//             <Link to="/" className="text-gray-600 hover:text-green-600">Главная</Link>
//             <Link to="/dashboard" className="text-gray-600 hover:text-green-600">Кабинет</Link>

//             {!isAuthenticated ? (
//               <>
//                 <button
//                   onClick={() => setShowLogin(true)}
//                   className="text-gray-600 hover:text-green-600"
//                 >
//                   Войти
//                 </button>
//                 <button
//                   onClick={() => setShowRegister(true)}
//                   className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                 >
//                   Регистрация
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={handleLogout}
//                 className="text-red-600 hover:text-red-700"
//               >
//                 Выйти
//               </button>
//             )}
//           </nav>
//         </div>
//       </header>

//       <LoginModal
//         isOpen={showLogin}
//         onClose={() => {
//           setShowLogin(false);
//           checkAuth(); // заново проверяем авторизацию
//         }}
//       />
//       <RegisterModal
//         isOpen={showRegister}
//         onClose={() => setShowRegister(false)}
//       />
//     </>
//   );
// };

// export default Header;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { isAuthenticated, user, logout, checkAuth } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-green-600">🌱 Агроассистент</Link>
          <nav className="space-x-4 flex items-center">
            <Link to="/" className="text-gray-600 hover:text-green-600">Главная</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-green-600">Кабинет</Link>

            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-gray-600 hover:text-green-600"
                >
                  Войти
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Регистрация
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-700 font-medium">
                  👋 Привет, {user?.name || 'Пользователь'}
                </span>
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Выйти
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <LoginModal
        isOpen={showLogin}
        onClose={() => {
          setShowLogin(false);
          checkAuth(); // после входа — обновляем шапку
        }}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
      />
    </>
  );
};

export default Header;
