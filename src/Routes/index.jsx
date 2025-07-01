import { Routes, Route } from "react-router-dom";
import Pegawai from "../pegawai/pegawai";
import CreatePegawai from "../pegawai/createPegawai";
import UpdatePegawai from "../pegawai/updatePegawai";

const RoutesIndex = () => {
    return (
        <Routes>
            <Route path="/" element = { <Pegawai/> } />
            <Route path="/pegawai/create" element = { <CreatePegawai /> } />
            <Route path="/pegawai/update" element = { <UpdatePegawai /> } />
            
        </Routes>
    )
}
export default RoutesIndex;


