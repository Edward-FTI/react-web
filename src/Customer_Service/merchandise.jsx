import React, { useEffect, useState } from "react";
import { getAllMerchandise, updateTanggalPengambilan } from "../Api/apiMerchandise";
import { toast } from "sonner";

const Merchandise = () => {
    const [merchandiseList, setMerchandiseList] = useState([]);
    const [filterStatus, setFilterStatus] = useState("");

    const fetchMerchandise = async () => {
        try {
            const data = await getAllMerchandise();
            setMerchandiseList(data);
        } catch (error) {
            toast.error("Gagal mengambil data klaim merchandise");
        }
    };

    useEffect(() => {
        fetchMerchandise();
    }, []);

    // Filtered list berdasarkan status
    const filteredMerchandise = merchandiseList.filter((m) => {
        if (filterStatus === "") return true;
        return m.status.toLowerCase() === "belum diambil";
    });

    return (
        <div className="container mt-5 bg-white p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2>Data Barang</h2>
                </div>
                <div className="mb-3">
                    <label htmlFor="statusSelect" className="form-label fw-semibold">Status Pengambilan</label>
                    <select
                        id="statusSelect"
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">Semua</option>
                        <option value="belum-diambil">Belum Diambil</option>
                    </select>
                </div>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-light">
                    <tr>
                        <th>No</th>
                        <th>Nama Pembeli</th>
                        <th>Jenis Merchandise</th>
                        <th>Nama Pegawai</th>
                        <th>Jumlah</th>
                        <th>Tanggal Pengambilan</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMerchandise.map((m, index) => (
                        <tr key={m.id}>
                            <td>{index + 1}</td>
                            <td>{m.pembeli.nama_pembeli}</td>
                            <td>{m.merchandise.nama_merchandise}</td>
                            <td>{m.pegawai?.nama || "-"}</td>
                            <td>{m.jumlah}</td>
                            <td>
                                {m.tanggal_penukaran
                                    ? new Date(m.tanggal_penukaran).toLocaleDateString("id-ID")
                                    : "-"}
                            </td>
                            <td>{m.status}</td>
                            <td className="d-flex flex-column">
                                {m.status === "Belum diambil" ? (
                                    <>
                                        <input
                                            type="date"
                                            className="form-control mb-2"
                                            value={m.tanggalInput || ""}
                                            onChange={(e) => {
                                                const newList = [...merchandiseList];
                                                newList[index].tanggalInput = e.target.value;
                                                setMerchandiseList(newList);
                                            }}
                                        />
                                        <button
                                            className="btn btn-success"
                                            onClick={async () => {
                                                try {
                                                    if (!m.tanggalInput) {
                                                        toast.error("Tanggal belum dipilih");
                                                        return;
                                                    }
                                                    await updateTanggalPengambilan(m.id, m.tanggalInput);
                                                    toast.success("Tanggal berhasil diinput");
                                                    fetchMerchandise();
                                                } catch (error) {
                                                    toast.error("Gagal input tanggal");
                                                }
                                            }}
                                        >
                                            Simpan
                                        </button>
                                    </>
                                ) : (
                                    <span>-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Merchandise;
