import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { BarangOwner } from "../Api/apiBarang";
import { toast } from "sonner";

// Ambil data barang publik (tanpa auth)
const API_URL = "https://www.p3l.reusemart.fun/api/indexOwner";

export default function StokGudang() {
    const [barangList, setBarangList] = useState([]);

    // useEffect(() => {
    //     fetchBarang();
    // }, []);

    // const fetchBarang = async () => {
    //     try {
    //         const response = await fetch(API_URL);
    //         const result = await response.json();
    //         // Data array ada di result.data
    //         setBarangList(result.data || []);
    //     } catch (error) {
    //         alert("Gagal mengambil data barang");
    //     }
    // };

    const fetchBarang = async () => {
        try {
            const data = await BarangOwner();
            setBarangList(data);
        }
        catch (error) {
            toast.error("Gagal mengambil data barang")
            console.log(error);
        }
    }

    useEffect(() => {
        fetchBarang();
    }, []);

    const handleDownloadPDF = () => {
        const pdf = new jsPDF("p", "mm", "a4");
        const marginX = 10;
        const pageWidth = 210;
        const contentWidth = pageWidth - 2 * marginX;
        const startY = 10;
        const totalHeaderHeight = 30;

        // Header
        pdf.setFont("times", "bold");
        pdf.setFontSize(11);
        pdf.text("ReUse Mart", marginX + 2, 15);

        pdf.setFont("times", "normal");
        pdf.setFontSize(10);
        pdf.text("Jl. Green Eco Park No. 456 Yogyakarta", marginX + 2, 20);

        const laporanText = "LAPORAN Stok Gudang";
        const xText = marginX + 2;
        const yText = 30;

        pdf.setFont("times", "bold");
        pdf.setFontSize(11);
        pdf.text(laporanText, xText, yText);

        const textWidth = pdf.getTextWidth(laporanText);
        pdf.setLineWidth(0.2);
        pdf.line(xText, yText + 1, xText + textWidth, yText + 1);

        pdf.setFont("times", "normal");
        pdf.setFontSize(10);
        // pdf.text("Tanggal cetak: " + new Date().toLocaleDateString("id-ID"), marginX + 2, 35);
        pdf.text(
            "Tanggal cetak: " + new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            }),
            marginX + 2,
            35
        );


        // Data tabel
        const tableColumn = [
            "Kode Produk", "Nama Produk", "ID Penitip", "Nama Penitip", "Tanggal Masuk",
            "Perpanjangan", "ID Hunter", "Nama Hunter", "Harga"
        ];

        const tableRows = barangList.map(item => [
            // item.kode_barang || item.id || "-",
            `${item.nama_barang?.charAt(0).toUpperCase() || ''}${item.id}`,

            item.nama_barang || "-",
            item.penitip ? `T${item.penitip.id}` : "-",
            item.penitip ? item.penitip.nama_penitip : "-",
            item.tgl_penitipan ? new Date(item.tgl_penitipan).toLocaleDateString("id-ID") : "-",
            item.penambahan_durasi > 0 ? "Ya" : "Tidak",
            item.hunter ? `P${item.hunter.id}` : "-",
            item.hunter ? item.hunter.nama : "-",
            item.harga_barang ? item.harga_barang.toLocaleString("id-ID") : "-"
        ]);

        // Border header
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.1);
        pdf.rect(marginX, startY, contentWidth, totalHeaderHeight);

        // AutoTable
        autoTable(pdf, {
            startY: startY + totalHeaderHeight,
            margin: { left: marginX, right: marginX },
            head: [tableColumn],
            body: tableRows,
            styles: {
                lineColor: [0, 0, 0],
                lineWidth: 0.1,
                fontSize: 9,
                cellPadding: 3,
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
            },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineColor: [0, 0, 0],
                lineWidth: 0.1,
                fontStyle: "bold",
            },
            theme: "grid",
            tableLineWidth: 0,
            tableLineColor: [0, 0, 0],
        });

        pdf.save("Laporan_Stok_Gudang.pdf");
    };

    return (
        <div className="container mt-5 bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
                <h2>Laporan Stok Gudang</h2>
                <button
                    className="btn btn-success fs-5"
                    onClick={handleDownloadPDF}
                >
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
                        <th>ID Penitip</th>
                        <th>Nama Penitip</th>
                        <th>Tanggal Masuk</th>
                        <th>Perpanjangan</th>
                        <th>ID Hunter</th>
                        <th>Nama Hunter</th>
                        <th>Harga</th>
                    </tr>
                </thead>
                <tbody>
                    {barangList.length > 0 ? barangList.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            {/* <td>{item.kode_barang || item.id || "-"}</td> */}
                            <td>{`${item.nama_barang?.charAt(0).toUpperCase() || ''}${item.id}`}</td>

                            <td>{item.nama_barang}</td>
                            <td>{item.penitip ? `T${item.penitip.id}` : "-"}</td>
                            <td>{item.penitip ? item.penitip.nama_penitip : "-"}</td>
                            <td>{item.tgl_penitipan ? new Date(item.tgl_penitipan).toLocaleDateString("id-ID") : "-"}</td>
                            <td>{item.penambahan_durasi > 0 ? "Ya" : "Tidak"}</td>
                            <td>{item.hunter ? `P${item.hunter.id}` : "-"}</td>
                            <td>{item.hunter ? item.hunter.nama : "-"}</td>
                            <td>{item.harga_barang ? item.harga_barang.toLocaleString("id-ID") : "-"}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="10" className="text-center fs-5">Belum ada data barang</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}