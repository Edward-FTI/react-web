import React, { useEffect, useState } from "react";
// import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "sonner";
import Select from "react-select";

import {
  GetTransaksi_Penitipan,
  GetTransaksi_PenitipanById,
  GetTransaksi_PenitipanByNama,
  CreatetTransaksi_Penitipan,
  UpdatetTransaksi_Penitipan,
} from "../Api/apiTransaksi_penitip";

import { GetAllKategori } from "../Api/apiKategori";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Transaksi_penitip = () => {
  const [barangList, setBarangList] = useState([]);
  const [penitipList, setPenitipList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBarangList, setFilteredBarangList] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [selectedPengambilanBarang, setSelectedPengambilanBarang] =
    useState(null);
  const [tglPengambilan, setTglPengambilan] = useState("");

  const [form, setForm] = useState({
    id: "",
    id_kategori: "",
    tgl_penitipan: "",
    penambahan_durasi: "",
    nama_barang: "",
    harga_barang: "",
    deskripsi: "",
    status_garansi: "",
    status_barang: "",
    gambar: "",
    gambar_dua: "",
  });

  const [loading, setLoading] = useState(false);

  const fetchBarang = async () => {
    setLoading(true);
    try {
      const data = await GetTransaksi_Penitipan();

      // Filter barang yang status_barang-nya bukan "barang untuk Donasi"
      const filteredData = data.filter(
        (item) => item.status_barang !== "barang untuk Donasi"
      );

      setBarangList(filteredData);
      setFilteredBarangList(filteredData);
    } catch (error) {
      toast.error("Gagal mengambil data barang");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const search = searchTerm.toLowerCase();

    const filteredData = barangList.filter((b) => {
      return (
        b.nama_barang?.toLowerCase().includes(search) ||
        b.penitip?.nama_penitip?.toLowerCase().includes(search) ||
        b.kategori_barang?.nama_kategori?.toLowerCase().includes(search) ||
        b.status_barang?.toLowerCase().includes(search) ||
        b.tgl_penitipan?.toLowerCase().includes(search) ||
        b.masa_penitipan?.toLowerCase().includes(search) ||
        b.harga_barang?.toString().includes(search) ||
        b.deskripsi?.toLowerCase().includes(search) ||
        getSisaHari(b.masa_penitipan)?.toString().includes(search)
      );
    });

    setFilteredBarangList(filteredData);
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
      setPenitipList(data);
    } catch (error) {
      // toast.error('Gagal mengambil data penitip');
    }
  };

  useEffect(() => {
    fetchBarang();
    fetchKategori();
    fetchPenitip();
  }, []);

  const getSisaHari = (masaPenitipan) => {
    const today = new Date();
    const endDate = new Date(masaPenitipan);
    const diffTime = endDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handlePengambilan = (barang) => {
    const sisaHari = getSisaHari(barang.masa_penitipan);
    if (sisaHari <= 0) {
      setSelectedPengambilanBarang(barang);
      setTglPengambilan(""); // reset
      const modal = new window.bootstrap.Modal(
        document.getElementById("pengambilanModal")
      );
      modal.show();
    } else {
      toast.info("Barang hanya bisa diambil jika masa penitipan telah habis.");
    }
  };

  const handleSubmitPengambilan = async () => {
    const masaPenitipanDate = new Date(
      selectedPengambilanBarang.masa_penitipan
    );
    const inputDate = new Date(tglPengambilan);
    const diffDays = Math.ceil(
      (inputDate - masaPenitipanDate) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0 || diffDays > 7) {
      toast.error(
        "Tanggal pengambilan harus dalam 7 hari setelah masa penitipan."
      );
      return;
    }

    try {
      await UpdatetTransaksi_Penitipan(selectedPengambilanBarang.id, {
        ...selectedPengambilanBarang,
        tgl_pengambilan: tglPengambilan,
        status_barang: "Diambil",
      });

      toast.success("Barang berhasil diambil.");
      fetchBarang();
      const modal = window.bootstrap.Modal.getInstance(
        document.getElementById("pengambilanModal")
      );
      modal.hide();
    } catch (error) {
      toast.error("Gagal memperbarui data pengambilan.");
    }
  };

  const handleUpdateTanggalPenitipan = async (barang) => {
    const sisaHariStr = getSisaWaktuPenitipan(
      barang.tgl_penitipan,
      barang.masa_penitipan
    );
    const sisaHari = sisaHariStr == "Kadaluarsa" ? 0 : parseInt(sisaHariStr);

    // Jika masa penitipan habis dan belum pernah diperpanjang (null atau 0)
    if (
      sisaHari <= 0 &&
      (barang.penambahan_durasi === null || barang.penambahan_durasi === 0)
    ) {
      try {
        const newMasaPenitipan = new Date(barang.masa_penitipan);
        newMasaPenitipan.setDate(newMasaPenitipan.getDate() + 31);

        await UpdatetTransaksi_Penitipan(barang.id, {
          ...barang,
          masa_penitipan: newMasaPenitipan.toISOString().split("T")[0],
          penambahan_durasi: 1,
          tgl_pengambilan: null, // Reset tanggal pengambilan
        });

        toast.success("Berhasil menambah 30 hari masa penitipan");
        fetchBarang();
      } catch (error) {
        toast.error("Gagal memperbarui masa penitipan");
      }
    } else {
      toast.info(
        "Penambahan durasi hanya bisa dilakukan jika masa penitipan habis dan belum pernah diperpanjang."
      );
    }
  };

  const getSisaWaktuPenitipan = (tglPenitipan, masaPenitipan) => {
    const today = new Date();
    const endDate = new Date(masaPenitipan);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `${diffDays} hari`;
  };

  const handleShowDetail = (barang) => {
    setSelectedBarang(barang);
    const modal = new window.bootstrap.Modal(
      document.getElementById("detailModal")
    );
    modal.show();
  };

  return (
    <div className="container mt-5 bg-white p-4 rounded shadow">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>Data Barang</h2>
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
              style={{ width: "250px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-primary" type="submit">
              Cari
            </button>
          </form>
        </div>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>No</th>
            {/* <th>Nama Penitip</th> */}
            <th>Kategori Barang</th>
            <th>Tanggal Penitipan</th>
            <th>Masa Penitipan</th>
            <th>Sisa Masa penitipan</th>
            <th>Nama Barang</th>
            <th>Harga Barang</th>
            <th>Deskripsi</th>
            <th>Status Barang</th>
            <th>Tanggal Pengambilan</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {filteredBarangList.length > 0 ? (
            filteredBarangList.map((b, index) => (
              <tr key={b.id}>
                <td>{index + 1}</td>
                {/* <td>{b.penitip?.nama_penitip}</td> */}
                <td>
                  {b.kategori_barang?.nama_kategori ||
                    "Kategori tidak ditemukan"}
                </td>
                <td>{b.tgl_penitipan}</td>
                <td>{b.masa_penitipan}</td>
                <td>
                  {getSisaWaktuPenitipan(b.tgl_penitipan, b.masa_penitipan)}
                </td>
                <td>{b.nama_barang}</td>
                <td>{b.harga_barang}</td>
                <td>{b.deskripsi}</td>
                <td>{b.status_barang}</td>
                <td>{b.tgl_pengambilan}</td>
                <td>
                  <div className="d-flex flex-column">
                    <button
                      className="btn btn-sm btn-primary me-2 mt-2"
                      onClick={() => handleShowDetail(b)}
                    >
                      Detail
                    </button>

                    {b.status_barang !== "Diambil" &&
                      b.status_barang !== "barang untuk Donasi" && (
                        <>
                          <button
                            className="btn btn-sm btn-warning me-2 mt-2"
                            onClick={() => handleUpdateTanggalPenitipan(b)}
                          >
                            Perpanjang
                          </button>
                          <button
                            className="btn btn-sm btn-success me-2 mt-2"
                            onClick={() => handlePengambilan(b)}
                          >
                            Ambil Barang
                          </button>
                        </>
                      )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">
                Tidak ada data ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Detail */}
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
                aria-label="Tutup"
              ></button>
            </div>
            <div className="modal-body">
              {selectedBarang && (
                <div>
                  <p>
                    <strong>Nama Barang:</strong> {selectedBarang.nama_barang}
                  </p>
                  <p>
                    <strong>Deskripsi:</strong> {selectedBarang.deskripsi}
                  </p>
                  <p>
                    <strong>Harga:</strong> {selectedBarang.harga_barang}
                  </p>
                  <p>
                    <strong>Kategori:</strong>{" "}
                    {selectedBarang.kategori_barang?.nama_kategori}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedBarang.status_barang}
                  </p>
                  <p>
                    <strong>Penitip:</strong>{" "}
                    {selectedBarang.penitip?.nama_penitip}
                  </p>
                  <img
                    src={selectedBarang.gambar}
                    alt="Gambar Barang"
                    className="img-fluid"
                  />
                  <img
                    src={selectedBarang.gambar_dua}
                    alt="Gambar Barang 2"
                    className="img-fluid mt-2"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Pengambilan */}
      <div
        className="modal fade"
        id="pengambilanModal"
        tabIndex="-1"
        aria-labelledby="pengambilanModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="pengambilanModalLabel">
                Konfirmasi Pengambilan
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Tutup"
              ></button>
            </div>
            <div className="modal-body">
              <p>Masukkan tanggal pengambilan barang:</p>
              <input
                type="date"
                className="form-control"
                value={tglPengambilan}
                onChange={(e) => setTglPengambilan(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Batal
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmitPengambilan}
              >
                Konfirmasi Pengambilan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaksi_penitip;
