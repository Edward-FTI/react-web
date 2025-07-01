import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { LapRequest_donasi } from "../Api/apiRequest_donasi";
import { toast } from "sonner";

export default function ReqDonasi() {
    const [requestList, setRequestList] = useState([]);

    const fetchRequest = async () => {
        try {
            const data = await LapRequest_donasi();
            setRequestList(data);
        } catch (error) {
            toast.error("Gagal mengambil data request donasi");
            console.log(error);
        }
    };

    useEffect(() => {
        fetchRequest();
    }, []);

    const handleDownload = () => {
        const doc = new jsPDF({ orientation: "landscape" });


        doc.setFontSize(12);
        doc.text("ReUse Mart", 14, 20);
        doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 14, 26);

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text("LAPORAN REQUEST DONASI", 14, 36);
        const textWidth = doc.getTextWidth("LAPORAN REQUEST DONASI");
        doc.setLineWidth(0.5);
        doc.line(14, 37, 14 + textWidth, 37);

        doc.setFont(undefined, 'normal');
        doc.setFontSize(12);

        const now = new Date();
        const tanggalCetak = now.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        doc.text(`Tanggal cetak: ${tanggalCetak}`, 14, 44);

        const bodyData = requestList.map(item => [
            item['ID Organisasi'],
            item['Nama'],
            item['Alamat'],
            item['Request']
        ]);

        autoTable(doc, {
            startY: 52,
            head: [["ID Organisasi", "Nama", "Alamat", "Request"]],
            body: bodyData,
            styles: {
                fontSize: 10,
                textColor: 0,
                lineColor: [0, 0, 0],
                lineWidth: 0.1,
                cellWidth: 'wrap'
            },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: 0,
                lineColor: [0, 0, 0],
                lineWidth: 0.1
            },
            theme: 'grid'
        });

        doc.save("laporan-request-donasi.pdf");
    };

    return (
        <div className="container mt-5 bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
                <h2>Laporan Request Donasi</h2>
                <button className="btn btn-success fs-5" onClick={handleDownload}>
                    <img src="https://img.icons8.com/?size=100&id=83159&format=png&color=FFFFFF" style={{ width: "30px" }} alt="Download" />
                    Unduh Laporan
                </button>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>ID Organisasi</th>
                        <th>Nama</th>
                        <th>Alamat</th>
                        <th>Request</th>
                    </tr>
                </thead>
                <tbody>
                    {requestList.length > 0 ? requestList.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item['ID Organisasi']}</td>
                            <td>{item['Nama']}</td>
                            <td>{item['Alamat']}</td>
                            <td>{item['Request']}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="text-center fs-5">Belum ada data request donasi</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
