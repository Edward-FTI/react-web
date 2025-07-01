import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { GetPenitipIdAll } from "../Api/apiPenitip";
import { GetBarangByPenitipAndMonth } from "../Api/apiBarang";

export default function LapPenitip() {
  const [penitipList, setPenitipList] = useState([]);
  const [idPenitip, setIdPenitip] = useState("");
  const [bulan, setBulan] = useState("");
  const [dataBarang, setDataBarang] = useState([]);

  const namaBulan = (angkaBulan) => {
    const bulanArray = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return bulanArray[angkaBulan - 1] || "";
  };

  const fetchPenitip = async () => {
    try {
      const data = await GetPenitipIdAll();
      setPenitipList(data);
    } catch (error) {
      toast.error("Gagal mengambil data penitip");
    }
  };

  const fetchDataBarang = async () => {
    if (!idPenitip || !bulan) return;
    const payload = {
      id_penitip: parseInt(idPenitip),
      bulan: parseInt(bulan),
    };

    try {
      const data = await GetBarangByPenitipAndMonth(payload);
      setDataBarang(data);
    } catch (error) {
      toast.error(error.message || "Gagal mengambil data barang");
    }
  };

  useEffect(() => {
    fetchPenitip();
  }, []);

  const handleDownload = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("ReUse Mart", 14, 18);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 14, 25);

    doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text("LAPORAN TRANSAKSI PENITIP", 14, 36);
        const textWidth = doc.getTextWidth("LAPORAN TRANSAKSI PENITIP");
        doc.setLineWidth(0.5);
        doc.line(14, 37, 14 + textWidth, 37);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const tanggalCetak = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const penitipData = penitipList.find((p) => p.id === parseInt(idPenitip));
    const namaPenitip = penitipData ? penitipData.nama_penitip : "-";
    const tahun = new Date().getFullYear();

    const info = [
      `ID Penitip : T${idPenitip}`,
      `Nama Penitip : ${namaPenitip}`,
      `Bulan : ${namaBulan(parseInt(bulan))}`,
      `Tahun : ${tahun}`,
      `Tanggal Cetak : ${tanggalCetak}`,
    ];

    let infoStartY = 45;
    info.forEach((line) => {
      doc.text(line, 14, infoStartY);
      infoStartY += 6;
    });

    const bodyData = dataBarang.map((item) => [
      item["Kode Produk"],
      item["Nama Produk"],
      item["Tanggal Masuk"],
      item["Tanggal Laku"],
      item["Harga Jual Bersih"].toLocaleString("id-ID"),
      item["Bonus Terjual Cepat"].toLocaleString("id-ID"),
      item["Pendapatan Penitip"].toLocaleString("id-ID"),
    ]);

    const totalHarga = dataBarang.reduce(
      (sum, item) => sum + item["Harga Jual Bersih"],
      0
    );
    const totalBonus = dataBarang.reduce(
      (sum, item) => sum + item["Bonus Terjual Cepat"],
      0
    );
    const totalPendapatan = dataBarang.reduce(
      (sum, item) => sum + item["Pendapatan Penitip"],
      0
    );

    bodyData.push([
      {
        content: "TOTAL",
        colSpan: 4,
        styles: { halign: "center", fontStyle: "bold" },
      },
      totalHarga.toLocaleString("id-ID"),
      totalBonus.toLocaleString("id-ID"),
      totalPendapatan.toLocaleString("id-ID"),
    ]);

    autoTable(doc, {
      startY: infoStartY + 5,
      head: [
        [
          "Kode Produk",
          "Nama Produk",
          "Tanggal Masuk",
          "Tanggal Laku",
          "Harga Jual Bersih (sudah dipotong Komisi)",
          "Bonus Terjual Cepat",
          "Pendapatan",
        ],
      ],
      body: bodyData,
      styles: {
        fontSize: 9,
        cellPadding: 2.5,
        valign: "middle",
        lineWidth: 0.3,
        lineColor: [0, 0, 0], // all borders black
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 9.5,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
        lineWidth: 0.3,
        lineColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 28 }, // Kode Produk
        1: { cellWidth: 50 }, // Nama Produk
        2: { cellWidth: 28 }, // Tanggal Masuk
        3: { cellWidth: 28 }, // Tanggal Laku
        4: { cellWidth: 50 }, // Harga Jual Bersih
        5: { cellWidth: 35 }, // Bonus Terjual Cepat
        6: { cellWidth: 35 }, // Pendapatan
      },
      didDrawPage: (data) => {
        doc.setFontSize(9);
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          pageWidth - 14,
          doc.internal.pageSize.height - 10,
          { align: "right" }
        );
      },
    });

    doc.save("laporan-transaksi-penitip.pdf");
  };

  return (
    <div className="container mt-5 bg-white p-4 rounded shadow">
      <h2 className="mb-4">Laporan Transaksi Penitip</h2>

      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <label className="form-label">Pilih ID Penitip</label>
          <select
            className="form-select"
            value={idPenitip}
            onChange={(e) => setIdPenitip(e.target.value)}
          >
            <option value="">-- Pilih ID Penitip --</option>
            {penitipList.map((p) => (
              <option key={p.id} value={p.id}>
                {`T${p.id}`}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3 mb-2">
          <label className="form-label">Pilih Bulan</label>
          <select
            className="form-select"
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
          >
            <option value="">-- Pilih Bulan --</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {namaBulan(i + 1)}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2 d-flex align-items-end mb-2">
          <button
            className="btn btn-primary w-100"
            onClick={fetchDataBarang}
            disabled={!idPenitip || !bulan}
          >
            Tampilkan
          </button>
        </div>

        <div className="col-md-3 d-flex align-items-end mb-2">
          <button
            className="btn btn-success w-100"
            onClick={handleDownload}
            disabled={dataBarang.length === 0}
          >
            Unduh PDF
          </button>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>No</th>
            <th>Kode Produk</th>
            <th>Nama Produk</th>
            <th>Tanggal Masuk</th>
            <th>Tanggal Laku</th>
            <th>Harga Jual Bersih</th>
            <th>Bonus Terjual Cepat</th>
            <th>Pendapatan</th>
          </tr>
        </thead>
        <tbody>
          {dataBarang.length > 0 ? (
            <>
              {dataBarang.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item["Kode Produk"]}</td>
                  <td>{item["Nama Produk"]}</td>
                  <td>{item["Tanggal Masuk"]}</td>
                  <td>{item["Tanggal Laku"]}</td>
                  <td>{item["Harga Jual Bersih"].toLocaleString("id-ID")}</td>
                  <td>{item["Bonus Terjual Cepat"].toLocaleString("id-ID")}</td>
                  <td>{item["Pendapatan Penitip"].toLocaleString("id-ID")}</td>
                </tr>
              ))}
              <tr className="fw-bold">
                <td colSpan={5} className="text-end">
                  TOTAL
                </td>
                <td>
                  {dataBarang
                    .reduce((sum, item) => sum + item["Harga Jual Bersih"], 0)
                    .toLocaleString("id-ID")}
                </td>
                <td>
                  {dataBarang
                    .reduce((sum, item) => sum + item["Bonus Terjual Cepat"], 0)
                    .toLocaleString("id-ID")}
                </td>
                <td>
                  {dataBarang
                    .reduce((sum, item) => sum + item["Pendapatan Penitip"], 0)
                    .toLocaleString("id-ID")}
                </td>
              </tr>
            </>
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                Belum ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
