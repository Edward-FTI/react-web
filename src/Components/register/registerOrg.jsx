import { Button, Alert, Form } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InputFloatingForm from "./InputFloatingForm";
import { SignUpO } from "../../Api/apiAuth";

const FormRegisterOrg = () => {
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState({
    nama: "",
    alamat: "",
    email: "",
    no_hp: "",
    password: "",
  });

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleCheck = (e) => {
    let isChecked = e.target.checked;
    setIsDisabled(!isChecked);
  };

  const RegisterOrg = (event) => {
    event.preventDefault();
    SignUpO(data)
      .then((res) => {
        navigate("/");
        toast.success(res.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  return (
    <Form
      style={{ maxWidth: "600px", margin: "auto" }}
      onSubmit={RegisterOrg}
      className="p-4 rounded formContainer"
    >
      <Alert variant="primary" className="mb-4 alertColor text-center">
        <strong>Info!</strong> Semua form wajib diisi.
      </Alert>

      <div className="d-flex flex-column gap-3">
        <InputFloatingForm
          type="text"
          name="nama"
          onChange={handleChange}
          placeholder="Masukkan Nama"
          label="Nama Organisasi"
        />
        <InputFloatingForm
          type="text"
          name="alamat"
          onChange={handleChange}
          placeholder="Masukkan Alamat"
          label="Alamat"
        />
        <InputFloatingForm
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Masukkan Email"
          label="Email"
        />
        <InputFloatingForm
          type="text"
          name="no_hp"
          onChange={handleChange}
          placeholder="Masukkan No HP"
          label="No HP"
        />
        <InputFloatingForm
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Masukkan Password"
          autoComplete="off"
          label="Password"
        />
      </div>

      <label className="d-flex justify-content-start align-items-center mt-4">
        <Form.Check type="checkbox" onChange={handleCheck} />
        <p className="ms-2 mb-0">
          Have you Already Read the{" "}
          <a href="https://policies.google.com/terms?hl=en-US">
            Terms of Service
          </a>
        </p>
      </label>

      <Button
        disabled={isDisabled}
        type="submit"
        className="mt-3 w-100 border-0 buttonSubmit btn-lg"
      >
        Register
      </Button>

      <p className="text-end mt-2">
        Personal Account? <Link to="/register">Click Here!</Link>
      </p>

      <p className="text-end mt-2">
        Already Have an Account? <Link to="/Login">Click Here!</Link>
      </p>
    </Form>
  );
};

export default FormRegisterOrg;
