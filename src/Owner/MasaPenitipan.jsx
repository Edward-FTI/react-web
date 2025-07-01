import React, { useEffect, useState } from "react";
import { GetAllBarang } from "../Api/apiBarang";
import { GetAllPenitip } from "../Api/apiPenitip";
import { GetAllKategori } from "../Api/apiKategori";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MasaPenitipan = () => {
  const [penitip, setPenitip] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPenitip();
    fetchBarang();
  }, []);

  // const getKodeKategori = (id_kategori) => {
  //   const kodeMap = {
  //     1: "K", // Makanan
  //     2: "P", // Pakaian
  //     3: "A", // Alat rumah
  //     4: "E", // Elektronik
  //     5: "S", // Sepatu
  //     6: "B", // Buku
  //     7: "D", // Dekorasi
  //     8: "T", // Tanaman
  //     9: "M", // Mainan
  //     10: "O", // Otomotif
  //   };
  //   return kodeMap[id_kategori] || "X"; // Default: "X" jika id tidak dikenali
  // };

  const fetchPenitip = async () => {
    try {
      const response = await GetAllPenitip();
      console.log("Data penitip:", response.data); // <- Tambahan ini
      setPenitip(response.data || []);
    } catch (error) {
      console.error("Error fetching penitip:", error);
    }
  };

  const fetchBarang = async () => {
    try {
      const result = await GetAllBarang();
      console.log("Data barang:", result); // Cek data di console
      // Assuming result is an array of barang objects. Each barang object should have an id_penitip.
      // Example barang structure: { id: "K202", nama_barang: "Kipas angin Jumbo", id_penitip: 1, tgl_penitipan: "2025-03-29", masa_penitipan: "2025-04-29" }
      setData(result || []);
    } catch (error) {
      console.error("Error fetching barang:", error);
    }
  };

  const formatTanggal = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-"; // Use getTime() for robust NaN check
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTanggalSampul = (date) => {
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

  const filteredData = data.filter((barang) => {
    if (!barang.masa_penitipan) return false;

    const masa = new Date(barang.masa_penitipan);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const limit = new Date(now);
    limit.setDate(now.getDate() + 7);
    limit.setHours(23, 59, 59, 999);

    // Tambahkan cek status_barang di sini
    if (barang.status_barang !== "penitip habis") return false;

    return masa < now && masa <= limit;
  });

  const generatePDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const marginX = 14;
    const pageWidth = 210;
    const contentWidth = pageWidth - 2 * marginX;
    const startY = 10;
    const totalHeaderHeight = 40; // header + spasi

    // Header
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("ReUse Mart", marginX, 20);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Jl. Green Eco Park No. 456 Yogyakarta", marginX, 25);

    // Teks bold + underline untuk Judul Laporan
    const laporanY = 35;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    const laporanText = "LAPORAN Barang yang Masa Penitipannya Sudah Habis";
    pdf.text(laporanText, marginX, laporanY);

    // Tambahkan garis bawah sebagai underline (manual)
    const textWidth = pdf.getTextWidth(laporanText);
    pdf.setLineWidth(0.5);
    pdf.line(marginX, laporanY + 1.5, marginX + textWidth, laporanY + 1.5); // garis di bawah teks

    // Tanggal cetak
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(`Tanggal cetak: ${formatTanggalSampul(new Date())}`, marginX, 43);

    // Border kotak header
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.2);
    pdf.rect(marginX - 2, 10, contentWidth + 4, totalHeaderHeight);

    // Kolom tabel
    const tableColumn = [
      "Kode Produk",
      "Nama Produk",
      "ID Penitip",
      "Nama Penitip",
      "Tanggal Masuk",
      "Tanggal Akhir",
      "Batas Ambil",
    ];

    // Baris data tabel
    const tableRows = filteredData.map((barang) => {
      const batasAmbilDate = new Date(barang.masa_penitipan);
      batasAmbilDate.setDate(batasAmbilDate.getDate() + 7);

      return [
        // `${getKodeKategori(barang.id_kategori)}${barang.id || "-"}`,
        `${barang.nama_barang.charAt(0).toUpperCase() || ''}${barang.id}`,
        barang.nama_barang || "-",
        `T${barang.id_penitip}`,
        barang.penitip?.nama_penitip || "-",
        //   findPenitip(barang.id_penitip),
        formatTanggal(barang.tgl_penitipan),
        formatTanggal(barang.masa_penitipan),
        formatTanggal(batasAmbilDate),
      ];
    });

    // Generate tabel dengan autoTable
    autoTable(pdf, {
      startY: startY + totalHeaderHeight + 5,
      margin: { left: marginX, right: marginX },
      head: [tableColumn],
      body: tableRows,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        fillColor: [255, 255, 255], // latar putih
        textColor: [0, 0, 0], // teks hitam
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [230, 230, 230], // abu muda header
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center" }, // Kode Produk center
        2: { halign: "center" }, // ID Penitip center
        4: { halign: "center" }, // Tanggal Masuk center
        5: { halign: "center" }, // Tanggal Akhir center
        6: { halign: "center" }, // Batas Ambil center
      },
      theme: "grid",
    });

    pdf.save("Laporan_Masa_Penitipan_Habis.pdf");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">
        LAPORAN Barang yang Masa Penitipannya Sudah Habis
      </h2>
      <p>ReUse Mart</p>
      <p>Jl. Green Eco Park No. 456 Yogyakarta</p>
      <p className="mb-4 text-sm text-gray-600">
        Tanggal cetak: {formatTanggalSampul(new Date())}
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
              <th>Kode Produk</th>
              <th>Nama Produk</th>
              <th>Id Penitip</th>
              <th>Nama Penitip</th>
              <th>Tanggal Masuk</th>
              <th>Tanggal Akhir</th>
              <th>Batas Ambil</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((barang, index) => (
                <tr key={index}>
                  <td>{`${barang.nama_barang.charAt(0).toUpperCase() || ''}${barang.id}`}</td>
                  <td>{barang.nama_barang || "-"}</td>
                  <td>{`T${barang.id_penitip}`}</td>
                  {/* Correctly display Nama Penitip */}
                  <td>{barang.penitip?.nama_penitip || "-"}</td>
                  <td>{formatTanggal(barang.tgl_penitipan)}</td>
                  <td>{formatTanggal(barang.masa_penitipan)}</td>
                  <td>
                    {formatTanggal(
                      new Date(barang.masa_penitipan).setDate(
                        new Date(barang.masa_penitipan).getDate() + 7
                      )
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Tidak ada data masa penitipan yang sudah habis.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MasaPenitipan;
