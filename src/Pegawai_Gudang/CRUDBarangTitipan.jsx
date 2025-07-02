import React, { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "sonner";
import Select from "react-select";
import jsPDF from "jspdf";
import {
    GetAllBarang,
    CreateBarang,
    UpdateBarang,
    DeleteBarang
} from "../Api/apiBarangQC";
import { GetAllKategori } from "../Api/apiKategori";
import { GetAllPenitip } from "../Api/apiPenitip";

import { GetAllPegawai, GetPegawaiByJabatan } from "../Api/apiPegawai";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const CRUDBarangTitipan = () => {
    const [barangList, setBarangList] = useState([]);

    const [kategoriList, setKategoriList] = useState([]);
    const [penitipList, setPenitipList] = useState([]);
    const [roleList, setRoleList] = useState([]);

    const [isEdit, setIsEdit] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBarangList, setFilteredBarangList] = useState([]);
    const [selectedBarang, setSelectedBarang] = useState(null);

    const handleShowDetail = (barang) => {
        setSelectedBarang(barang);
        const modal = new window.bootstrap.Modal(document.getElementById('detailModal'));
        modal.show();
    };


    const [form, setForm] = useState({
        id: '',
        id_penitip: '',
        id_kategori: '',
        id_hunter: 0,
        tgl_penitipan: '',
        nama_barang: '',
        harga_barang: '',
        berat_barang: '',
        deskripsi: '',
        status_garansi: '',
        // status_barang: '',
        gambar: '',
        gambar_dua: ''
    })

    const fetchBarang = async () => {
        try {
            const data = await GetAllBarang();
            setBarangList(data);
            setFilteredBarangList(data); // Awalnya tampilkan semua
        } catch (error) {
            toast.error("Gagal mengambil data barang");
        }
    };

    const handleSearch = () => {
        const filtered = barangList.filter(b =>
            b.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.penitip?.nama_penitip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.kategori_barang?.nama_kategori?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.hunter?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.status_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.tgl_penitipan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.masa_penitipan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.harga_barang !== null && b.harga_barang !== undefined && b.harga_barang.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredBarangList(filtered);
    };

    const fetchKategori = async () => {
        try {
            const data = await GetAllKategori();
            setKategoriList(data);
        }
        catch (error) {
            toast.error('Gagal mengambil data kategori')
        }
    }

    const fetchPenitip = async () => {
        try {
            const data = await GetAllPenitip();
            setPenitipList(data);
        }
        catch (error) {
            toast.error('Gagal mengambil data penitip');
        }
    }

    const fetchRole = async () => {
        try {
            const data = await GetAllPegawai();
            // console.log("Data pegawai:", data); // ← Tambahkan ini
            setRoleList(data);
        }
        catch (error) {
            toast.error('Gagal mengambil data hunter')
        }
    }

    useEffect(() => {
        fetchBarang();
        fetchKategori();
        fetchPenitip();
        fetchRole();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({
            ...form,
            [name]: files ? files[0] : value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('id', form.id);
            formData.append('id_penitip', form.id_penitip);
            formData.append('id_kategori', form.id_kategori);
            formData.append('id_hunter', parseInt(form.id_hunter) || 0);
            formData.append('tgl_penitipan', form.tgl_penitipan);
            formData.append('nama_barang', form.nama_barang);
            formData.append('harga_barang', form.harga_barang);
            formData.append('berat_barang', form.berat_barang);
            formData.append('deskripsi', form.deskripsi);
            formData.append('status_garansi', form.status_garansi);
            // formData.append('status_barang', form.status_barang);

            if (formData.get("tgl_pengambilan") === "") {
                formData.set("tgl_pengambilan", null);
            }


            if (form.gambar) {
                formData.append('gambar', form.gambar);
            }
            if (form.gambar_dua) {
                formData.append('gambar_dua', form.gambar_dua);
            }

            if (isEdit) {
                // await UpdateBarang(formData);
                form.tgl_pengambilan = null;
                await UpdateBarang(form); // Kirim objek, bukan FormData
                toast.success('Berhasil update data barang');
            } else {
                await CreateBarang(form);
                toast.success('Berhasil menambahkan data barang');
            }
            // Reset pencarian setelah submit (opsional)
            setSearchTerm('');
            setFilteredBarangList(barangList);
            resetForm();
            fetchBarang();
        } catch (error) {
            toast.error('Gagal menyimpan data barang');
            console.error(error);
        }
    };


    const handleEdit = (barang) => {
        setForm({ ...barang, id_hunter: parseInt(barang.id_hunter) || 0, gambar: '', gambar_dua: '' });
        setIsEdit(true);
        const modal = new window.bootstrap.Modal(document.getElementById('formModal'));
        modal.show();
    }

    const handleDelete = async (id) => {
        try {
            if (window.confirm('Yakin ingin menghapus data ini?')) {
                await DeleteBarang(id); // Menghapus barang berdasarkan ID
                toast.success('Data barang berhasil dihapus');
                fetchBarang(); // Mengambil data terbaru
            }
        } catch (error) {
            console.error("Gagal menghapus data barang:", error);
            toast.error('Gagal menghapus data barang');
        }
    };

    const resetForm = () => {
        setForm({
            id: '',
            id_penitip: '',
            id_kategori: '',
            id_hunter: 0,
            tgl_penitipan: '',
            nama_barang: '',
            harga_barang: '',
            berat_barang: '',
            deskripsi: '',
            status_garansi: '',
            // status_barang: '',
            gambar: '',
            gambar_dua: ''
        });
        setIsEdit(false);
    }

    const handleDownloadNota = (barangList) => {
        const doc = new jsPDF();

        // Header
        doc.setFont("times", "bold");
        doc.setFontSize(14);
        doc.text("Nota Penitipan Barang", 10, 15);

        doc.setFontSize(12);
        doc.setFont("times", "bold");
        doc.text("ReUse Mart", 20, 25);

        doc.setFont("times", "normal");
        doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 20, 30);

        // Ambil barang pertama untuk informasi umum (karena penitip sama)
        const barangPertama = barangList[0];
        const kurir = barangPertama.hunter?.nama || "-"

        // Info Nota
        const today = new Date();
        const year = String(today.getFullYear()).slice(2);
        const month = String(today.getMonth() + 1).padStart(2, 0);
        const nomor_nota = `${year}.${month}.${barangPertama.penitip.id}`;
        doc.setFontSize(11);
        doc.text(`No Nota                       : ${nomor_nota}`, 20, 40);
        // doc.text(`No Nota                       : ${barangPertama.nomor_nota || '24.02.101'}`, 20, 40);

        const [tanggal, waktu] = barangPertama.tgl_penitipan.split(' ');
        const [tahun, bulan, hari] = tanggal.split('-');
        const formattedDate = `${hari}/${bulan}/${tahun} ${waktu}`;

        doc.text(`Tanggal penitipan        : ${formattedDate}`, 20, 45);
        doc.text(`Masa penitipan sampai: ${new Date(barangPertama.masa_penitipan).toLocaleDateString('id-ID')}`, 20, 50);

        // Penitip
        const penitip = `T${barangPertama.penitip.id} / ${barangPertama.penitip?.nama_penitip}`;
        const alamat_penitip = barangPertama.penitip?.alamat;

        doc.setFont("times", "bold");
        doc.text("Penitip :", 20, 60);

        doc.setFont("times", "normal");
        doc.text(penitip, 35, 60);
        doc.text(alamat_penitip, 20, 65);
        doc.text(`Delivery : ${kurir}`, 20, 70);

        // Tampilkan daftar semua barang
        let y = 80;
        barangList.forEach((barang, index) => {
            console.log(`Barang: ${barang.nama_barang}, Hunter: ${barang.hunter?.nama || '-'}`);
            doc.setFont("times", "normal");
            doc.text(`${barang.nama_barang}`, 20, y);
            doc.text(`${barang.harga_barang?.toLocaleString()}`, 90, y, { align: "right" });
            y += 5;

            if (barang.status_garansi != null) {
                const garansiDate = new Date(barang.status_garansi);
                const options = { year: 'numeric', month: 'long' }; // Format: "Bulan Tahun"
                const formattedGaransiDate = garansiDate.toLocaleString('id-ID', options);

                doc.text(`Garansi ON ${formattedGaransiDate}`, 20, y);
                y += 5;
            }
            doc.text(`Berat barang: ${barang.berat_barang} kg`, 20, y);
            y += 5;
        });

        // Footer
        y += 10;
        doc.text("Diterima dan QC oleh:", 50, y);
        doc.text(`P${barangPertama.pegawai?.id} - ${barangPertama.pegawai.nama}`, 50, y + 10);

        doc.setLineWidth(0.5);
        doc.rect(8, 10, 190, y + 10); // kotak sekitar seluruh isi
        doc.save(`Nota_${barangPertama.penitip.nama_penitip}.pdf`);
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
                        <th>Nama Penitip</th>
                        <th>Kategori Barang</th>
                        <th>Hunter</th>
                        <th>Tanggal Penitipan</th>
                        <th>Masa Penitipan</th>
                        <th>Nama Barang</th>
                        <th>Harga Barang</th>
                        <th>Deskripsi</th>
                        {/* <th>Status Garansi</th> */}
                        <th>Status Barang</th>
                        {/* <th>Gambar</th> */}
                        <th>Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredBarangList.length > 0 ? (
                        filteredBarangList.map((b, index) => (
                            <tr key={b.id}>
                                <td>{index + 1}</td>
                                <td>{b.penitip.nama_penitip}</td>
                                <td>{b.kategori_barang.nama_kategori || "Kategori tidak ditemukan"}</td>
                                <td>{b.hunter?.nama || "-"}</td>
                                <td>{b.tgl_penitipan}</td>
                                <td>{b.masa_penitipan}</td>
                                <td>{b.nama_barang}</td>
                                <td>{b.harga_barang}</td>
                                <td>{b.deskripsi}</td>
                                {/* <td>{b.status_garansi}</td> */}
                                <td>{b.status_barang}</td>
                                {/* <td>
                                    <img
                                        src={`http://p3l.reusemart.fun/${b.gambar}`}
                                        alt={b.nama_barang}
                                        className="img-thumbnail"
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                </td> */}
                                <td>
                                    <div className="d-flex flex-column">
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => handleEdit(b)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger me-2 mt-2"
                                            onClick={() => {
                                                if (window.confirm('Yaking ingin menghapus data ini?')) {
                                                    DeleteBarang(b.id).then(fetchBarang);
                                                }
                                            }}
                                        >
                                            Hapus
                                        </button>
                                        <button
                                            className="btn btn-sm btn-primary me-2 mt-2"
                                            onClick={() => handleShowDetail(b)}
                                        >
                                            Detail
                                        </button>
                                        <button
                                            className="btn btn-sm btn-success me-2 mt-2"
                                            onClick={() => {
                                                const barangPenitipTerkait = barangList.filter(
                                                    (barangItem) => barangItem.penitip.id === b.penitip.id
                                                );
                                                handleDownloadNota(barangPenitipTerkait);
                                            }}
                                        >
                                            Unduh Nota
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11" className="text-center fs-2">Belum ada data barang</td>
                        </tr>
                    )
                    }
                </tbody>
            </table>

            {/* Modal untuk isi form */}
            <div className="modal fade" id="formModal" tabIndex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="formModalLabel">
                                {isEdit ? 'Edit Barang' : 'Tambah Barang'}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="penitip" className="form-label">Nama Penitip</label>
                                <div className="mb-3">
                                    <Select
                                        name="id_penitip"
                                        options={penitipList.map(p => ({
                                            value: p.id,
                                            label: p.nama_penitip
                                        }))}
                                        value={penitipList
                                            .map(p => ({ value: p.id, label: p.nama_penitip }))
                                            .find(option => option.value === form.id_penitip)}
                                        onChange={(selectedOption) =>
                                            setForm({ ...form, id_penitip: selectedOption?.value || '' })
                                        }
                                        placeholder="Cari penitip..."
                                        isClearable
                                    />
                                </div>

                                <label htmlFor="kategori" className="form-label">
                                    Nama Kategori
                                </label>
                                <div className="mb-3">
                                    <select
                                        name="id_kategori"
                                        className="form-select"
                                        value={form.id_kategori}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>
                                            Pilih Kategori
                                        </option>
                                        {kategoriList.map((kategori) => (
                                            <option key={kategori.id} value={kategori.id}>
                                                {kategori.nama_kategori}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <label htmlFor="penitip" className="form-label">Hunter</label>
                                <div className="mb-3">
                                    <Select
                                        name="id_hunter"
                                        options={roleList
                                            .filter(r => r.jabatan?.role?.toLowerCase() === "hunter")
                                            .map(r => ({
                                                value: r.id,
                                                label: r.nama
                                            }))}
                                        value={roleList
                                            .filter(r => r.jabatan?.role?.toLowerCase() === "hunter")
                                            .map(r => ({
                                                value: r.id,
                                                label: r.nama
                                            }))
                                            .find(option => option.value === parseInt(form.id_hunter))}
                                        onChange={(selectedOption) =>
                                            setForm({ ...form, id_hunter: parseInt(selectedOption?.value) ?? 0 })
                                        }
                                        placeholder="Cari Hunter..."
                                        isClearable
                                    />
                                </div>

                                <label htmlFor="tgl_penitipan" className="form-label">Tanggal Penitipan</label>
                                <div className="mb-3">
                                    <input
                                        type='date'
                                        name="tgl_penitipan"
                                        className="form-control"
                                        placeholder="Tanggal Penitipan"
                                        value={form.tgl_penitipan}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <label htmlFor="nama_barang" className="form-label">Nama Barang</label>
                                <div className="mb-3">
                                    <input
                                        type='text'
                                        name="nama_barang"
                                        className="form-control"
                                        placeholder="Nama Barang"
                                        value={form.nama_barang}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <label htmlFor="harga_barang" className="form-label">Harga Barang</label>
                                <div className="mb-3">
                                    <input
                                        type='number'
                                        name="harga_barang"
                                        className="form-control"
                                        placeholder="Harga Barang"
                                        value={form.harga_barang}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <label htmlFor="berat_barang" className="form-label">Berat Barang</label>
                                <div className="mb-3">
                                    <input
                                        type='number'
                                        name="berat_barang"
                                        className="form-control"
                                        placeholder="Berat Barang"
                                        value={form.berat_barang}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <label htmlFor="deskripsi" className="form-label">Deskripsi</label>
                                <div className="mb-3">
                                    <input
                                        type='textarea'
                                        name="deskripsi"
                                        className="form-control"
                                        placeholder="Deskripsi"
                                        value={form.deskripsi}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <label htmlFor="status_garansi" className="form-label">Status Garansi</label>
                                <div className="mb-3">
                                    <input
                                        type='date'
                                        name="status_garansi"
                                        className="form-control"
                                        placeholder="Status Garansi"
                                        value={form.status_garansi}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* <label htmlFor="status_barang" className="form-label">Status Barang</label>
                                <div className="mb-3">
                                    <input
                                        type='text'
                                        name="status_barang"
                                        className="form-control"
                                        placeholder="Status Barang"
                                        value={form.status_barang}
                                        onChange={handleChange}
                                        required
                                    />
                                </div> */}

                                {/* Gambar section, now also shown in edit mode */}
                                <label htmlFor="gambar" className="form-label">Gambar</label>
                                <div className="mb-3">
                                    {isEdit && form.gambar_lama && (
                                        <div className="mb-2">
                                            <img
                                                src={`http://p3l.reusemart.fun/${form.gambar_lama}`}
                                                alt="Gambar Lama"
                                                className="img-thumbnail"
                                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                            />
                                            <div className="text-muted small">Gambar saat ini</div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        name="gambar"
                                        className="form-control"
                                        onChange={handleChange}
                                        required={!isEdit}
                                    />
                                </div>

                                <label htmlFor="gambar_dua" className="form-label">Gambar 2</label>
                                <div className="mb-3">
                                    {isEdit && form.gambar_dua_lama && (
                                        <div className="mb-2">
                                            <img
                                                src={`http://p3l.reusemart.fun/${form.gambar_dua_lama}`}
                                                alt="Gambar 2 Lama"
                                                className="img-thumbnail"
                                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                            />
                                            <div className="text-muted small">Gambar 2 saat ini</div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        name="gambar_dua"
                                        className="form-control"
                                        onChange={handleChange}
                                        required={!isEdit}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary">
                                    {isEdit ? 'Update' : 'Tambah'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


            {/* Modal untuk detail barang */}
            <div className="modal fade" id="detailModal" tabIndex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="detailModalLabel">Detail Barang</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedBarang && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <div id="carouselGambar" className="carousel slide" data-bs-ride="carousel">
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img
                                                        src={`http://p3l.reusemart.fun/${selectedBarang.gambar}`}
                                                        className="d-block w-100 rounded"
                                                        alt="Gambar 1"
                                                        style={{ maxHeight: "300px", objectFit: "contain" }}
                                                    />
                                                </div>
                                                {selectedBarang.gambar_dua && (
                                                    <div className="carousel-item">
                                                        <img
                                                            src={`http://p3l.reusemart.fun/${selectedBarang.gambar_dua}`}
                                                            className="d-block w-100 rounded"
                                                            alt="Gambar 2"
                                                            style={{ maxHeight: "300px", objectFit: "contain" }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselGambar" data-bs-slide="prev">
                                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span className="visually-hidden">Previous</span>
                                            </button>
                                            <button className="carousel-control-next" type="button" data-bs-target="#carouselGambar" data-bs-slide="next">
                                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span className="visually-hidden">Next</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <h5>{selectedBarang.nama_barang}</h5>
                                        {/* <p><strong>Status Barang:</strong> {selectedBarang.status_barang}</p> */}
                                        <p><strong>Status Garansi:</strong> {selectedBarang.status_garansi}</p>
                                        <p><strong>Penitip:</strong> {selectedBarang.penitip.nama_penitip}</p>
                                        <p><strong>Kategori:</strong> {selectedBarang.kategori_barang.nama_kategori}</p>
                                        <p><strong>Berat Barang:</strong> {selectedBarang.berat_barang} kg</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default CRUDBarangTitipan;
