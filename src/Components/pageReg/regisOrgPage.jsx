import { Container, Card } from "react-bootstrap";
import FormRegisterOrg from "../register/registerOrg";
import "./Form.css";

const RegisterOrgPage = () => {
  return (
    <Container className="mt-5">
      <div className="text-center mb-3">
        <h1 className="mt-1 pb-1 fw-bold">Sign Up</h1>
      </div>
      <Card className="form-card">
        <FormRegisterOrg />
      </Card>
    </Container>
  );
};

export default RegisterOrgPage;
