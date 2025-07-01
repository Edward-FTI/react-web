import React, { useEffect, useRef, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { getAlltransaksiPenjualan } from "../Api/apitransaksi_penjualans";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PenjualanBulanan() {
    const [penjualanList, setPenjualanList] = useState([]);
    const [totalKeseluruhan, setTotalKeseluruhan] = useState(0);
    const chartRef = useRef(null);

    const fetchPenjualan = async () => {
        try {
            const data = await getAlltransaksiPenjualan();
            const bulanData = Array.from({ length: 12 }, (_, i) => ({
                bulan: new Date(2024, i).toLocaleString("id-ID", { month: "long" }),
                jumlah: 0,
                total: 0,
            }));

            data.forEach((item) => {
                const tanggal = new Date(item.created_at);
                const bulanIndex = tanggal.getMonth();
                bulanData[bulanIndex].jumlah += 1;
                bulanData[bulanIndex].total += item.total_harga_pembelian;
            });

            setPenjualanList(bulanData);
            const totalSemua = bulanData.reduce((acc, cur) => acc + cur.total, 0);
            setTotalKeseluruhan(totalSemua);
        } catch (error) {
            toast.error("Gagal mengambil data transaksi penjualan");
        }
    };

    useEffect(() => {
        fetchPenjualan();
    }, []);

    const handleDownloadPDF = async () => {
        const doc = new jsPDF();
        const tanggalCetak = new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        // Header
        doc.setFontSize(14);
        doc.text("ReUse Mart", 14, 15);
        doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 14, 22);
        doc.text("Laporan Penjualan Bulanan", 14, 32);
        doc.setFontSize(12);
        doc.text("Tahun: 2024", 14, 39);
        doc.text(`Tanggal cetak: ${tanggalCetak}`, 14, 46);

        // Tabel Data
        autoTable(doc, {
            startY: 55,
            head: [["Bulan", "Jumlah Barang Terjual", "Jumlah Penjualan Kotor"]],
            body: penjualanList.map((item) => [
                item.bulan,
                item.jumlah > 0 ? item.jumlah : "",
                item.total > 0 ? item.total.toLocaleString("id-ID") : "",
            ]),
            foot: [[
                { content: "Total", colSpan: 2 },
                totalKeseluruhan.toLocaleString("id-ID")
            ]],
            styles: {
                fontSize: 10,
                lineColor: 0,
                lineWidth: 0.1,
                textColor: 20,
            },
            headStyles: {
                fillColor: [255, 255, 255], // putih polos
                textColor: 20,
                fontStyle: 'bold',
                halign: 'center',
            },
            footStyles: {
                fillColor: [255, 255, 255],
                textColor: 20,
                fontStyle: 'bold',
            },
            theme: 'grid', // gunakan grid untuk garis-garis tabel
        });


        // Screenshot grafik (gunakan ref)
        if (chartRef.current) {
            const canvas = await html2canvas(chartRef.current, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = doc.internal.pageSize.getWidth() - 20;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let currentY = doc.lastAutoTable.finalY + 10;
            if (currentY + pdfHeight > doc.internal.pageSize.getHeight()) {
                doc.addPage();
                currentY = 10;
            }
            doc.addImage(imgData, "PNG", 14, currentY + 5, pdfWidth, pdfHeight);
        }

        doc.save(`Laporan_Penjualan_Bulanan_${Date.now()}.pdf`);
    };

    return (
        <div className="container mt-5 bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
                <h2>Laporan Penjualan Bulanan</h2>
                <button onClick={handleDownloadPDF} className="btn btn-success fs-5">
                    <img
                        src="https://img.icons8.com/?size=100&id=83159&format=png&color=FFFFFF"
                        style={{ width: "30px" }}
                        alt="Download"
                    />
                    Unduh Laporan
                </button>
            </div>

            <div>
                <div className="mb-3">
                    <strong>ReUse Mart</strong>
                    <br />
                    Jl. Green Eco Park No. 456 Yogyakarta
                </div>

                <div className="mb-3">
                    <strong>LAPORAN PENJUALAN BULANAN</strong>
                    <br />
                    Tahun: 2024
                    <br />
                    Tanggal cetak:{" "}
                    {new Date().toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </div>

                <table
                    className="table table-bordered"
                    style={{ width: "100%", fontSize: "14px" }}
                >
                    <thead>
                        <tr>
                            <th>Bulan</th>
                            <th>Jumlah Barang Terjual</th>
                            <th>Jumlah Penjualan Kotor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {penjualanList.map((p, index) => (
                            <tr key={index}>
                                <td>{p.bulan}</td>
                                <td>{p.jumlah > 0 ? p.jumlah : ""}</td>
                                <td>{p.total > 0 ? p.total.toLocaleString("id-ID") : ""}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="fw-bold table-light">
                            <td colSpan={2}>Total</td>
                            <td>{totalKeseluruhan.toLocaleString("id-ID")}</td>
                        </tr>
                    </tfoot>
                </table>

                <div ref={chartRef} className="mt-4">
                    <BarChart
                        height={500}
                        width={1000}
                        xAxis={[
                            { data: penjualanList.map((d) => d.bulan.slice(0, 3)) },
                        ]}
                        yAxis={[
                            {
                                min: 0,
                                max: 30000000,
                                tickInterval: 2000000,
                                valueFormatter: (value) => {
                                    if (value >= 1000000) {
                                        return `${(value / 1000000).toFixed(1)} jt`;
                                    }
                                    return value.toLocaleString("id-ID");
                                },
                            },
                        ]}
                        series={[
                            {
                                data: penjualanList.map((d) => d.total),
                                color: "#6C8EF2",
                            },
                        ]}
                        grid={{ horizontal: true }}
                    />
                </div>
            </div>
        </div>
    );
}
