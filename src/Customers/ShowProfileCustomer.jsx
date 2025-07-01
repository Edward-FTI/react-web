import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { GetPembeliInfo } from "../Api/apiPembeli";
import { GetAlltransaksi_penjualanPembeli } from "../Api/apitransaksi_penjualans";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function ShowProfileCustomer() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pembeli, setPembeli] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedTransaksiId, setSelectedTransaksiId] = useState(null);
  const [rating, setRating] = useState(0);

  const fetchTransaksi = async () => {
    try {
      const data = await GetAlltransaksi_penjualanPembeli();
      setTransaksiList(data);
    } catch (error) {
      alert("Gagal mengambil data transaksi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi();
  }, []);

  useEffect(() => {
    GetPembeliInfo()
      .then((dataPembeli) => setPembeli(dataPembeli))
      .catch((err) => console.error(err));
  }, []);

  const handleShowModal = (id) => {
    setSelectedTransaksiId(id);
    setShowModal(true);
  };

  const handleRatingSubmit = () => {
    // Simpan rating ke server atau state
    const updatedTransaksiList = transaksiList.map((t) =>
      t.id === selectedTransaksiId ? { ...t, rating } : t
    );
    setTransaksiList(updatedTransaksiList);

    setShowModal(false);
    setSelectedTransaksiId(null);
    setRating(0);
  };

  const formatNomorNota = (createdAt, id) => {
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}.${month}.${id}`;
  };

  if (!pembeli) return <div>Loading...</div>;

  return (
    <Container fluid>
      <Row>
        <Col md={8}>
          <div className="container mt-5 bg-white p-4 rounded shadow">
            <h2 className="mb-4">Daftar Transaksi Pembeli</h2>

            {loading ? (
              <div>Loading...</div>
            ) : transaksiList.length === 0 ? (
              <div className="alert alert-info">Belum ada transaksi</div>
            ) : (
              <Table bordered hover>
                <thead className="table-light">
                  <tr>
                    <th>No</th>
                    <th>Nomor Nota</th>
                    <th>Alamat Pengiriman</th>
                    <th>Ongkir</th>
                    <th>Status Pengiriman</th>
                    <th>Status Pembelian</th>
                    <th>Verifikasi Pembayaran</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {transaksiList.map((t, i) => (
                    <tr key={t.id}>
                      <td>{i + 1}</td>
                      <td>{formatNomorNota(t.created_at, t.id)}</td>
                      <td>{t.alamat_pengiriman || "-"}</td>
                      <td>
                        {t.ongkir?.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }) || "-"}
                      </td>
                      <td>{t.status_pengiriman}</td>
                      <td>{t.status_pembelian}</td>
                      <td>
                        {t.verifikasi_pembayaran == 1
                          ? "Terverifikasi"
                          : "Belum Verifikasi"}
                      </td>
                      <td>
                        {t.rating ? (
                          <Button variant="success" disabled>
                            {t.rating} ★
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            onClick={() => handleShowModal(t.id)}
                          >
                            Beri Rating
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Col>
        <Col md={4}>
          <h3>Profil Pembeli</h3>
          <Card>
            <Card.Img
              variant="top"
              src="/src/assets/Logo/profil.png"
              alt="Profiles"
            />
            <Card.Body>
              <Card.Title>{pembeli.nama}</Card.Title>
              <Card.Text>{pembeli.deskripsi}</Card.Text>
            </Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Email:</strong> {pembeli.email}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Point:</strong> {pembeli.point}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Saldo: Rp </strong> {pembeli.saldo}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Beri Rating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h5>Pilih Rating</h5>
            {[1, 2, 3, 4, 5].map((r) => (
              <Button
                key={r}
                variant={r === rating ? "warning" : "outline-warning"}
                className="m-1"
                onClick={() => setRating(r)}
              >
                {r} ★
              </Button>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleRatingSubmit}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ShowProfileCustomer;
