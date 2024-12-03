import React from 'react';

import ReactDOM from 'react-dom/client';

import '@/assets/styles/global.scss';
import '@/assets/styles/react-multi-email.scss';
import '@/i18n';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@ichiba/ichiba-core-ui/dist/style.css';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
