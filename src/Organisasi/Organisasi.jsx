import React, { useEffect, useState } from "react";
import { GetPermintaan } from "../Api/apiOrganisasi";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Organisasi = () => {
  const [organisasiList, setOrganisasiList] = useState([]);

  const fetchOrganisasi = async () => {
    try {
      const data = await GetPermintaan();
      setOrganisasiList(data);
    } catch (error) {
      alert("Gagal mengambil data organisasi");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrganisasi();
  }, []);

  return (
    <div className="container mt-5 bg-white p-4 rounded shadow">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Data Organisasi</h2>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Alamat</th>
            <th>Permintaan</th>
            <th>Email</th>
            <th>No HP</th>
          </tr>
        </thead>
        <tbody>
          {organisasiList.length > 0 ? (
            organisasiList.map((o, index) => (
              <tr key={o.id}>
                <td>{index + 1}</td>
                <td>{o.nama}</td>
                <td>{o.alamat}</td>
                <td>{o.permintaan}</td>
                <td>{o.email}</td>
                <td>{o.no_hp}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Belum ada data organisasi
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Organisasi;
