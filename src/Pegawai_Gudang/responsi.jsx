import React, { useEffect, useState } from "react";
import { GetAllBarang } from "../Api/apiBarang"; // Pastikan path sesuai

export default function BarangPenitipSatuBulan() {
    const [barangList, setBarangList] = useState([]);
    const idPenitip = 1;


    useEffect(() => {
        const fetchBarang = async () => {
            try {
                const allBarang = await GetAllBarang();
                const now = new Date();
                const satuBulanKedepan = new Date();
                satuBulanKedepan.setMonth(satuBulanKedepan.getMonth() + 1);

                const filtered = allBarang.filter(
                    (b) =>
                        b.id_penitip === idPenitip &&
                        b.tgl_penitipan &&
                        new Date(b.tgl_penitipan) >= now &&
                        new Date(b.tgl_penitipan) <= satuBulanKedepan
                );
                setBarangList(filtered);
            } catch (error) {
                alert("Gagal mengambil data barang");
            }
        };
        fetchBarang();
    }, []);

    return (
        <div>
            <h3>Barang Titipan Penitip ID {idPenitip}</h3>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Barang</th>
                        <th>Tanggal Titip</th>
                        <th>Nama Penitip</th>
                        <th>Status Barang</th>
                        <th>Harga Barang</th>
                    </tr>
                </thead>
                <tbody>
                    {barangList.length > 0 ? barangList.map((b, i) => (
                        <tr key={b.id}>
                            <td>{i + 1}</td>
                            <td>{b.nama_barang}</td>
                            <td>{b.tgl_penitipan ? new Date(b.tgl_penitipan).toLocaleDateString("id-ID") : "-"}</td>
                            <td>{b.penitip?.nama_penitip || "-"}</td>
                            <td>{b.status_barang}</td>
                            <td>{b.harga_barang ? b.harga_barang.toLocaleString("id-ID") : "-"}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={6} className="text-center">Tidak ada barang</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}