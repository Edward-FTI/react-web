import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./DetailBarang.css"; // untuk custom style opsional

const DetailBarang = () => {
    const { id } = useParams();
    const [barang, setBarang] = useState(null);
    const [loading, setLoading] = useState(true);
    const [jumlah, setJumlah] = useState(1);

    useEffect(() => {
        const fetchBarang = async () => {
            try {
                const response = await axios.get(`http://p3l.reusemart.fun/api/barang/${id}`);
                setBarang(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching detail barang:", error);
                setLoading(false);
            }
        };
        fetchBarang();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!barang) return <p>Barang tidak ditemukan.</p>;

    const gambarArray = [];
    if (barang.gambar) gambarArray.push(barang.gambar);
    if (barang.gambar_dua) gambarArray.push(barang.gambar_dua);

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Gambar Carousel */}
                <div className="col-md-6">
                    <div id="carouselBarang" className="carousel slide" data-bs-ride="carousel" style={{ maxWidth: "350px", margin: "0 auto" }} >
                        <div className="carousel-inner border rounded">
                            {gambarArray.map((gambar, index) => (
                                <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
                                    <img
                                        src={`http://p3l.reusemart.fun/${gambar}`}
                                        className="d-block mx-auto img-fluid p-3"
                                        style={{ maxHeight: "400px", objectFit: "contain" }}
                                        alt={`Gambar ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                        {gambarArray.length > 1 && (
                            <>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselBarang" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselBarang" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Informasi Produk */}
                <div className="col-md-6">
                    <h4>{barang.nama_barang}</h4>
                    <p className="text-muted">Stok: {barang.stok}</p>
                    <h3 className="text-danger">Rp{barang.harga_barang.toLocaleString()}</h3>
                    <p className="fw-semibold">Subtotal: Rp {(barang.harga_barang * jumlah).toLocaleString()}</p>

                    {/* Tombol Aksi */}
                    <div className="d-flex gap-2">
                        <button className="btn btn-success w-50">Beli</button>
                        <button className="btn btn-outline-success w-50">+ Keranjang</button>
                    </div>

                    <hr />
                    <p><strong>Garansi:</strong> {barang.status_garansi}</p>
                    <p><strong>Deskripsi:</strong> {barang.deskripsi}</p>
                </div>
            </div>
        </div>
    );
};

export default DetailBarang;
