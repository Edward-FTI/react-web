import React, { useEffect, useState } from "react";
import {
  GetAllOrganisasi,
  UpdateOrganisasi,
  DeleteOrganisasi,
} from "../Api/apiOrganisasi";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom"; // ← tambahkan ini

const CRUDOrganisasi = () => {
  const [organisasiList, setOrganisasiList] = useState([]);
  const [form, setForm] = useState({
    id: "",
    nama: "",
    alamat: "",
    permintaan: "",
    email: "",
    no_hp: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate(); // ← dan ini

  const fetchOrganisasi = async () => {
    try {
      const data = await GetAllOrganisasi();
      setOrganisasiList(data);
    } catch (error) {
      alert("Gagal mengambil data organisasi");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrganisasi();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...form };

      if (isEdit) {
        await UpdateOrganisasi(dataToSubmit);
        alert("Berhasil mengupdate organisasi");
      } else {
        alert("Fitur tambah organisasi belum tersedia");
      }

      resetForm();
      fetchOrganisasi();
    } catch (error) {
      alert("Gagal menyimpan data organisasi");
      console.error(error);
    }
  };

  const handleEdit = (organisasi) => {
    setForm({ ...organisasi });
    setIsEdit(true);
    const modal = new window.bootstrap.Modal(
      document.getElementById("formModal")
    );
    modal.show();
  };

  const resetForm = () => {
    setForm({
      id: "",
      nama: "",
      alamat: "",
      permintaan: "",
      email: "",
      no_hp: "",
    });
    setIsEdit(false);
  };

  return (
    <div className="container mt-5 bg-white p-4 rounded shadow">
      {/* Tombol kembali ke halaman Pegawai */}
      {/* <div className="mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/admin/pegawai")}
        >
          &larr; ke Halaman Pegawai
        </button>
      </div> */}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Data Organisasi</h2>
        <button
          className="btn btn-success"
          onClick={() => {
            resetForm();
            const modal = new window.bootstrap.Modal(
              document.getElementById("formModal")
            );
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
            <th>Nama</th>
            <th>Alamat</th>
            <th>Permintaan</th>
            <th>Email</th>
            <th>No HP</th>
            <th>Aksi</th>
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
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(o)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      if (window.confirm("Yakin hapus data ini?")) {
                        DeleteOrganisasi(o.id).then(fetchOrganisasi);
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
              <td colSpan="7" className="text-center">
                Belum ada data organisasi
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      <div
        className="modal fade"
        id="formModal"
        tabIndex="-1"
        aria-labelledby="formModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="formModalLabel">
                {isEdit ? "Edit Organisasi" : "Tambah Organisasi"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <label htmlFor="nama" className="form-label">
                  Nama Organisasi
                </label>
                <div className="mb-3">
                  <input
                    type="text"
                    name="nama"
                    className="form-control"
                    placeholder="Nama Organisasi"
                    value={form.nama}
                    onChange={handleChange}
                    required
                  />
                </div>

                <label htmlFor="alamat" className="form-label">
                  Alamat
                </label>
                <div className="mb-3">
                  <input
                    type="text"
                    name="alamat"
                    className="form-control"
                    placeholder="Alamat"
                    value={form.alamat}
                    onChange={handleChange}
                    required
                  />
                </div>

                <label htmlFor="permintaan" className="form-label">
                  Permintaan
                </label>
                <div className="mb-3">
                  <input
                    type="text"
                    name="permintaan"
                    className="form-control"
                    placeholder="Permintaan"
                    value={form.permintaan}
                    onChange={handleChange}
                    required
                  />
                </div>

                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <label htmlFor="no_hp" className="form-label">
                  No HP
                </label>
                <div className="mb-3">
                  <input
                    type="tel"
                    name="no_hp"
                    className="form-control"
                    placeholder="No HP"
                    value={form.no_hp}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  {isEdit ? "Update" : "Tambah"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRUDOrganisasi;
