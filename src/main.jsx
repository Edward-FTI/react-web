import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
// import './index.css';
// import AppRouter from './routes/Routes';
import AppRouter from "./Routes/Routes.jsx";
import App from "./App.jsx";

import Login from './Components/Login.jsx';
// import Pegawai from './pegawai'
// import CRUDPegawai from "./admin/CRUDPegawai.jsx";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Dashboard from "./Components/Dashboard.jsx";

// import Layout from './navbar/layout.jsx'

// // import LoginForm from './Components/Login.jsx'
// import NavbarPage from './Components/Navbar.jsx'
// import Footer from './Components/Footer.jsx'
// import Admin from './Admin/Admin.jsx'



createRoot(document.getElementById('root')).render(
  <>
    {/* <NavbarPage /> */}
    {/* <Footer /> */}
    {/* <LoginForm /> */}
    <AppRouter />
    {/* <Dashboard /> */}
  </>,
)
