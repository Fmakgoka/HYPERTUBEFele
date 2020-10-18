import React, { useState, useRef } from 'react';
//import './forgotpassword.css';
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


const Forgotpassword = (props) =>{
    const form = useRef();
    const checkBtn = useRef();

    const [email, setEmail] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const resetInputField = () => {
        setEmail("");
    }

    const submit = e => {
        e.preventDefault();

        setMessage("");
        setSuccessful(false); 

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            AuthService.forgotpassword(email).then(
                (response) => {
                    props.history.push("/login");
                    window.location.reload();
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
                            <p>Please enter youremail address</p>
                            <div className="px-2">
                                <Form onSubmit={submit} className="justify-content-center" ref={form}>
                                    <div className="form-group">
                                        <label className="sr-only">Email</label>
                                        <Input type="text" name="email" value={email}
                                        onChange={onChangeEmail} validations={[required, validEmail]} placeholder="email" />
                                    </div>
                                    <button type="submit" className="btn btn-light">forgotpassword</button>
                                    <div className="form-group">
                                        <p>DO YOU HAVE ACC?
                                        <button type="button" className="btn btn-light"><a href='http://localhost:3000/register'>sign_up</a></button>
                                        </p>
                                    </div>

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

    )
}

export default Forgotpassword;