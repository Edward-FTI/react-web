import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { GetPenitipData } from "../Api/apiPenitip";

function ShowProfilePenitip() {
  const [penitip, setPenitip] = useState(null);

  useEffect(() => {
    GetPenitipData()
      .then((data) => setPenitip(data))
      .catch((err) => console.error(err));
  }, []);

  if (!penitip) return <div>Loading...</div>;

  return (
    <Container fluid>
      <Row>
        <Col md={8}>
          {/* <h3>Data Penitip</h3>
          <p>Nama: {penitip.nama_penitip}</p>
          <p>Alamat: {penitip.alamat}</p>
          <p>No KTP: {penitip.no_ktp}</p>
          <p>Email: {penitip.email}</p>
          <p>Saldo: Rp {penitip.saldo.toLocaleString()}</p>
          <p>Point: {penitip.point}</p>
          <p>Badge: {penitip.badge}</p> */}
        </Col>

        <Col md={4}>
          <h3>Profil Penitip</h3>
          <Card>
            <Card.Img
              variant="top"
              src="/src/assets/Logo/profil.png"
              alt="Profile"
            />
            <Card.Body>
              <Card.Title>{penitip.nama_penitip}</Card.Title>
              <Card.Text>{penitip.alamat}</Card.Text>
            </Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>No KTP:</strong> {penitip.no_ktp}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Email:</strong> {penitip.email}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Point:</strong> {penitip.point}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Saldo:</strong> Rp {penitip.saldo.toLocaleString()}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Badge:</strong> {penitip.badge}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ShowProfilePenitip;
