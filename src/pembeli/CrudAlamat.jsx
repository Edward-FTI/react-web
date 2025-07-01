// CRUDAlamat.jsx

import React, { useEffect, useState } from 'react';
import {
    GetAllAlamat,
    CreateAlamat,
    DeleteAlamat
} from '../Api/apiAlamat';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const CRUDAlamat = () => {
    const [alamatList, setAlamatList] = useState([]);
    const [form, setForm] = useState({
        alamat: ''
    });

    const fetchAlamat = async () => {
        try {
            const data = await GetAllAlamat();
            setAlamatList(data);
        } catch (error) {
            alert('Gagal mengambil data alamat');
        }
    };

    useEffect(() => {
        fetchAlamat();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await CreateAlamat(form);
            alert('Berhasil menambah alamat');
            resetForm();
            fetchAlamat();
        } catch (error) {
            alert('Gagal menyimpan data alamat');
            console.error(error);
        }
    };

    const resetForm = () => {
        setForm({ alamat: '' });
    };

    return (
        <div className="container mt-5 bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Data Alamat</h2>
                <button
                    className="btn btn-success"
                    onClick={() => {
                        resetForm();
                        const modal = new window.bootstrap.Modal(document.getElementById('formModal'));
                        modal.show();
                    }}
                >
                    Tambah Data
                </button>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-light">
                    <tr>
                        <th>No</th>
                        <th>Alamat</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {alamatList.length > 0 ? (
                        alamatList.map((a, index) => (
                            <tr key={a.id}>
                                <td>{index + 1}</td>
                                <td>{a.alamat}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => {
                                            if (window.confirm('Yakin hapus data ini?')) {
                                                DeleteAlamat(a.id).then(fetchAlamat);
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
                            <td colSpan="3" className="text-center">Belum ada data alamat</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal */}
            <div className="modal fade" id="formModal" tabIndex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="formModalLabel">Tambah Alamat</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="alamat" className="form-label">Alamat</label>
                                <div className="mb-3">
                                    <input
                                        type='text'
                                        name="alamat"
                                        className="form-control"
                                        placeholder="Alamat"
                                        value={form.alamat}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary">
                                    Tambah
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CRUDAlamat;
