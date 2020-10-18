import React, { useState, useRef } from "react";
//import './register.css';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import AuthService from "../../services/auth.service";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const validEmail = (value) => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};

const vname = (value) => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
}

const vpassword = (value) => {
    if (value.length < 6 || value.length >20) {
      return (
        <div className="alert alert-danger" role="alert">
          The password must be between 6 and 20 characters.
        </div>
      );
    }
};

const Register = (props) => {
    const form = useRef();
    const checkBtn = useRef();

    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangeFirstname = (e) => {
        const firstname = e.target.value;
        setFirstname(firstname);
    };

    const onChangeLastname = (e) => {
        const lastname = e.target.value;
        setLastname(lastname);
    };

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const onChangeConfirm = (e) => {
        const confirm = e.target.value;
        setConfirm(confirm);
    };
    const resetInputField = () => {
        setConfirm("");
        setPassword("");
        setEmail("");
        setLastname("");
        setUsername("");
        setFirstname('')
      }
    const submit = e => {
        e.preventDefault();

        setMessage("");
        setSuccessful(false);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            AuthService.register(username, firstname, lastname, email, password, confirm).then(
                (response) => {
                    setMessage(response.data.message);
                    setSuccessful(true);
                    resetInputField();
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setMessage(resMessage);
                    setSuccessful(false);
                }
            );
        }
    }

    return (
        <section id="cover" className="min-vh-100">
            <div id="cover-caption">
                <div className="container">
                    <div className="row text-white">
                        <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto text-center form p-4">
                            <h1 className="display-4 py-2 text-truncate">Hypertube</h1>
                            <div className="px-2">
                                <Form onSubmit={submit} className="justify-content-center" ref={form}>
                                    <div className="form-group">
                                        <label className="sr-only">UserName</label>
                                        <Input type="text" name="username" value={username}
                                            onChange={onChangeUsername} validations={[required, vname]} placeholder="UserName" />
                                    </div>
                                    <div className="form-group">
                                        <label className="sr-only">FirstName</label>
                                        <Input type="text" name="firstname" value={firstname}
                                            onChange={onChangeFirstname} validations={[required, vname]} placeholder="FirstName" />
                                    </div>
                                    <div className="form-group">
                                        <label className="sr-only">LastName</label>
                                        <Input type="text" name="lastname" value={lastname}
                                            onChange={onChangeLastname} validations={[required, vname]} placeholder="LastName" />
                                    </div>
                                    <div className="form-group">
                                        <label className="sr-only">Email</label>
                                        <Input type="text" name="email" value={email}
                                            onChange={onChangeEmail} validations={[required, validEmail]} placeholder="email" />
                                    </div>
                                    <div className="form-group">
                                        <label className="sr-only">Password</label>
                                        <Input type="password" value={password}
                                            onChange={onChangePassword} validations={[required,vpassword]}
                                            placeholder="Password" />
                                    </div>
                                    <div className="form-group">
                                        <label className="sr-only">Confirm</label>
                                        <Input type="password" name="confirm" value={confirm}
                                            onChange={onChangeConfirm} validations={[required,vpassword]}
                                            placeholder="Confirm" />
                                    </div>
                                    <button type="submit" className="btn btn-light">sign_up</button>

                                    {message && (
                                        <div className="form-group">
                                            <div
                                                className={successful ? "alert alert-success" : "alert alert-danger"}
                                                role="alert"
                                            >
                                                {message}
                                            </div>
                                        </div>
                                    )}
                                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}

export default Register;