import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Donasi_Owner } from "../Api/apitransaksi_donasi";
import { toast } from "sonner";

export default function DonasiBarang() {
    const [donasiList, setDonasiList] = useState([]);

    const fetchDonasi = async () => {
        try {
            const data = await Donasi_Owner();
            setDonasiList(data);
        } catch (error) {
            toast.error("Gagal mengambil data donasi");
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDonasi();
    }, []);

    const handleDownload = () => {
        const doc = new jsPDF();

        doc.setFontSize(12);
        doc.text("ReUse Mart", 14, 20);
        doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 14, 26);

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text("LAPORAN Donasi Barang", 14, 36);
        const textWidth = doc.getTextWidth("LAPORAN Donasi Barang");
        doc.setLineWidth(0.5);
        doc.line(14, 37, 14 + textWidth, 37);

        doc.setFont(undefined, 'normal');
        doc.setFontSize(12);

        const now = new Date();
        const tahun = now.getFullYear();
        const tanggalCetak = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

        doc.text(`Tahun : ${tahun}`, 14, 44);
        doc.text(`Tanggal cetak: ${tanggalCetak}`, 14, 50);

        const bodyData = donasiList.map(item => [
            item.kode_produk,
            item.nama_produk,
            item.id_penitip,
            item.nama_penitip,
            new Date(item.tanggal_donasi).toLocaleDateString('id-ID'),
            item.organisasi,
            item.nama_penerima
        ]);

        autoTable(doc, {
            startY: 58,
            head: [[
                "Kode Produk", "Nama Produk", "Id Penitip", "Nama Penitip",
                "Tanggal Donasi", "Organisasi", "Nama Penerima"
            ]],
            body: bodyData,
            styles: {
                fontSize: 10,
                textColor: 0,
                lineColor: [0, 0, 0],
                lineWidth: 0.1
            },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: 0,
                lineColor: [0, 0, 0],
                lineWidth: 0.1
            },
            theme: 'grid'
        });

        doc.save("laporan-donasi-barang.pdf");
    };

    return (
        <div className="container mt-5 bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
                <h2>Laporan Donasi Barang</h2>
                <button className="btn btn-success fs-5" onClick={handleDownload}>
                    <img src="https://img.icons8.com/?size=100&id=83159&format=png&color=FFFFFF" style={{ width: "30px" }} alt="Download" />
                    Unduh Laporan
                </button>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Kode Produk</th>
                        <th>Nama Produk</th>
                        <th>Id Penitip</th>
                        <th>Nama Penitip</th>
                        <th>Tanggal Donasi</th>
                        <th>Organisasi</th>
                        <th>Nama Penerima</th>
                    </tr>
                </thead>
                <tbody>
                    {donasiList.length > 0 ? donasiList.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.kode_produk}</td>
                            <td>{item.nama_produk}</td>
                            <td>{item.id_penitip}</td>
                            <td>{item.nama_penitip}</td>
                            <td>{new Date(item.tanggal_donasi).toLocaleDateString('id-ID')}</td>
                            <td>{item.organisasi}</td>
                            <td>{item.nama_penerima}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="8" className="text-center fs-5">Belum ada data donasi</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
