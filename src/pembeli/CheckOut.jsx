import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { GetAllCart } from "../Api/apiCart";
import { GetAllAlamat } from "../Api/apiAlamat";
import { GetPembeliInfo } from "../Api/apiPembeli";
import { Createtransaksi_penjualan } from "../Api/apitransaksi_penjualans";

const OrderForm = () => {
  const [deliveryMethod, setDeliveryMethod] = useState("shipped");
  const [address, setAddress] = useState("");
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [availableAddresses, setAvailableAddresses] = useState([]);
  const [buyerPoints, setBuyerPoints] = useState(0);
  const [buyerSaldo, setBuyerSaldo] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [selectedCartIds, setSelectedCartIds] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [proof, setProof] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (showUpload) {
      setTimer(60);
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            if (!proof) {
              alert(
                "Melebihi Batas Waktu Konfirmasi Pembayaran, Transaksi Gagal!"
              );
              navigate("/");
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [showUpload, navigate]);

  const fetchData = async () => {
    try {
      const cart = await GetAllCart();
      setCartItems(cart);
      setSelectedCartIds(cart.map((item) => item.id));

      const alamatList = await GetAllAlamat();
      setAvailableAddresses(alamatList.map((a) => a.alamat));

      const pembeli = await GetPembeliInfo();
      setBuyerPoints(pembeli.point || 0);
      setBuyerSaldo(pembeli.saldo || 0);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      alert("Gagal mengambil data. Silakan coba lagi.");
    }
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setShowUpload(true);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!proof) {
      alert(
        "Anda harus mengupload bukti pembayaran sebelum konfirmasi pembayaran."
      );
      return;
    }
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsSubmitting(true);

    const formData = new FormData();
    const metode_pengiriman =
      deliveryMethod === "pickup" ? "diambil" : "diantar";
    formData.append("metode_pengiriman", metode_pengiriman);
    formData.append(
      "alamat_pengiriman",
      metode_pengiriman === "diantar" ? address : ""
    );
    formData.append("poin_digunakan", pointsToRedeem);
    formData.append("bukti_pembayaran", proof);
    formData.append("status_pengiriman", "diantar");
    formData.append("status_pembelian", "Diproses");
    formData.append("verifikasi_pembayaran", false);

    selectedCartIds.forEach((id, i) =>
      formData.append(`selected_cart_ids[${i}]`, id)
    );

    try {
      await Createtransaksi_penjualan(formData);
      navigate("/customer/profile");
    } catch (err) {
      console.error("Error saat submit:", err);
    }
  };

  const totalHarga = cartItems.reduce(
    (acc, item) => acc + (item.barang?.harga_barang || 0),
    0
  );

  const ongkir =
    deliveryMethod === "pickup" ? 0 : totalHarga >= 1500000 ? 0 : 100000;

  const diskon = pointsToRedeem * 100;
  const totalPembayaran = Math.max(totalHarga + ongkir - diskon, 0);

  return (
    <div className="container my-5">
      <div className="p-4 shadow rounded bg-light">
        <h2 className="mb-4 text-center">Form Pemesanan</h2>

        {!showUpload ? (
          <form onSubmit={handleInitialSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Metode Pengiriman:</label>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="shipped"
                  className="form-check-input"
                  value="shipped"
                  checked={deliveryMethod === "shipped"}
                  onChange={() => setDeliveryMethod("shipped")}
                />
                <label htmlFor="shipped" className="form-check-label">
                  Dikirim
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="pickup"
                  className="form-check-input"
                  value="pickup"
                  checked={deliveryMethod === "pickup"}
                  onChange={() => setDeliveryMethod("pickup")}
                />
                <label htmlFor="pickup" className="form-check-label">
                  Ambil Sendiri
                </label>
              </div>
            </div>

            {deliveryMethod === "shipped" && (
              <div className="mb-3">
                <label htmlFor="addressSelect" className="form-label">
                  Alamat Pengiriman
                </label>
                <select
                  id="addressSelect"
                  className="form-select"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                >
                  <option value="">Pilih Alamat...</option>
                  {availableAddresses.map((addr, idx) => (
                    <option key={idx} value={addr}>
                      {addr}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-3">
              <h5>Informasi Pembeli</h5>
              <p>
                💰 <strong>Saldo: </strong>
                Rp{buyerSaldo.toLocaleString("id-ID")}
              </p>
              <p>
                ⭐ <strong>Poin: </strong>
                {buyerPoints} poin
              </p>
            </div>

            <div className="mb-3">
              <label className="form-label">Gunakan Poin:</label>
              <input
                type="number"
                className="form-control"
                value={pointsToRedeem}
                min={0}
                max={buyerPoints}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setPointsToRedeem(
                    isNaN(value) ? 0 : Math.min(value, buyerPoints)
                  );
                }}
              />
              <div className="form-text">
                1 poin = Rp100 | Maksimal: {buyerPoints} poin
              </div>
            </div>

            <div className="mb-4">
              <h5>Ringkasan Pesanan</h5>
              <ul className="list-group mb-2">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{item.barang?.nama_barang}</span>
                    <span>
                      Rp{item.barang?.harga_barang?.toLocaleString("id-ID")}
                    </span>
                  </li>
                ))}
              </ul>
              <p>
                Total Harga Barang:{" "}
                <strong>Rp{totalHarga.toLocaleString("id-ID")}</strong>
              </p>
              <p>
                Ongkir: <strong>Rp{ongkir.toLocaleString("id-ID")}</strong>
              </p>
              <p>
                Diskon Poin: <strong>Rp{diskon.toLocaleString("id-ID")}</strong>
              </p>
              <p>
                Total Pembayaran:{" "}
                <strong className="text-danger">
                  Rp{totalPembayaran.toLocaleString("id-ID")}
                </strong>
              </p>
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className={`btn btn-lg ${
                  buyerSaldo < totalPembayaran ? "btn-secondary" : "btn-success"
                }`}
                disabled={buyerSaldo < totalPembayaran}
              >
                {buyerSaldo < totalPembayaran
                  ? "Saldo Tidak Cukup"
                  : "Bayar Sekarang"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit}>
            <div className="mb-2 text-end text-danger fw-bold">
              Waktu tersisa: {timer} detik
            </div>
            <div className="mb-4">
              <label htmlFor="proof" className="form-label">
                Upload Bukti Pembayaran:
              </label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                id="proof"
                required
                onChange={(e) => setProof(e.target.files[0])}
              />
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim..." : "Konfirmasi Pembayaran"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
