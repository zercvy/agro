// import { useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import API from '../api/axios';
// import { useAuth } from '../context/AuthContext';

// const VerifyPage = () => {
//   const [params] = useSearchParams();
//   const token = params.get('token');
//   const navigate = useNavigate();
//   const { checkAuth } = useAuth();

//   useEffect(() => {
//     const confirm = async () => {
//       try {
//         const res = await API.get(`/verify?token=${token}`);
//         const token2 = res.data.token;

//         localStorage.setItem('token', token2);
//         await checkAuth();
//         navigate('/dashboard'); // ← вот здесь
//       } catch (err) {
//         console.error('Ошибка подтверждения', err);
//         navigate('/');
//       }
//     };

//     if (token) confirm();
//   }, [token]);

//   return <div className="p-4 text-center">⏳ Подтверждаем ваш email...</div>;
// };

// export default VerifyPage;
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const VerifyPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const confirm = async () => {
      try {
        await API.get(`/verify?token=${token}`);
        await checkAuth(); // Обновляем авторизацию из cookie
        navigate('/dashboard');
      } catch (err) {
        console.error('Ошибка подтверждения', err);
        navigate('/');
      }
    };

    if (token) confirm();
  }, [token]);

  return <div className="p-4 text-center">⏳ Подтверждаем ваш email...</div>;
};

export default VerifyPage;
