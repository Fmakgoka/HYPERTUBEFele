import React, { useState, useRef } from 'react';
//import './login.css';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

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

const Login = (props) => {
    const form = useRef();
    const checkBtn = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    //const history = useHistory();
    const submit = e => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        form.current.validateAll();


        if (checkBtn.current.context._errors.length === 0) {
            AuthService.login(username, password).then(
                () => {
                    props.history.push("/homepage");
                    window.location.reload();
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setLoading(false);
                    setMessage(resMessage);
                }
            );
        } else {
            setLoading(false);
        }
        
    };

    
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
                                        <Input type="text"
                                            name="username"
                                            value={username}
                                            onChange={onChangeUsername}
                                            placeholder="UserName"
                                            validations={[required]} />
                                    </div>
                                    <div className="form-group">
                                        <label className="sr-only">Password</label>
                                        <Input
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={onChangePassword}
                                            placeholder="Password" validations={[required]} />

                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-primary btn-block" disabled={loading}>
                                            {loading && (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            )}
                                            <span>Login</span>
                                        </button>
                                    </div>
                                    {message && (
                                        <div className="form-group">
                                            <div className="alert alert-danger" role="alert">
                                                {message}
                                            </div>
                                        </div>
                                    )}
                                    <CheckButton style={{ display: "none" }} ref={checkBtn} />

                                    {/* <button type="submit" className="btn btn-light">Sign_in</button>{' '}{' '} */}
                                    <a href='http://localhost:3000/forgotpassword'>Forgot Password?</a>
                                    <div className="form-group">
                                        <p>OR SIGN-IN WITH:
                                        <a href='http://localhost:9000/auth/github'>
                                                <i className="fa fa-github" aria-hidden="true" ></i>
                                            </a>
                                            <a href='http://localhost:9000/auth/intra'>
                                                <i className="fa fa-slack" aria-hidden="true"></i>
                                            </a></p>
                                    </div>
                                    <div className="form-group">
                                        <p>DO YOU HAVE ACC?
                                        <button type="button" className="btn btn-light"><a href='http://localhost:3000/register'>sign_up</a></button>
                                        </p>
                                    </div>

                                </Form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}

export default Login;
