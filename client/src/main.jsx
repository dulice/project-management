import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "react-big-calendar/lib/css/react-big-calendar.css";
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
