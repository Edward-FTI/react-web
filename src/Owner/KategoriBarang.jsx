import React, { useEffect, useState } from "react";
import { GetAllBarang } from "../Api/apiBarang"; // Assuming apiBarang.js contains GetAllBarang
import { GetAllKategori, LaporanKategori } from "../Api/apiKategori"; // Assuming api.js contains both
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

const KategoriBarang = () => {
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [laporanData, setLaporanData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [laporanRes, kategoriRes] = await Promise.all([
          LaporanKategori(),
          GetAllKategori(),
        ]);
        console.log("laporanRes:", laporanRes);
        console.log("kategoriRes:", kategoriRes);

        setLaporanData(Array.isArray(laporanRes) ? laporanRes : []);
        setKategoriList(Array.isArray(kategoriRes) ? kategoriRes : []);
      } catch (err) {
        setError("Failed to fetch data: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTanggal = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = d.getFullYear();
    return `${day} ${new Date(date).toLocaleString("id-ID", {
      month: "long",
    })} ${year}`;
  };

  const getNamaKategori = (id_kategori) => {
    const kategori = kategoriList.find((cat) => cat.id === id_kategori);
    return kategori ? kategori.nama_kategori : "-";
  };

  // Prepare data for display and PDF, ensuring all categories are listed
  const mergedData = kategoriList.map((kategori) => {
    const dataForCategory = laporanData.find(
      (item) => item.nama_kategori.trim() === kategori.nama_kategori.trim()
    );
    return {
      nama_kategori: kategori.nama_kategori,
      jumlah_item_terjual: dataForCategory ? dataForCategory.terjual : "...",
      jumlah_item_gagal_terjual: dataForCategory
        ? dataForCategory.gagal
        : "...",
    };
  });

  // Calculate totals
  const totalTerjual = mergedData.reduce((sum, item) => {
    const val = parseInt(item.jumlah_item_terjual);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const totalGagalTerjual = mergedData.reduce((sum, item) => {
    const val = parseInt(item.jumlah_item_gagal_terjual);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);


const generatePDF = () => {
  const pdf = new jsPDF("p", "mm", "a4");
  const marginX = 14;
  const pageWidth = 210;
  const contentWidth = pageWidth - 2 * marginX;
  const startY = 10;
  const totalHeaderHeight = 45; // header + spasi

  // Header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("ReUse Mart", marginX, 20);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("Jl. Green Eco Park No. 456 Yogyakarta", marginX, 25);

  // Judul laporan bold + underline
  const laporanY = 35;
  const laporanText = "Laporan Penjualan Per Kategori Barang (dalam 1 tahun)";
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text(laporanText, marginX, laporanY);

  // Garis underline manual
  const textWidth = pdf.getTextWidth(laporanText);
  pdf.setLineWidth(0.5);
  pdf.line(marginX, laporanY + 1.5, marginX + textWidth, laporanY + 1.5);

  // Tahun dan tanggal cetak
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Tahun : ${new Date().getFullYear()}`, marginX, 43);
  pdf.text(`Tanggal cetak: ${formatTanggal(new Date())}`, marginX, 48);

  // Border kotak header
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.2);
  pdf.rect(marginX - 2, 10, contentWidth + 4, totalHeaderHeight);

  // Kolom tabel
  const tableColumn = [
    "Kategori",
    "Jumlah Item Terjual",
    "Jumlah Item Gagal Terjual",
  ];

  // Baris data tabel dari mergedData (pastikan mergedData sudah di scope)
  const tableRows = mergedData.map((item) => [
    item.nama_kategori,
    item.jumlah_item_terjual,
    item.jumlah_item_gagal_terjual,
  ]);

  // Tambahkan baris total
  tableRows.push(["Total", totalTerjual, totalGagalTerjual]);

  // Generate tabel dengan autoTable
  autoTable(pdf, {
    startY: startY + totalHeaderHeight + 5,
    margin: { left: marginX, right: marginX },
    head: [tableColumn],
    body: tableRows,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "center" },
      2: { halign: "center" },
    },
    didParseCell: (data) => {
      // Bold baris total terakhir
      if (data.row.index === tableRows.length - 1) {
        data.cell.styles.fontStyle = "bold";
      }
    },
    theme: "grid",
  });

  pdf.save("Laporan_Penjualan_Per_Kategori.pdf");
};
//   if (loading) {
//     return <div className="p-4">Loading report data...</div>;
//   }

//   if (error) {
//     return <div className="p-4 text-danger">Error: {error}</div>;
//   }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">
        Laporan penjualan per kategori barang (dalam 1 tahun)
      </h2>
      <p>ReUse Mart</p>
      <p>Jl. Green Eco Park No. 456 Yogyakarta</p>
      <p className="mt-4">
        <span className="font-bold">LAPORAN PENJUALAN PER KATEGORI BARANG</span>
      </p>
      <p>Tahun : {new Date().getFullYear()}</p>
      <p className="mb-4 text-sm text-gray-600">
        Tanggal cetak: {formatTanggal(new Date())}
      </p>

      <div className="d-flex justify-content-end mt-3">
        <button onClick={generatePDF} className="btn btn-primary">
          Cetak Laporan PDF
        </button>
      </div>

      <div className="overflow-auto mt-3">
        <table className="table table-bordered table-striped table-hover text-center">
          <thead className="table-light">
            <tr>
              <th>Kategori</th>
              <th>Jumlah item terjual</th>
              <th>Jumlah item gagal terjual</th>
            </tr>
          </thead>
          <tbody>
            {mergedData.length > 0 ? (
              <>
                {mergedData.map((item, index) => (
                  <tr key={index}>
                    <td className="text-start">{item.nama_kategori}</td>
                    <td>{item.jumlah_item_terjual}</td>
                    <td>{item.jumlah_item_gagal_terjual}</td>
                  </tr>
                ))}
                <tr className="font-bold table-light">
                  <td className="text-start">Total</td>
                  <td>{totalTerjual}</td>
                  <td>{totalGagalTerjual}</td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  Tidak ada data penjualan per kategori.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KategoriBarang;
