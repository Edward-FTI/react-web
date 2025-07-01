// import { Link } from "react-router-dom"
// import { useState } from "react"
// import { useEffect } from "react"
import React from "react"
import { Navbar, Nav } from "react-bootstrap"
import Container from 'react-bootstrap/Container';

<style>
    padding: 90px;
</style>

function NavbarPage() {
  return (
      <Navbar bg="primary" data-bs-theme="dark" >
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
  );
}

export default NavbarPage;