import React, { useEffect, useState } from 'react';
import { GetAllDonasi } from '../Api/apiOwner';
import 'bootstrap/dist/css/bootstrap.min.css';

const CRUDTransaksiRequestDonasi = () => {
    const [requestDonasiList, setRequestDonasiList] = useState([]);

    const fetchRequestDonasi = async () => {
        try {
            const data = await GetAllDonasi();
            // Menambahkan status default jika belum ada
            const dataWithStatus = data.map(item => ({
                ...item,
                status: item.status || 'Menunggu'
            }));
            setRequestDonasiList(dataWithStatus);
        } catch (error) {
            alert('Gagal mengambil data request donasi');
        }
    };

    useEffect(() => {
        fetchRequestDonasi();
    }, []);

    const handleStatusChange = (id, newStatus) => {
        setRequestDonasiList(prevList =>
            prevList.map(item =>
                item.id === id ? { ...item, status: newStatus } : item
            )
        );
    };

    return (
        <div className="container mt-5 bg-white p-4 rounded shadow">
            <h2 className="mb-4">Data Request Donasi</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Request</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {requestDonasiList.length > 0 ? (
                        requestDonasiList.map((requestDonasi, index) => (
                            <tr key={requestDonasi.id}>
                                <td>{index + 1}</td>
                                <td>{requestDonasi.request}</td>
                                <td>{requestDonasi.status}</td>
                                <td >
                                    <div className="d-flex flex-column">
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleStatusChange(requestDonasi.id, 'Diterima')}
                                        >
                                            Terima
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm mt-2"
                                            onClick={() => handleStatusChange(requestDonasi.id, 'Ditolak')}
                                        >
                                            Tolak
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">Tidak ada data</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CRUDTransaksiRequestDonasi;
