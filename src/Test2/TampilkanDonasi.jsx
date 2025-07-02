import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import jsPDF from "jspdf";
import "jspdf-autotable";

import logo from "../assets/Logo/logo.png";
// import "./DashboardCss.css";
import { toast } from "sonner";

import { GetAllCart, AddToCart, DeleteCart } from "../Api/apiCart";

const Donasi = () => {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCartOffcanvas, setShowCartOffcanvas] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const response = await axios.get("http://p3l.reusemart.fun/api/barang");

        // Filter hanya barang yang statusnya "Dijual"
        const barangDijual = response.data.data.filter(
          (item) => item.status_barang === "barang untuk Donasi"
        );

        setBarang(barangDijual);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching barang data:", error);
        setLoading(false);
      }
    };

    const fetchCart = async () => {
      try {
        const data = await GetAllCart();
        setCartItems(data);
      } catch (error) {
        console.error("Gagal mengambil data cart:", error);
      }
    };

    fetchBarang();
    fetchCart();
  }, []);

  const handleModalOpen = (item) => {
    const gambarArray = [];
    if (item.gambar) gambarArray.push(item.gambar);
    if (item.gambar_dua) gambarArray.push(item.gambar_dua);

    setSelectedBarang({ ...item, gambar_array: gambarArray });

    const detailModalElement = document.getElementById("detailBarangModal");
    if (detailModalElement) {
      const modal = new window.bootstrap.Modal(detailModalElement);
      modal.show();
    }
  };

  const handleModalClose = () => {
    setSelectedBarang(null);
    const detailModalElement = document.getElementById("detailBarangModal");
    if (detailModalElement) {
      const modal = window.bootstrap.Modal.getInstance(detailModalElement);
      if (modal) {
        modal.hide();
      }
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.text("Daftar Barang Donasi", 14, 15);

    const tableColumn = [
      "No",
      "Nama Barang",
      "Harga",
      "Berat",
      "Status Garansi",
      "Status Barang",
      "Tgl Penitipan",
      "Tgl Pengambilan",
    ];

    const tableRows = [];

    barang.forEach((item, index) => {
      const row = [
        index + 1,
        item.nama_barang,
        `Rp ${item.harga_barang}`,
        `${item.berat_barang} kg`,
        item.status_garansi,
        item.status_barang,
        item.tgl_penitipan || "-",
        item.tgl_pengambilan || "-",
      ];
      tableRows.push(row);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
    });

    doc.save("barang_donasi.pdf");
  };

  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = user?.role;

  return (
    <div>
      <main className="container mt-5">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>Nama Barang</th>
                <th>Harga</th>
                <th>Berat</th>
                <th>Deskripsi</th>
                <th>Status Garansi</th>
                <th>Status Barang</th>
                <th>Penitip</th>
                <th>Kategori</th>
                <th>Pegawai</th>
                <th>Hunter</th>
                <th>Tgl Penitipan</th>
                <th>Masa Penitipan</th>
                <th>Penambahan Durasi</th>
                <th>Tgl Pengambilan</th>
                <th>Gambar 1</th>
                <th>Gambar 2</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {barang.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.nama_barang}</td>
                  <td>Rp {item.harga_barang}</td>
                  <td>{item.berat_barang} kg</td>
                  <td>{item.deskripsi}</td>
                  <td>{item.status_garansi}</td>
                  <td>{item.status_barang}</td>
                  <td>{item.id_penitip}</td>
                  <td>{item.id_kategori}</td>
                  <td>{item.id_pegawai}</td>
                  <td>{item.id_hunter}</td>
                  <td>{item.tgl_penitipan}</td>
                  <td>{item.masa_penitipan}</td>
                  <td>{item.penambahan_durasi}</td>
                  <td>{item.tgl_pengambilan}</td>
                  <td>
                    <img
                      src={`http://p3l.reusemart.fun/${item.gambar}`}
                      alt="gambar"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>
                    <img
                      src={`http://p3l.reusemart.fun/${item.gambar_dua}`}
                      alt="gambar dua"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleModalOpen(item)}
                    >
                      Detail
                    </button>
                    <div className="mb-3">
                      <button
                        className="btn btn-danger"
                        onClick={handleExportPDF}
                      >
                        Export PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <div
        className="modal fade"
        id="detailBarangModal"
        tabIndex="-1"
        aria-labelledby="detailBarangModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="detailBarangModalLabel">
                {selectedBarang?.nama_barang}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleModalClose}
              ></button>
            </div>
            <div className="modal-body">
              {selectedBarang && (
                <>
                  <div
                    id="carouselModal"
                    className="carousel slide"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner border rounded">
                      {selectedBarang.gambar_array?.map((gambar, index) => (
                        <div
                          className={`carousel-item ${
                            index === 0 ? "active" : ""
                          }`}
                          key={index}
                        >
                          <img
                            src={`http://p3l.reusemart.fun/${gambar}`}
                            className="d-block mx-auto img-fluid p-3"
                            style={{ maxHeight: "300px", objectFit: "contain" }}
                            alt={`Gambar ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                    {selectedBarang.gambar_array?.length > 1 && (
                      <>
                        <button
                          className="carousel-control-prev"
                          type="button"
                          data-bs-target="#carouselModal"
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
                          data-bs-target="#carouselModal"
                          data-bs-slide="next"
                        >
                          <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                      </>
                    )}
                  </div>
                  <br />
                  <p>Nama Barang: {selectedBarang.nama_barang}</p>
                  <p>Harga: Rp{selectedBarang.harga_barang}</p>
                  <p>Status Garansi: {selectedBarang.status_garansi}</p>
                  <p>Deskripsi: {selectedBarang.deskripsi}</p>
                  <p>Status Barang: {selectedBarang.status_barang}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donasi;
