import React, { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "sonner";
import Select from "react-select";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
import {
    CreatePengambilan,
    GetPengambilan,
    UpdatePengambilan,
    GetPengambilanPro, // Assuming this API handles updating a pengiriman record
    DeletePengambilan,
    GetPengambilanById,
    GetPengambilanByNama
} from "../Api/ApiPengambilan"

import { GetAllKategori } from "../Api/apiKategori";
import { GetAllPenitip } from "../Api/apiPenitip";
import { GetAllPegawai, GetPegawaiByJabatan } from "../Api/apiPegawai"; // Import API untuk mendapatkan data pegawai

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const UjianKelas = () => {
    const [pengambilanList, setPengambilanList] = useState([]);
    const [filteredPengambilanList, setFilteredPengambilanList] = useState([]);
    const [selectedTransaksi, setSelectedTransaksi] = useState(null);

    const [kategoriList, setKategoriList] = useState([]);
    const [penitipList, setPenitipList] = useState([]);
    const [kurirList, setKurirList] = useState([]);


    const [isEdit, setIsEdit] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state ini kemungkinan besar untuk TransaksiPenjualan, bukan TransaksiPengiriman secara langsung.
    // Untuk tampilan, kita akan langsung mengakses data dari objek `item` atau `selectedTransaksi`
    // yang sudah dimuat dengan relasi bersarang.
    const [form, setForm] = useState({
        id: '',
        id_pembeli: '',
        total_harga_pembelian: '',
        metode_pengiriman: '',
        alamat_pengiriman: '',
        ongkir: '',
        bukti_pembayaran: '',
        status_pengiriman: '',
        id_pegawai: '',
        status_pembelian: '',
        verifikasi_pembayaran: ''
    });

    // New state for delivery input form
    const [deliveryForm, setDeliveryForm] = useState({
        id: '',
        tgl_pengiriman: '',
        status_pengiriman: '', // Keep this if status is still part of pengiriman update
        catatan: '',
        id_pegawai: '' // To store the selected courier's ID
    });

    // New state for pengambilan input form
    const [pengambilanForm, setPengambilanForm] = useState({
        id: '',
        tgl_pengiriman: '', // Tanggal pengambilan
        catatan: '' // Catatan pengambilan
    });


    const fetchPengambilan = async () => {
        try {
            const data = await GetPengambilanPro();
            setPengambilanList(data);
            setFilteredPengambilanList(data);
        } catch (error) {
            console.error("Error fetching pengambilan data:", error);
            toast.error("Gagal mengambil data pengambilan. Pastikan Anda sudah login.");
        }
    };

    const fetchPegawai = async () => {
    try {
        const data = await GetAllPegawai();
        const kurirData = data.filter(pegawai => pegawai.jabatan === 4);
        setKurirList(kurirData);
    } catch (error) {
        console.error("Error fetching pegawai data:", error);
        toast.error("Gagal mengambil data pegawai.");
    }
    };

    const kurirOptions = kurirList.map(kurir => ({
        value: kurir.id,
        label: kurir.nama_pegawai
    }));

    const handleKurirSelect = (selectedOption) => {
    setDeliveryForm(prev => ({
        ...prev,
        id_pegawai: selectedOption ? selectedOption.value : ''
    }));
    };



    const handleSearch = async () => {
        const search = searchTerm.toLowerCase()

        const filteredData = pengambilanList.filter((p) => {
            // Mengakses data melalui relasi bersarang transaksiPenjualan
            const tp = p.transaksi_penjualan; // shorthand for transaksiPenjualan data

            return (
                (tp?.pembeli?.nama_pembeli?.toLowerCase().includes(search)) ||
                (tp?.total_harga_pembelian?.toString().includes(search)) ||
                (tp?.metode_pengiriman?.toLowerCase().includes(search)) ||
                (tp?.alamat_pengiriman?.toLowerCase().includes(search)) ||
                (tp?.ongkir?.toString().includes(search)) ||
                (p.status_pengiriman?.toLowerCase().includes(search)) || // status_pengiriman dari TransaksiPengiriman
                (tp?.status_pembelian?.toLowerCase().includes(search)) ||
                (tp?.verifikasi_pembayaran?.toLowerCase().includes(search)) ||
                (p.id?.toString().includes(search)) // ID dari TransaksiPengiriman
            );
        });
        setFilteredPengambilanList(filteredData);
    };

    const fetchKategori = async () => {
        try {
            // const data = await GetAllKategori();
            const data = []; // Dummy data
            setKategoriList(data);
        }
        catch (error) {
            console.error('Error fetching kategori data:', error);
            toast.error('Gagal mengambil data kategori');
        }
    }

    const fetchPenitip = async () => {
        try {
            // const data = await GetAllPenitip();
            const data = []; // Dummy data
            setPenitipList(data);
        }
        catch (error) {
            console.error('Error fetching penitip data:', error);
            toast.error('Gagal mengambil data penitip');
        }
    }

    useEffect(() => {
        fetchPengambilan();
        fetchKategori();
        fetchPenitip();
        fetchPegawai(); // Fetch pegawai data on component mount
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({
            ...form,
            [name]: files ? files[0] : value
        });
    };

    // Handler for delivery form changes
    const handleDeliveryChange = (e) => {
        const { name, value } = e.target;
        setDeliveryForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    // Handler for pengambilan form changes
    const handlePengambilanChange = (e) => {
        const { name, value } = e.target;
        setPengambilanForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    // Function to open the detail modal
    const handleShowDetail = (transaksi) => {
        setSelectedTransaksi(transaksi);
        const modal = new window.bootstrap.Modal(document.getElementById('detailModal'));
        modal.show();
    };

    // Function to open the delivery input modal
    const handleOpenDeliveryModal = (transaksi) => {
        setSelectedTransaksi(transaksi);
        setDeliveryForm({
            id: transaksi.id,
            tgl_pengiriman: transaksi.tgl_pengiriman ? new Date(transaksi.tgl_pengiriman).toISOString().slice(0, 16) : '', // Format for datetime-local input
            // status_pengiriman: transaksi.status_pengiriman || '',
            catatan: transaksi.catatan || '',
            id_pegawai: transaksi.id_pegawai || '' // Set current courier if exists
        });
        const modal = new window.bootstrap.Modal(document.getElementById('deliveryInputModal'));
        modal.show();
    };

   function formatDateForBackend(datetimeLocalStr) {
    if (!datetimeLocalStr) return null;
    const dt = new Date(datetimeLocalStr);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
    }

    const handleSubmitDelivery = async (e) => {
    e.preventDefault();
    try {
        const dataToUpdate = {
        tgl_pengiriman: formatDateForBackend(deliveryForm.tgl_pengiriman),
        status_pengiriman: deliveryForm.status_pengiriman,
        catatan: deliveryForm.catatan,
        id_pegawai: deliveryForm.id_pegawai
        };
        await UpdatePengambilan(selectedTransaksi.id, dataToUpdate);
        toast.success("Data pengiriman berhasil diperbarui.");
        fetchPengambilan();
        window.bootstrap.Modal.getInstance(document.getElementById('deliveryInputModal')).hide();
    } catch (error) {
        console.error("Error updating delivery data:", error);
        toast.error("Gagal memperbarui data pengiriman.");
    }
    };

    const handleSubmitPengambilan = async (e) => {
    e.preventDefault();
    try {
        const dataToUpdate = {
        tgl_pengiriman: formatDateForBackend(pengambilanForm.tgl_pengiriman),
        catatan: pengambilanForm.catatan
        };
        await UpdatePengambilan(selectedTransaksi.id, dataToUpdate);
        toast.success("Data pengambilan berhasil diperbarui.");
        fetchPengambilan();
        window.bootstrap.Modal.getInstance(document.getElementById('pengambilanInputModal')).hide();
    } catch (error) {
        console.error("Error updating pengambilan data:", error);
        toast.error("Gagal memperbarui data pengambilan.");
    }
    };

    const handleKonfirmasiPengambilan = async () => {
        try {
            const formattedTanggal = pengambilanForm.tgl_pengiriman
                ? formatDateForBackend(pengambilanForm.tgl_pengiriman)
                : null;

            const dataToUpdate = {
                ...selectedTransaksi,
                tgl_pengiriman: formattedTanggal,
                status_pengiriman: 'diambil',
                catatan: pengambilanForm.catatan
            };

            await UpdatePengambilan(dataToUpdate.id, dataToUpdate);

            toast.success("Pengambilan berhasil dikonfirmasi.");
            fetchPengambilan();
            window.bootstrap.Modal.getInstance(document.getElementById('pengambilanKonfirmasiModal')).hide();
        } catch (error) {
            console.error("Error confirming pickup:", error);
            toast.error("Gagal konfirmasi pengambilan.");
        }
    };

    const handleDownloadNota = (orderData) => {
        const doc = new jsPDF();
        doc.setFont("times", "normal");
        let y = 15;
        const startX = 10;
        const contentWidth = 90; // setengah halaman
        const annotationX = 110; // tempat keterangan

        // Helper function untuk format tanggal
        const formatDateTime = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
            return `${date.toLocaleDateString('id-ID', optionsDate)} ${date.toLocaleTimeString('id-ID', optionsTime)}`;
        };
        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            return date.toLocaleDateString('id-ID', options);
        };

        const transaksiPenjualan = orderData.transaksi_penjualan;
        const totalBarangHarga = transaksiPenjualan.detail.reduce((sum, d) => sum + d.harga_saat_transaksi, 0);
        const totalAkhir = totalBarangHarga + (transaksiPenjualan.ongkir || 0);

        let basePoin = Math.floor(totalBarangHarga / 10000);
        let bonusPoin = totalBarangHarga > 500000 ? Math.floor(basePoin * 0.2) : 0;
        let poinDidapat = basePoin + bonusPoin;

        const potonganPoinValue = (transaksiPenjualan.pembeli?.point_digunakan || 0) * 100;
        const finalPaymentTotal = totalAkhir - potonganPoinValue;

        const qcPegawai = kurirList.find(p => p.id === orderData.id_pegawai);
        const deliveryCourierName = kurirList.find(k => k.id === orderData.id_pegawai)?.nama_pegawai || 'N/A';
        const deliveryCourierId = orderData.id_pegawai ? `(P${orderData.id_pegawai})` : '';

        const orderDateObj = new Date(transaksiPenjualan.created_at);
        const yearFormatted = orderDateObj.getFullYear().toString().slice(-2);
        const monthFormatted = (orderDateObj.getMonth() + 1).toString().padStart(2, '0');
        const sequentialNumberFormatted = transaksiPenjualan.id.toString().padStart(3, '0');
        const nomorNota = `${yearFormatted}.${monthFormatted}.${sequentialNumberFormatted}`;
        const formattedDate = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

        // HEADER
        doc.setFontSize(14);
        doc.setFont("times", "bold");
        doc.text("ReUse Mart", startX, y);
        y += 5;
        doc.setFontSize(10);
        doc.setFont("times", "normal");
        doc.text("Jl. Green Eco Park No. 456 Yogyakarta", startX, y);
        y += 10;

        doc.text(`No Nota         : ${nomorNota}`, startX, y);
        y += 5;
        doc.text(`Tanggal pesan   : ${formatDateTime(transaksiPenjualan.created_at)}`, startX, y);
        y += 5;
        doc.text(`Lunas pada      : ${transaksiPenjualan.verifikasi_pembayaran === 'terverifikasi' ? formatDateTime(transaksiPenjualan.updated_at) : 'Belum Lunas'}`, startX, y);
        y += 5;
        doc.text(`Tanggal kirim   : ${orderData.tgl_pengiriman ? formatDate(orderData.tgl_pengiriman) : 'Akan diatur'}`, startX, y);
        y += 10;

        doc.setFont("times", "bold");
        doc.text(`Pembeli : ${transaksiPenjualan.pembeli?.email || 'N/A'} / ${transaksiPenjualan.pembeli?.nama_pembeli || 'N/A'}`, startX, y);
        y += 5;
        doc.setFont("times", "normal");
        const alamatLines = doc.splitTextToSize(transaksiPenjualan.alamat_pengiriman || 'N/A', contentWidth - 10);
        alamatLines.forEach(line => {
            doc.text(line, startX, y);
            y += 5;
        });
        doc.text(`Delivery: Kurir ReUseMart (${deliveryCourierName})`, startX, y);
        y += 10;

        // ITEM LIST
        transaksiPenjualan.detail.forEach(item => {
            doc.text(`${item.barang.nama_barang}`, startX, y);
            doc.text(`${item.harga_saat_transaksi?.toLocaleString('id-ID')}`, startX + contentWidth, y, { align: 'right' });
            y += 5;
        });
        y += 5;

        // RINGKASAN
        doc.line(startX, y, startX + contentWidth, y);
        y += 5;
        doc.text(`Total`, startX, y);
        doc.text(`${totalBarangHarga.toLocaleString('id-ID')}`, startX + contentWidth, y, { align: 'right' });
        y += 5;
        doc.text(`Ongkos Kirim`, startX, y);
        doc.text(`${(transaksiPenjualan.ongkir || 0).toLocaleString('id-ID')}`, startX + contentWidth, y, { align: 'right' });
        y += 5;
        doc.text(`Potongan ${transaksiPenjualan.pembeli?.point_digunakan || 0} poin`, startX, y);
        doc.text(`- ${potonganPoinValue.toLocaleString('id-ID')}`, startX + contentWidth, y, { align: 'right' });
        y += 5;
        doc.setFont("times", "bold");
        doc.text(`Total`, startX, y);
        doc.text(`${finalPaymentTotal.toLocaleString('id-ID')}`, startX + contentWidth, y, { align: 'right' });
        doc.setFont("times", "normal");
        y += 10;

        // POIN
        doc.text(`Poin dari pesanan ini: ${poinDidapat}`, startX, y);
        doc.text(`Total poin customer: ${(transaksiPenjualan.pembeli?.point || 0) - (transaksiPenjualan.pembeli?.point_digunakan || 0) + poinDidapat}`, startX, y + 5);
        y += 15;

        // QC dan tanda tangan
        doc.text(`QC oleh: ${qcPegawai?.nama_pegawai || 'N/A'} ${deliveryCourierId}`, startX, y);
        y += 10;
        doc.text("Diterima oleh:", startX, y);
        y += 15;
        doc.text("(...............................)", startX, y);
        y += 5;
        doc.text(`Tanggal: ${formattedDate}`, startX, y);

        doc.save(`Nota_Penjualan_${nomorNota}.pdf`);
    };

   
    return (
        <div className="container mt-5 bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Data Pengiriman Pembeli</h2>
            </div>

            <div className="row mb-4">
                <div className="col-md-6 d-flex gap-2">
                    <Link to="/gudang/pengiriman/penitip" className="btn btn-outline-primary">
                        Halaman Penitip
                    </Link>
                    <Link to="/gudang/pengiriman/pembeli" className="btn btn-outline-secondary">
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
                            placeholder="Cari transaksi..."
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
                        <th>Nama Pembeli</th>
                        <th>Total Harga Pembelian</th>
                        <th>Metode Pengiriman</th>
                        <th>Alamat Pengiriman</th>
                        <th>Ongkir</th>
                        <th>Status Pengiriman</th>
                        <th>Status Pembelian</th>
                        <th>Tanggal Pengiriman</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPengambilanList.length > 0 ? (
                        filteredPengambilanList.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.transaksi_penjualan?.pembeli?.nama_pembeli || 'N/A'}</td>
                                <td>{item.transaksi_penjualan?.total_harga_pembelian?.toLocaleString('id-ID') || 'N/A'}</td>
                                <td>{item.transaksi_penjualan?.metode_pengiriman || 'N/A'}</td>
                                <td>{item.transaksi_penjualan?.alamat_pengiriman || 'N/A'}</td>
                                <td>{item.transaksi_penjualan?.ongkir?.toLocaleString('id-ID') || 'N/A'}</td>
                                <td>{item.status_pengiriman || 'N/A'}</td>
                                <td>{item.transaksi_penjualan?.status_pembelian || 'N/A'}</td>
                                <td>{item.tgl_pengiriman || 'N/A'}</td>
                                <td>
                                    <div className="d-flex flex-column">
                                        <button className="btn btn-sm btn-primary mb-1" onClick={() => handleShowDetail(item)}>
                                            Detail
                                        </button>

                                        {item.transaksi_penjualan?.metode_pengiriman === 'dikirim' && (
                                            <button
                                                className="btn btn-sm btn-info mb-1 text-white"
                                                onClick={() => handleOpenDeliveryModal(item)}
                                            >
                                                Input Pengiriman
                                            </button>
                                        )}

                                       {item.transaksi_penjualan?.metode_pengiriman === 'diambil' && (
                                            <>
                                                <button
                                                    className="btn btn-sm btn-warning mb-1 text-white"
                                                    onClick={() => {
                                                        setSelectedTransaksi(item);
                                                        setPengambilanForm({
                                                            ...pengambilanForm,
                                                            id: item.id,
                                                            tgl_pengiriman: item.tgl_pengiriman
                                                                ? new Date(item.tgl_pengiriman).toISOString().slice(0, 16)
                                                                : '',
                                                            catatan: item.catatan || ''
                                                        });
                                                        // Buka modal input tanggal
                                                        const modalInput = new window.bootstrap.Modal(document.getElementById('pengambilanInputModal'));
                                                        modalInput.show();
                                                    }}
                                                >
                                                    Tgl Pengambilan
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-success mb-1"
                                                    onClick={() => {
                                                        setSelectedTransaksi(item);
                                                        setPengambilanForm({
                                                            ...pengambilanForm,
                                                            id: item.id,
                                                            tgl_pengiriman: item.tgl_pengiriman
                                                                ? new Date(item.tgl_pengiriman).toISOString().slice(0, 16)
                                                                : '',
                                                            catatan: item.catatan || ''
                                                        });
                                                        // Buka modal konfirmasi pengambilan (beda modal)
                                                        const modalKonfirmasi = new window.bootstrap.Modal(document.getElementById('pengambilanKonfirmasiModal'));
                                                        modalKonfirmasi.show();
                                                    }}
                                                >
                                                    Konfirmasi Pengambilan
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="text-center fs-5">
                                Belum ada data pengambilan
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal for transaction details */}
            <div className="modal fade" id="detailModal" tabIndex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="detailModalLabel">Detail Transaksi Pengambilan</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedTransaksi && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>Informasi Pengiriman:</h6>
                                        <p><strong>ID Pengiriman:</strong> {selectedTransaksi.id}</p>
                                        <p><strong>ID Transaksi Penjualan:</strong> {selectedTransaksi.id_transaksi_penjualan}</p>
                                        <p><strong>Tanggal Pengiriman:</strong> {selectedTransaksi.tgl_pengiriman ? new Date(selectedTransaksi.tgl_pengiriman).toLocaleString('id-ID') : 'N/A'}</p>
                                        <p><strong>Status Pengiriman:</strong> {selectedTransaksi.status_pengiriman}</p>
                                        <p><strong>Biaya Pengiriman:</strong> {selectedTransaksi.biaya_pengiriman?.toLocaleString('id-ID') || 'N/A'}</p>
                                        <p><strong>Catatan Pengiriman:</strong> {selectedTransaksi.catatan || 'N/A'}</p>
                                        <hr />
                                        <h6>Informasi Pembelian:</h6>
                                        <p><strong>Nama Pembeli:</strong> {selectedTransaksi.transaksi_penjualan?.pembeli?.nama_pembeli || 'N/A'}</p>
                                        <p><strong>Email Pembeli:</strong> {selectedTransaksi.transaksi_penjualan?.pembeli?.email || 'N/A'}</p>
                                        <p><strong>Total Harga Pembelian:</strong> {selectedTransaksi.transaksi_penjualan?.total_harga_pembelian?.toLocaleString('id-ID') || 'N/A'}</p>
                                        <p><strong>Metode Pengiriman:</strong> {selectedTransaksi.transaksi_penjualan?.metode_pengiriman || 'N/A'}</p>
                                        <p><strong>Alamat Pengiriman:</strong> {selectedTransaksi.transaksi_penjualan?.alamat_pengiriman || 'N/A'}</p>
                                        <p><strong>Ongkir:</strong> {selectedTransaksi.transaksi_penjualan?.ongkir?.toLocaleString('id-ID') || 'N/A'}</p>
                                        <p><strong>Status Pembelian:</strong> {selectedTransaksi.transaksi_penjualan?.status_pembelian || 'N/A'}</p>
                                        <p><strong>Verifikasi Pembayaran:</strong> {selectedTransaksi.transaksi_penjualan?.verifikasi_pembayaran || 'N/A'}</p>
                                        <p><strong>Tanggal Transaksi Pembelian:</strong> {selectedTransaksi.transaksi_penjualan?.created_at ? new Date(selectedTransaksi.transaksi_penjualan.created_at).toLocaleString('id-ID') : 'N/A'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Detail Barang:</h6>
                                        {selectedTransaksi.transaksi_penjualan?.detail?.length > 0 ? (
                                            selectedTransaksi.transaksi_penjualan.detail.map((detailItem, idx) => (
                                                <div key={idx} className="mb-3 p-2 border rounded">
                                                    <p><strong>Nama Barang:</strong> {detailItem.barang?.nama_barang || 'N/A'}</p>
                                                    <p><strong>Harga Saat Transaksi:</strong> {detailItem.harga_saat_transaksi?.toLocaleString('id-ID') || 'N/A'}</p>
                                                    <p><strong>Deskripsi:</strong> {detailItem.barang?.deskripsi || 'N/A'}</p>
                                                    <p><strong>Status Barang:</strong> {detailItem.barang?.status_barang || 'N/A'}</p>
                                                    <div id={`carouselGambar-${detailItem.id}`} className="carousel slide" data-bs-ride="carousel">
                                                        <div className="carousel-inner">
                                                            {detailItem.barang?.gambar && (
                                                                <div className="carousel-item active">
                                                                    <img
                                                                        src={`https://103.175.219.103/${detailItem.barang.gambar}`}
                                                                        className="d-block w-100 rounded"
                                                                        alt="Gambar 1"
                                                                        style={{ maxHeight: "300px", objectFit: "contain" }}
                                                                    />
                                                                </div>
                                                            )}
                                                            {detailItem.barang?.gambar_dua && (
                                                                <div className="carousel-item">
                                                                    <img
                                                                        src={`https://103.175.219.103/${detailItem.barang.gambar_dua}`}
                                                                        className="d-block w-100 rounded"
                                                                        alt="Gambar 2"
                                                                        style={{ maxHeight: "300px", objectFit: "contain" }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        {(detailItem.barang?.gambar || detailItem.barang?.gambar_dua) && (
                                                            <>
                                                                <button className="carousel-control-prev" type="button" data-bs-target={`#carouselGambar-${detailItem.id}`} data-bs-slide="prev">
                                                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                                    <span className="visually-hidden">Previous</span>
                                                                </button>
                                                                <button className="carousel-control-next" type="button" data-bs-target={`#carouselGambar-${detailItem.id}`} data-bs-slide="next">
                                                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                                    <span className="visually-hidden">Next</span>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>Tidak ada detail barang untuk transaksi ini.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-success"
                                onClick={() => handleDownloadNota(selectedTransaksi)}
                                disabled={!selectedTransaksi}
                            >
                                Unduh Nota
                            </button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </div >

            {/* Modal for Input Pengiriman */}
            <div className="modal fade" id="deliveryInputModal" tabIndex="-1" aria-labelledby="deliveryInputModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deliveryInputModalLabel">Input Data Pengiriman</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmitDelivery}>
                            <div className="modal-body">
                                {selectedTransaksi && (
                                    <>
                                        <p><strong>ID Pengiriman:</strong> {selectedTransaksi.id}</p>
                                        <p><strong>Nama Pembeli:</strong> {selectedTransaksi.transaksi_penjualan?.pembeli?.nama_pembeli || 'N/A'}</p>
                                        <p><strong>Alamat Pengiriman:</strong> {selectedTransaksi.transaksi_penjualan?.alamat_pengiriman || 'N/A'}</p>
                                        <div className="mb-3">
                                            <label htmlFor="id_pegawai" className="form-label">Kurir</label>
                                            <Select
                                            name="id_pegawai"
                                            id="id_pegawai"
                                            options={kurirOptions}
                                            value={kurirOptions.find(opt => opt.value === deliveryForm.id_pegawai) || null}
                                            onChange={handleKurirSelect}
                                            placeholder="Pilih Kurir..."
                                            isClearable
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="tgl_pengiriman" className="form-label">Tanggal Pengiriman</label>
                                            <input
                                                type="datetime-local"
                                                className="form-control"
                                                id="tgl_pengiriman"
                                                name="tgl_pengiriman"
                                                value={deliveryForm.tgl_pengiriman}
                                                onChange={handleDeliveryChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="catatan" className="form-label">Catatan (Opsional)</label>
                                            <textarea
                                                className="form-control"
                                                id="catatan"
                                                name="catatan"
                                                rows="3"
                                                value={deliveryForm.catatan}
                                                onChange={handleDeliveryChange}
                                            ></textarea>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                <button type="submit" className="btn btn-primary">Simpan Pengiriman</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

           {/* Modal for Input Pengambilan */}
            <div className="modal fade" id="pengambilanInputModal" tabIndex="-1" aria-labelledby="pengambilanInputModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="pengambilanInputModalLabel">Input Data Pengambilan</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmitPengambilan}>
                            <div className="modal-body">
                                {selectedTransaksi && (
                                    <>
                                        <p><strong>ID Pengambilan:</strong> {selectedTransaksi.id}</p>
                                        <p><strong>Nama Pembeli:</strong> {selectedTransaksi.transaksi_penjualan?.pembeli?.nama_pembeli || 'N/A'}</p>
                                        <p><strong>Alamat Pengambilan:</strong> {selectedTransaksi.transaksi_penjualan?.alamat_pengiriman || 'N/A'}</p>
                                        <div className="mb-3">
                                            <label htmlFor="tgl_pengiriman" className="form-label">Tanggal Pengambilan</label>
                                            <input
                                                type="datetime-local"
                                                className="form-control"
                                                id="tgl_pengiriman"
                                                name="tgl_pengiriman"
                                                value={pengambilanForm.tgl_pengiriman}
                                                onChange={handlePengambilanChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="pengambilan_catatan" className="form-label">Catatan (Opsional)</label>
                                            <textarea
                                                className="form-control"
                                                id="pengambilan_catatan"
                                                name="catatan"
                                                rows="3"
                                                value={pengambilanForm.catatan}
                                                onChange={handlePengambilanChange}
                                            ></textarea>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                <button type="submit" className="btn btn-primary">Simpan Pengambilan</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>



            {/* Modal for Konfirmasi Pengambilan */}
            <div className="modal fade" id="pengambilanKonfirmasiModal" tabIndex="-1" aria-labelledby="pengambilanKonfirmasiModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="pengambilanKonfirmasiModalLabel">Konfirmasi Pengambilan</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                        <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleKonfirmasiPengambilan}
                        disabled={!pengambilanForm.tgl_pengiriman}
                        >
                        Konfirmasi Pengambilan
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default UjianKelas;

