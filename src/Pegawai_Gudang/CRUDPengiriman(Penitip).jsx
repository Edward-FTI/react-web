// CRUDPengiriman(Penitip).jsx

import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "sonner";
import Select from "react-select";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";

import {
  GetAllBarang,
  CreateBarang,
  UpdateBarang, // Keep this if you use it elsewhere for full updates
  DeleteBarang,
  UpdateBarangStatus, // <-- Import the new API function
} from "../Api/apiBarang";
import { GetAllKategori } from "../Api/apiKategori";
import { GetAllPenitip } from "../Api/apiPenitip";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const CRUDPengirimanPenitip = () => {
  const [barangList, setBarangList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [penitipList, setPenitipList] = useState([]); // Don't forget to define penitipList
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBarangList, setFilteredBarangList] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null);

  const handleShowDetail = (barang) => {
    setSelectedBarang(barang);
    const modal = new window.bootstrap.Modal(
      document.getElementById("detailModal")
    );
    modal.show();
  };

  const [form, setForm] = useState({
    id: "",
    id_penitip: "",
    id_kategori: "",
    tgl_penitipan: "",
    nama_barang: "",
    harga_barang: "",
    berat_barang: "",
    deskripsi: "",
    status_garansi: "",
    status_barang: "diambil kembali",
    gambar: "",
    gambar_dua: "",
  });

  const fetchBarang = async () => {
    try {
      const data = await GetAllBarang();
      // Filter for 'diambil' status to show only relevant items for this page
      const filtered = data.filter(
        (b) => b.status_barang.toLowerCase() === "diambil"
      );
      setBarangList(filtered);
      setFilteredBarangList(filtered);
    } catch (error) {
      toast.error("Gagal mengambil data barang");
    }
  };

  const handleSearch = () => {
    const search = searchTerm.toLowerCase();

    const filtered = barangList.filter((b) => {
      return (
        b.nama_barang?.toLowerCase().includes(search) ||
        b.penitip?.nama_penitip?.toLowerCase().includes(search) ||
        b.kategori_barang?.nama_kategori?.toLowerCase().includes(search) ||
        b.status_barang?.toLowerCase().includes(search) ||
        b.status_garansi?.toLowerCase().includes(search) ||
        b.deskripsi?.toLowerCase().includes(search) ||
        b.tgl_penitipan?.toLowerCase().includes(search) ||
        b.masa_penitipan?.toLowerCase().includes(search) ||
        b.harga_barang?.toString().toLowerCase().includes(search) ||
        b.berat_barang?.toString().toLowerCase().includes(search) ||
        b.pegawai?.nama?.toLowerCase().includes(search)
      );
    });

    setFilteredBarangList(filtered);
  };

  const fetchKategori = async () => {
    try {
      const data = await GetAllKategori();
      setKategoriList(data);
    } catch (error) {
      toast.error("Gagal mengambil data kategori");
    }
  };

  const fetchPenitip = async () => {
    try {
      const data = await GetAllPenitip();
      setPenitipList(data); // Set penitipList
    } catch (error) {
      toast.error("Gagal mengambil data penitip");
    }
  };

  useEffect(() => {
    fetchBarang();
    fetchKategori();
    fetchPenitip();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handelKonfirmasi = async (e, barang) => {
    e.preventDefault();

    try {
      // Call the new API endpoint specifically for status updates
      await UpdateBarangStatus(barang.id, "transaksi_selesai");

      // Update the local state to reflect the change immediately
      const updatedBarangList = barangList.map((item) =>
        item.id === barang.id
          ? { ...item, status_barang: "transaksi_selesai" }
          : item
      );
      // Re-filter to remove the item from the 'diambil' list if it's now 'transaksi_selesai'
      const reFiltered = updatedBarangList.filter(
        (b) => b.status_barang.toLowerCase() === "diambil"
      );
      setBarangList(reFiltered);
      setFilteredBarangList(reFiltered);

      toast.success(
        `Status barang '${barang.nama_barang}' berhasil diubah menjadi 'transaksi selesai'`
      );

      // No need to open the form modal or set isEdit true here,
      // as this action is just a status update, not an edit operation of the whole form.
      // If you still want to show the form modal with the updated data,
      // you would need to fetch the full updated barang object and set the form with it.
      // For now, let's assume this button just updates the status and refreshes the list.
    } catch (error) {
      console.error(
        "Gagal mengubah status barang:",
        error.response?.data || error
      ); // Log detailed error
      toast.error("Gagal mengubah status barang");
    }
  };

  const handleEdit = (barang) => {
    setForm({ ...barang, gambar: "", gambar_dua: "" });
    setIsEdit(true);
    const modal = new window.bootstrap.Modal(
      document.getElementById("formModal")
    );
    modal.show();
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Yakin ingin menghapus data ini?")) {
        await DeleteBarang(id); // Menghapus barang berdasarkan ID
        toast.success("Data barang berhasil dihapus");
        fetchBarang(); // Mengambil data terbaru
      }
    } catch (error) {
      console.error("Gagal menghapus data barang:", error);
      toast.error("Gagal menghapus data barang");
    }
  };

  const resetForm = () => {
    setForm({
      id: "",
      id_penitip: "",
      id_kategori: "",
      tgl_penitipan: "",
      nama_barang: "",
      harga_barang: "",
      berat_barang: "",
      deskripsi: "",
      status_garansi: "",
      status_barang: "",
      gambar: "",
      gambar_dua: "",
    });
    setIsEdit(false);
  };

  return (
    <div className="container mt-5 bg-white p-4 rounded shadow">
      {/* Header: Judul & Tombol Tambah */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Data Pengiriman Penitip</h2>
      </div>

      {/* Navigasi Penitip & Pembeli + Pencarian */}
      <div className="row mb-4">
        <div className="col-md-6 d-flex gap-2">
          <Link
            to="/gudang/pengiriman/penitip"
            className="btn btn-outline-primary"
          >
            Halaman Penitip
          </Link>
          <Link
            to="/gudang/pengiriman/pembeli"
            className="btn btn-outline-secondary"
          >
            Halaman Pembeli
          </Link>
        </div>
        <div className="col-md-6">
          <form
            className="d-flex"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <input
              type="search"
              name="cari"
              className="form-control me-2"
              placeholder="Cari barang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-primary" type="submit">
              Cari
            </button>
          </form>
        </div>
      </div>

      {/* Tabel Barang */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>No</th>
            <th>Nama Penitip</th>
            <th>Kategori Barang</th>
            <th>Tanggal Penitipan</th>
            <th>Masa Penitipan</th>
            <th>Nama Barang</th>
            <th>Harga Barang</th>
            <th>Deskripsi</th>
            <th>Status Barang</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredBarangList.length > 0 ? (
            filteredBarangList.map((b, index) => (
              <tr key={b.id}>
                <td>{index + 1}</td>
                <td>{b.penitip.nama_penitip}</td>
                <td>
                  {b.kategori_barang.nama_kategori ||
                    "Kategori tidak ditemukan"}
                </td>
                <td>{b.tgl_penitipan}</td>
                <td>{b.masa_penitipan}</td>
                <td>{b.nama_barang}</td>
                <td>{b.harga_barang}</td>
                <td>{b.deskripsi}</td>
                <td>{b.status_barang}</td>
                <td>
                  <div className="d-flex flex-column">
                    <button
                      className="btn btn-sm btn-primary mb-1"
                      onClick={() => handleShowDetail(b)}
                    >
                      Detail
                    </button>
                    <button
                      className="btn btn-sm btn-success mb-1"
                      onClick={(e) => handelKonfirmasi(e, b)}
                    >
                      Konfirmasi
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center fs-5">
                Belum ada data barang
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal untuk detail barang */}
      <div
        className="modal fade"
        id="detailModal"
        tabIndex="-1"
        aria-labelledby="detailModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="detailModalLabel">
                Detail Barang
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedBarang && (
                <div className="row">
                  <div className="col-md-6">
                    <div
                      id="carouselGambar"
                      className="carousel slide"
                      data-bs-ride="carousel"
                    >
                      <div className="carousel-inner">
                        <div className="carousel-item active">
                          <img
                            src={`http://103.175.219.103/${selectedBarang.gambar}`}
                            className="d-block w-100 rounded"
                            alt="Gambar 1"
                            style={{ maxHeight: "300px", objectFit: "contain" }}
                          />
                        </div>
                        {selectedBarang.gambar_dua && (
                          <div className="carousel-item">
                            <img
                              src={`http://103.175.219.103/${selectedBarang.gambar_dua}`}
                              className="d-block w-100 rounded"
                              alt="Gambar 2"
                              style={{
                                maxHeight: "300px",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselGambar"
                        data-bs-slide="prev"
                      >
                        <span
                          className="carousel-control-prev-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselGambar"
                        data-bs-slide="next"
                      >
                        <span
                          className="carousel-control-next-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h5>{selectedBarang.nama_barang}</h5>
                    <p>
                      <strong>Status Garansi:</strong>{" "}
                      {selectedBarang.status_garansi}
                    </p>
                    <p>
                      <strong>Penitip:</strong>{" "}
                      {selectedBarang.penitip.nama_penitip}
                    </p>
                    <p>
                      <strong>Kategori:</strong>{" "}
                      {selectedBarang.kategori_barang.nama_kategori}
                    </p>
                    <p>
                      <strong>Berat Barang:</strong>{" "}
                      {selectedBarang.berat_barang} kg
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRUDPengirimanPenitip;