import React from "react";
import Navbar from "./navbar";
// import Pegawai from "../pegawai/pegawai";
import CRUDPegawai from "../admin/CRUDPegawai";
import { Outlet } from "react-router-dom";
import Admin from "../Admin/Admin";

const Layout = () => {
    return (
        <>
            <Navbar />
            
            <Outlet />
        </>
    )
}

export default Layout