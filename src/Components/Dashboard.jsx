import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import logo from "../assets/Logo/logo.png";
import "./DashboardCss.css";
import { toast } from "sonner";

import { GetAllCart, AddToCart, DeleteCart } from "../Api/apiCart";

const Dashboard = () => {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCartOffcanvas, setShowCartOffcanvas] = useState(false);

  const navigate = useNavigate();

  const handleMasukClick = () => {
    navigate("/login");
  };
    const daftar = () => {
    navigate("/register");
  };

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const response = await axios.get("http://103.175.219.103/api/barang");

        // Filter hanya barang yang statusnya "Dijual"
        const barangDijual = response.data.data.filter(
          (item) => item.status_barang === "Dijual"
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

  const handleAddToCart = async () => {
    if (selectedBarang) {
      const isItemInCart = cartItems.some(
        (item) => item.id_barang === selectedBarang.id
      );

      if (isItemInCart) {
        toast.info(`${selectedBarang.nama_barang} sudah ada di keranjang.`);
      } else {
        try {
          await AddToCart({ id_barang: selectedBarang.id });
          const updatedCart = await GetAllCart();
          setCartItems(updatedCart);
          toast.success(
            `${selectedBarang.nama_barang} berhasil ditambahkan ke keranjang!`
          );
        } catch (error) {
          toast.error("Gagal menambahkan ke keranjang.");
        }
      }

      handleModalClose();
    }
  };

  const handleRemoveFromCart = async (cartId) => {
    try {
      await DeleteCart(cartId);
      const updatedCart = await GetAllCart();
      setCartItems(updatedCart);
      toast.info("Barang dihapus dari keranjang.");
    } catch (error) {
      toast.error("Gagal menghapus barang dari keranjang.");
    }
  };

  const toggleCartOffcanvas = () => {
    setShowCartOffcanvas(!showCartOffcanvas);
    const offcanvasElement = document.getElementById("cartOffcanvas");
    if (offcanvasElement) {
      const offcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
      if (showCartOffcanvas) {
        offcanvas.hide();
      } else {
        offcanvas.show();
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = user?.role;

  return (
    <div>
      <header className="bg-white shadow-sm sticky-top">
        <div className="container py-2">
          <div className="d-flex align-items-center justify-content-between">
            <a className="d-flex align-items-center logo" href="#">
              <img src={logo} alt="Logo" width="35" />
              <h5 className="ms-2 mb-0 text-success">reusemart</h5>
            </a>

            <div className="flex-grow-1 mx-4">
              <form className="d-flex">
                <input
                  type="text"
                  className="form-control search-box"
                  placeholder="Cari di reusemart"
                />
                <button
                  className="btn btn-outline-secondary ms-2"
                  type="submit"
                >
                  <img
                    src="https://img.icons8.com/?size=100&id=132&format=png&color=000000"
                    alt="search"
                    width="15"
                  />
                </button>
              </form>
            </div>

            <div className="d-flex align-items-center">
              <>
                <button
                  className="btn btn-outline-success me-2"
                  onClick={handleMasukClick}
                >
                  Masuk
                </button>
                <button className="btn btn-outline-success me-2" onClick={daftar}>Daftar</button>
              </>

              <button
                className="btn btn-outline-success d-flex justify-content-center align-items-center position-relative"
                style={{ width: "35px", height: "35px" }}
                onClick={toggleCartOffcanvas}
              >
                <i className="bi bi-cart3 fs-4"></i>
                {role === "Pembeli" && cartItems.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItems.length}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                )}
              </button>

              {role === "Pembeli" && (
                <button
                  className="btn d-flex justify-content-center ms-2 p-0"
                  style={{ width: "40px", height: "40px" }}
                  onClick={() => navigate("/customer/profile")}
                >
                  <img
                    src="https://img.icons8.com/?size=100&id=108294&format=png&color=000000"
                    alt="user"
                    width="40"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mt-5">
        <div className="row row-cols-1 row-cols-md-5 g-2">
          {barang.map((item) => (
            <div className="col" key={item.id}>
              <div
                className="card p-2"
                style={{ cursor: "pointer" }}
                onClick={() => handleModalOpen(item)}
              >
                <img
                  src={`http://103.175.219.103/${item.gambar}`}
                  className="card-img-top"
                  alt={item.nama_barang}
                />
                <div className="card-body pt-2 pb-1">
                  <h5 className="card-title mb-1">{item.nama_barang}</h5>
                  <p className="card-text fw-semibold">
                    Rp {item.harga_barang}
                  </p>
                </div>
              </div>
            </div>
          ))}
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
                            src={`http://103.175.219.103:8000/${gambar}`}
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
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleModalClose}
              >
                Tutup
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleAddToCart}
              >
                + Keranjang
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`offcanvas offcanvas-end ${showCartOffcanvas ? "show" : ""}`}
        tabIndex="-1"
        id="cartOffcanvas"
        aria-labelledby="cartOffcanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="cartOffcanvasLabel">
            Keranjang Belanja ({cartItems.length})
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={toggleCartOffcanvas}
          ></button>
        </div>
        <div className="offcanvas-body">
          {cartItems.length === 0 ? (
            <p>Keranjang Anda kosong.</p>
          ) : (
            <ul className="list-group">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={`http://103.175.219.103/${item.barang.gambar}`}
                      alt={item.barang.nama_barang}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "5px",
                        marginRight: "10px",
                      }}
                    />
                    <div>
                      <h6 className="mb-0">{item.barang.nama_barang}</h6>
                      <small className="text-muted">
                        Rp {item.barang.harga_barang}
                      </small>
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          )}
          {cartItems.length > 0 && (
            <div className="mt-3">
              <button
                className="btn btn-success w-100"
                onClick={() => navigate("/pembayaran")}
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
