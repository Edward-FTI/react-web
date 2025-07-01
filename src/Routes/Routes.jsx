import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

// Komponen Umum
import NavbarPage from "../Components/Navbar";
import Footer from "../Components/Footer";
import Dashboard from "../Components/Dashboard";
import Login from "../Components/Login";
import RegisterPage from "../Components/pageReg/regisPage";
import RegisterOrgPage from "../Components/pageReg/regisOrgPage";
import ForgetPassword from "../Components/ForgetPassword";
import ResetPassword from "../Components/resetPassword";
import AmbilBarang from "../Components/AmbilBarang";

// CUSTOMER SERVICE
// import NavbarCustomer_Service from "../navbar/NavbarCustomer_Service";
import CRUDPenitip from "../Customer_Service/CRUDPenitip";
import CRUDDiskusi from "../Customer_Service/CRUDDiskusi";
import VerifikasiPembayaran from "../Customer_Service/VerifikasiPembayaran";
import Merchandise from "../Customer_Service/merchandise";

// ADMIN
import Admin from "../Admin/Admin";
// import CRUDJabatan from "../admin/CRUDJabatan";
// import CRUDMercandise from "../admin/CRUDMercandise";
import CRUDOrganisasi from "../Admin/CRUDOrganisasi";

// PEGAWAI GUDANG
import NavbarGudang from "../navbar/NavbarPegawai_gudang";
import CRUDBarangTitipan from "../Pegawai_Gudang/CRUDBarangTitipan";
import CRUDPengirimanPembeli from "../Pegawai_Gudang/CRUDPengiriman(Pembeli)";
import UjianKelas from "../Pegawai_Gudang/UjianKelas"; // Sementara untuk testing
import CRUDPengirimanPenitip from "../Pegawai_Gudang/CRUDPengiriman(Penitip)";

// CUSTOMER
import NavbarCustomer from "../navbar/NavbarCustomer";
import ShowProfileCustomer from "../Customers/ShowProfileCustomer";
import ShowHistoryCustomer from "../Customers/ShowHistoryCustomer";
import CRUDTransaksiPenjualanCustomer from "../Customers/CRUDTransaksiPenjualanCustomer";

// PENITIP
import ShowProfilePenitip from "../Penitip/ShowProfilePenitip";
import ShowHistoryPenitip from "../penitip/ShowHistoryPenitip";
import CRUDPenitipan from "../penitip/CRUDPenitipan";
import PengambilanBarangKembali from "../Penitip/PengambilanBarangKembali";

// ORGANISASI
import CRUDTransaksiRequestDonasi from "../Organisasi/CRUDTransaksiRequestDonasi";
import Organisasi from "../Organisasi/Organisasi";
import Layout from "../navbar/layout";

// OWNER
import Owner from "../Owner/Owner";
import PenjualanBulanan from "../Owner/PenjualanBulanan";
import KomisiBulanan from "../Owner/KomisiBulanan";
import StokGudang from "../Owner/StokGudang";
import MasaPenitipan from "../Owner/MasaPenitipan";
import KategoriBarang from "../Owner/KategoriBarang";
import DonasiBarang from "../Owner/DonasiBarang";

// Detail Barang
import DetailBarang from "../Components/DetailBarang";

// ALAMAT
import CRUDAlamat from "../pembeli/CrudAlamat";
import CRUDPegawai from "../admin/CRUDPegawai";

//Checkout
// import PaymentMethods from "../pembeli/CheckOut";
// import OrderPage from "../pembeli/CheckOut";
import OrderForm from "../pembeli/CheckOut";
import TransaksiPembeli from "../pembeli/TransaksiPembeli";
import TransaksiCS from "../Customer_Service/VerifikasiPembayaran";
// import BarangHariIni from "../Pegawai_Gudang/barangHariIni";

import Barang_Donasi from "../Test2/TampilkanDonasi";
import ReqDonasi from "../Owner/ReqDonasi";
import LapPenitip from "../Owner/LapPenitip";
import Responsi from "../Pegawai_Gudang/responsi";

import SelesaiPengiriman from "../Customer_Service/BarangKurir";
import TarikSaldo from "../Penitip/tarikSaldo";


const router = createBrowserRouter([
  {
    path: "*",
    element: <div>Routes Not Found!</div>,
  },
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/register-org",
    element: <RegisterOrgPage />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/ambil-barang",
    element: <AmbilBarang />,
  },
  {
    path: "/barang-donasi",
    element: <Barang_Donasi />,
  },
  {
    path: "/kurir-barang",
    element: <SelesaiPengiriman />,
  },
  {
    path: "/alamat",
    element: (
      <>
        <NavbarCustomer />
        <CRUDAlamat />
      </>
    ),
  },
  {
    path: "/transaksi",
    element: (
      <>
        <NavbarCustomer />
        <TransaksiPembeli />
      </>
    ),
  },
  {
    path: "/pembayaran",
    element: <OrderForm />,
  },

  // ADMIN
  {
    path: "/admin",
    element: <Layout />,
    children: [
      {
        path: "/admin",
        element: <Admin />, // atau komponen dashboard admin Anda
      },
      {
        path: "pegawai",
        element: <CRUDPegawai />,
      },
      {
        path: "organisasi",
        element: <CRUDOrganisasi />,
      },
    ],
  },

  // CUSTOMER SERVICE

  {
    path: "/customer-service",
    element: <Layout />,
    children: [
      {
        path: "penitip",
        element: <CRUDPenitip />, // atau komponen dashboard admin Anda
      },
      {
        path: "verifikasi",
        element: <TransaksiCS />,
      },
      {
        path: "diskusi",
        element: <CRUDDiskusi />,
      },
      {
        path: "merchandise",
        element: <Merchandise />,
      },
    ],
  },

  // {
  //   path: "/customer-service/penitip",
  //   element: (
  //     <div>
  //       <NavbarCustomer_Service />
  //       <CRUDPenitip />
  //     </div>
  //   ),
  // },
  // {
  //   path: "/customer-service/verifikasi",
  //   element: (
  //     <div>
  //       <NavbarCustomer_Service />
  //       <TransaksiCS />
  //     </div>
  //   ),
  // },
  // {
  //   path: "/customer-service/diskusi",
  //   element: (
  //     <div>
  //       <CRUDDiskusi />
  //       <Footer />
  //     </div>
  //   ),
  // },
  // {
  //   path: "/customer-service/merchandise",
  //   element: (
  //     <div>
  //       <Merchandise />
  //       <Footer />
  //     </div>
  //   ),
  // },

  // PEGAWAI GUDANG
  {
    path: "/gudang",
    element: <Layout />,
    children: [
      {
        path: "/gudang/barang-titipan",
        element: <CRUDBarangTitipan />,
      },

      {
        path: "/gudang/pengiriman/pembeli",
        element: <CRUDPengirimanPembeli />,
        // element: <UjianKelas />,
      },
      {
        path: "/gudang/pengiriman/ujianKelas",
        // element: <CRUDPengirimanPembeli />
        element: <UjianKelas />,
      },

      {
        path: "/gudang/pengiriman/penitip",
        element: <CRUDPengirimanPenitip />,
      },
      {
        path: "/gudang/responsi",
        element: <Responsi />
      }
    ],
  },

  // CUSTOMER
  {
    path: "/customer/profile",
    element: (
      <div>
        <NavbarCustomer />
        <ShowProfileCustomer />
      </div>
    ),
  },
  {
    path: "/customer/history",
    element: (
      <div>
        <NavbarPage />
        <ShowHistoryCustomer />
        <Footer />
      </div>
    ),
  },
  {
    path: "/customer/diskusi",
    element: (
      <div>
        <NavbarPage />
        <CRUDDiskusi />
        <Footer />
      </div>
    ),
  },
  {
    path: "/customer/transaksi",
    element: (
      <div>
        <NavbarPage />
        <CRUDTransaksiPenjualanCustomer />
        <Footer />
      </div>
    ),
  },

  // PENITIP

  {
    path: "/penitip",
    element: <Layout />,
    children: [
      {
        path: "pengambilan",
        element: <PengambilanBarangKembali />,
      },
      {
        path: "Profile",
        element: <ShowProfilePenitip />,
      },
      {
        path: "saldo",
        element: <TarikSaldo/>
      }
    ],
  },

  // ORGANISASI
  {
    path: "/organisasi",
    element: (
      <div>
        <NavbarPage />
        <Organisasi />
        <Footer />
      </div>
    ),
  },
  {
    path: "/organisasi/transaksi-request-donasi",
    element: (
      <div>
        <CRUDTransaksiRequestDonasi />
      </div>
    ),
  },

  // OWNER
  {
    path: "/owner",
    element: <Layout />,
    children: [
      {
        path: "/owner/request-donasi",
        element: <Owner />,
      },

      {
        path: "penjualan-bulanan",
        element: <PenjualanBulanan />,
      },

      {
        path: "komisi-bulanan",
        element: <KomisiBulanan />,
      },

      {
        path: "stok-gudang",
        element: <StokGudang />,
      },
      {
        path: "masa-penitipan",
        element: <MasaPenitipan />,
      },
      {
        path: "kategori-barang",
        element: <KategoriBarang />,
      },
      {
        path: "donasi-barang",
        element: <DonasiBarang />,
        // element: <KategoriBarang />
      },
      {
        path: "request/donasi",
        element: <ReqDonasi />,
        // element: <KategoriBarang />
      },
      {
        path: "laporan-penitip",
        element: <LapPenitip />,
        // element: <KategoriBarang />
      },
    ],
  },

  //Detail Barang
  {
    path: "/detail/:id",
    element: <DetailBarang />,
  },
]);

const AppRouter = () => {
  return (
    <>
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;
