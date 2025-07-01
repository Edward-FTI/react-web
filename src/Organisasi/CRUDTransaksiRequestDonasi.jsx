import React, { useEffect, useState } from 'react';
import {
    GettRequest_donasi,
    GettRequest_donasiById,
    CreatetRequest_donasi,
    UpdatetRequest_donasi,
    DeletetRequest_donasi
} from '../Api/apiRequest_donasi';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const CRUDTransaksiRequestDonasi = () => {
    const [requestDonasiList, setRequestDonasiList] = useState([]);
    const [form, setForm] = useState({ request: '' });
    const [editId, setEditId] = useState(null);

    const fetchRequestDonasi = async () => {
        try {
            const data = await GettRequest_donasi();
            setRequestDonasiList(data);
        } catch (error) {
            alert('Gagal mengambil data request donasi');
        }
    };

    useEffect(() => {
        fetchRequestDonasi();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
        try {
            if (editId) {
                console.log('Mengupdate request dengan ID:', editId);
                console.log('Data form:', form);
                await UpdatetRequest_donasi(editId, form);
                alert('Berhasil mengupdate request donasi');
            } else {
                await CreatetRequest_donasi(form);
                alert('Berhasil menambah request donasi');
            }
            resetForm();
            fetchRequestDonasi();
            const modal = window.bootstrap.Modal.getInstance(document.getElementById('formModal'));
            modal.hide();
        } catch (error) {
            console.error('ERROR HANDLE SUBMIT:', error);
            alert('Gagal menyimpan data request donasi');
        }
    }


    const handleEdit = async (id) => {
        try {
            const data = await GettRequest_donasiById(id);
            setForm({ request: data.request });
            setEditId(id);
            const modal = new window.bootstrap.Modal(document.getElementById('formModal'));
            modal.show();
        } catch (error) {
            alert('Gagal mengambil data request donasi');
            console.error(error);
        }
    }

    const resetForm = () => {
        setForm({ request: '' });
        setEditId(null);
    }

    return (
        <div className="container mt-5 bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Data Request Donasi</h2>
                <button
                    className="btn btn-success"
                    onClick={() => {
                        resetForm();
                        const modal = new window.bootstrap.Modal(document.getElementById('formModal'));
                        modal.show();
                    }}
                >
                    Tambah Request Donasi
                </button>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Request</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {requestDonasiList.length > 0 ? (
                        requestDonasiList.map((requestDonasi, index) => (
                        <tr key={requestDonasi.id}>
                            <td>{index + 1}</td>
                            <td>{requestDonasi.request}</td>
                            <td>
                                {/* <button
                                    className="btn btn-primary me-2"
                                    onClick={() => {
                                        setForm({ request: requestDonasi.request });
                                        setEditId(requestDonasi.id);
                                        const modal = new window.bootstrap.Modal(document.getElementById('formModal'));
                                        modal.show();
                                    }}
                                >
                                    Edit
                                </button> */}
                                <button
                                    className="btn btn-warning me-2"
                                    onClick={() => handleEdit(requestDonasi.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={async () => {
                                        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                                            try {
                                                await DeletetRequest_donasi(requestDonasi.id);
                                                alert('Berhasil menghapus request donasi');
                                                fetchRequestDonasi();
                                            } catch (error) {
                                                alert('Gagal menghapus data request donasi');
                                                console.error(error);
                                            }
                                        }
                                    }}
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                        <tr>
                            <td colSpan="3" className="text-center">Tidak ada data</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal Form */}
            <div className="modal fade" id="formModal" tabIndex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="formModalLabel">
                                {editId ? 'Edit Request Donasi' : 'Tambah Request Donasi'}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="request" className ="form-label">Request</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="request"
                                        name="request"
                                        value={form.request}
                                        onChange={handleChange}
                                        placeholder="Masukkan request donasi"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    {editId ? 'Update' : 'Simpan'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CRUDTransaksiRequestDonasi;
