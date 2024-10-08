import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Card, CardBody, Form, Row, Spinner } from "reactstrap";
import Input from "../../components/Input";
import { EyeIcon, EyeOffIcon } from "../../components/Icons";
import useAuth from "../../hooks/useAuth";
import signUpInputs from "../../constant/inputs/signUpInputs";
import logo from "../../assets/logo.svg";

const SignUp = () => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isVisible, setVisible] = useState(false);
  const [isConformVisible, setIsConformVisible] = useState(false);

  const { useSignUp, loading } = useAuth();

  const { userData, isLogin } = useSelector((state) => state?.auth);

  const confirmPwd = document.getElementsByName("confirm_password");

  const handleOnChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });

    if (!e.target.value?.trim()) {
      setErrors({ ...errors, [e.target.name]: true });
    } else {
      setErrors({ ...errors, [e.target.name]: false });
    }

    // CONFIRM PASSWORD VALIDATION
    if (e.target.name === "confirm_password") {
      if (e.target.value !== values.password) {
        confirmPwd[0].setCustomValidity("Password Must be Matching.");
      } else {
        confirmPwd[0].setCustomValidity("");
      }
    }
    if (e.target.name === "password") {
      if (e.target.value !== values.confirm_password) {
        confirmPwd[0].setCustomValidity("Password Must be Matching.");
      } else {
        confirmPwd[0].setCustomValidity("");
      }
    }
  };

  const handleVisible = (inputName) => {
    if (inputName === "password") {
      setVisible((prev) => !prev);
    } else {
      setIsConformVisible((prev) => !prev);
    }
  };

  const getInputType = (inputName, isVisible, isConformVisible) => {
    switch (inputName) {
      case "password":
        return isVisible ? "text" : "password";
      case "confirm_password":
        return isConformVisible ? "text" : "password";
      default:
        return null;
    }
  };

  const getIcon = (inputName, isVisible, isConformVisible, handleVisible) => {
    switch (inputName) {
      case "password":
        return isVisible ? (
          <EyeIcon fill="#afb4b9" onClick={() => handleVisible(inputName)} />
        ) : (
          <EyeOffIcon fill="#afb4b9" onClick={() => handleVisible(inputName)} />
        );
      case "confirm_password":
        return isConformVisible ? (
          <EyeIcon fill="#afb4b9" onClick={() => handleVisible(inputName)} />
        ) : (
          <EyeOffIcon fill="#afb4b9" onClick={() => handleVisible(inputName)} />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {};
    let error = {};
    let formData = new FormData(e.target);

    formData.forEach((value, key) => {
      data[key] = value;
      if (!value?.trim()) {
        error[key] = true;
      }
    });

    setErrors(error);

    //SUBMIT THE FORM BY USING 'DATA'
    if (!Object.values(error).includes(true)) {
      await useSignUp(data);
    }
  };

  return (
    <Card>
      <CardBody>
        <Row className="logo-row">
          <span className="app-brand-text">
            <img src={logo} width="45px" /> xpensr
          </span>
        </Row>
        <h4 className="mb-2">Adventure starts here 🚀</h4>
        <p className="mb-4">Join us and embark on an exciting journey!</p>
        <Form className="mb-3 d-flex flex-column gap-3" onSubmit={handleSubmit}>
          {signUpInputs?.map((input) => {
            return (
              <Input
                {...input}
                key={input?.id}
                value={values[input?.name] || ""}
                errors={errors[input?.name] || ""}
                onChange={handleOnChange}
                type={getInputType(input?.name, isVisible, isConformVisible)}
                icon={getIcon(
                  input?.name,
                  isVisible,
                  isConformVisible,
                  handleVisible
                )}
              />
            );
          })}
          <Button
            color="primary"
            className={loading ? "btn-disabled w-100" : "w-100"}
            type="submit"
          >
            {loading ? <Spinner size="sm" /> : "Sign up"}
          </Button>
        </Form>
        <p className="text-center">
          <span className="me-1">Already have an account?</span>
          <Link to="/login" replace>
            Sign in instead
          </Link>
        </p>
      </CardBody>
    </Card>
  );
};

export default SignUp;
