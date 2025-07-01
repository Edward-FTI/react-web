import React, { useEffect, useState } from "react";
import { GetAlltransaksi_penjualanPembeli } from "../Api/apitransaksi_penjualans"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const TransaksiPembeli = () => {
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransaksi = async () => {
    try {
      const data = await GetAlltransaksi_penjualanPembeli();
      setTransaksiList(data);
    } catch (error) {
      alert("Gagal mengambil data transaksi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const formatNomorNota = (createdAt, id) => {
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}.${month}.${id}`;
  };

  return (
    <div className="container mt-5 bg-white p-4 rounded shadow">
      <h2 className="mb-4">Daftar Transaksi Pembeli</h2>

      {loading ? (
        <div>Loading...</div>
      ) : transaksiList.length === 0 ? (
        <div className="alert alert-info">Belum ada transaksi</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>No</th>
              <th>Nomor Nota</th>
              <th>Alamat Pengiriman</th>
              <th>Ongkir</th>
              <th>Status Pengiriman</th>
              <th>Status Pembelian</th>
              <th>Verifikasi Pembayaran</th>
            </tr>
          </thead>
          <tbody>
            {transaksiList.map((t, i) => (
              <tr key={t.id}>
                <td>{i + 1}</td>
                <td>{formatNomorNota(t.created_at, t.id)}</td>
                <td>{t.alamat_pengiriman || "-"}</td>
                <td>{t.ongkir?.toLocaleString("id-ID", { style: "currency", currency: "IDR" }) || "-"}</td>
                <td>{t.status_pengiriman}</td>
                <td>{t.status_pembelian}</td>
                <td>{t.verifikasi_pembayaran == 1 ? "Terverifikasi" : "Belum Verifikasi"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransaksiPembeli;
