

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import 'leaflet/dist/leaflet.css';
// import 'leaflet-draw/dist/leaflet.draw.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );


ReactDOM.createRoot(document.getElementById('root')!).render(
  
<GoogleReCaptchaProvider
  reCaptchaKey="6Ldze1QrAAAAABnTFcGJ3nTg1z6Ef07KNxKaxDJF"
  scriptProps={{ async: true, defer: true }}
>

  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
</GoogleReCaptchaProvider>
);