import { Container, Card } from "react-bootstrap";
import FormRegister from "../register/register";
import "./Form.css";

const RegisterPage = () => {
  return (
    <Container className="mt-5">
      <div className="text-center mb-3">
        <h1 className="mt-1 pb-1 fw-bold">Sign Up</h1>
      </div>
      <Card className="form-card">
        <FormRegister />
      </Card>
    </Container>
  );
};

export default RegisterPage;
