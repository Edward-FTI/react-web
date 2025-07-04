
import React from "react";
import './link-sidebar-css.css';
import { Link } from 'react-router-dom';

const LinkSidebar = () => {

  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = user?.role;

  return (
    <div className="d-flex flex-column gap-3">
      {/* Hanya admin */}
      {role === "Admin" && (
        <>
          <Link
            to=""
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=iPqKoSmxmAyJ&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Dashboard
          </Link>
          <Link
            to="pegawai/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Data Pegawai
          </Link>
          <Link
            to="organisasi/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13547&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Data Organisasi
          </Link>
        </>
      )}

      {role === "Penitip" && (
        <>
          <Link
            to="/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=iPqKoSmxmAyJ&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Dashboard
          </Link>
          <Link
            to="Profile/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13547&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Profile
          </Link>
          <Link
            to="/penitip/pengambilan/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Data Barang
          </Link>

          <Link
            to="/penitip/saldo/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Tarik Saldo
          </Link>

        </>
      )}

      {/* Customer Service */}
      {role === "Customer Service" && (
        <>
          <Link
            to="penitip/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Penitip
          </Link>

          <Link
            to="diskusi/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Diskusi
          </Link>
          <Link
            to="merchandise/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=FYDMKDveHa85&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Merchandise
          </Link>

          <Link
            to="verifikasi/"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=UIlTiRUlZuzZ&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Verifikasi Pembayaran
          </Link>
        </>
      )}

      {/* Pegawai Gudang */}
      {role === "Pegawai Gudang" && (
        <>
          <Link
            to="barang-titipan"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=hSUoULMc0FvV&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Barang Titipan
          </Link>

          <Link
            to="pengiriman/pembeli"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=11910&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Pengiriman
          </Link>

          <Link
            to="responsi"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=11910&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Responsi
          </Link>
        </>
      )}

      {role === "Owner" && (
        <>
          <Link
            to="request-donasi"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=gEoGYhaNOcQl&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Request Donasi
          </Link>

          <Link
            to="penjualan-bulanan"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=11890&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Laporan Penjualan Bulanan
          </Link>

          <Link
            to="komisi-bulanan"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=JI2bnOlUlrmw&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Laporan Komisi Bulanan
          </Link>

          <Link
            to="stok-gudang"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=j87nOIHCmSZK&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Laporan Stok Gudang
          </Link>

          <Link
            to="masa-penitipan"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Masa Penitipan
          </Link>
          <Link
            to="kategori-barang"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13547&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Kategori Barang
          </Link>
          <Link
            to="donasi-barang"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=h3GqI1r0bWil&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Laporan Donasi
          </Link>
          <Link
            to="request/donasi"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=gEoGYhaNOcQl&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Laporan Request Donasi
          </Link>
          <Link
            to="laporan-penitip"
            className="d-flex align-items-center gap-2 text-white link-side"
          >
            <img
              src="https://img.icons8.com/?size=100&id=13042&format=png&color=000000"
              alt=""
              width="30"
              className="d-inline-block"
            />
            Laporan Penitip
          </Link>
        </>
      )}
    </div>
  );

}
export default LinkSidebar;
