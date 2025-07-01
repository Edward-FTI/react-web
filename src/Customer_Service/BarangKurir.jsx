import React, { useEffect, useState } from 'react';
import { GetKurirBarang } from '../Api/apiPengiriman';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const SelesaiPengiriman = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await GetKurirBarang();
                setData(result);
            } catch (err) {
                setError('Gagal memuat data pengiriman');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container mt-5 bg-white p-4 rounded shadow">
            <h2 className="mb-4">Daftar Pengiriman Selesai</h2>

            {loading && <p>Memuat data...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>No</th>
                            <th>Kurir</th>
                            <th>Tanggal Kirim</th>
                            <th>Biaya Ongkir</th>
                            <th>Daftar Barang</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={item.id_transaksi_pengiriman}>
                                    <td>{index + 1}</td>
                                    <td>{item.nama_kurir}</td>
                                    <td>{new Date(item.tanggal_jadwal_kirim).toLocaleString()}</td>
                                    <td>Rp{item.biaya_pengiriman.toLocaleString()}</td>
                                    <td>
                                        <ul className="mb-0">
                                            {item.barang.map((barang, i) => (
                                                <li key={i}>
                                                    <strong>{barang.nama_barang}</strong> - 
                                                    <span className={`ms-1 ${barang.status_barang === 'Sold Out' ? 'text-danger' : 'text-success'}`}>
                                                        {barang.status_barang}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">Belum ada data pengiriman selesai</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SelesaiPengiriman;
