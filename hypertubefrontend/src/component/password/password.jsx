import React, { useState, useRef } from 'react';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { useHistory } from 'react-router-dom';
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

const vpassword = (value) => {
    if (value.length < 6 || value.length >20) {
      return (
        <div className="alert alert-danger" role="alert">
          The password must be between 6 and 20 characters.
        </div>
      );
    }
};


function Resetpassword(props) {
    const form = useRef();
    const checkBtn = useRef();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const onChangeConfirm = (e) => {
        const confirm = e.target.value;
        setConfirm(confirm);
    };
    const resetInputField = () => {
        setConfirm("")
      }

    const history = useHistory();
    const submit = e => {
        e.preventDefault()

        setMessage("");
        setLoading(true);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            AuthService.password(password, confirm).then(
                () => {
                    props.history.push("/login");
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
        
    }

    return (
       
        <section id="cover" className="min-vh-100">
            <div id="cover-caption">
                <div className="container">
                    <div className="row text-white">
                        <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto text-center form p-4">
                            <h1 className="display-4 py-2 text-truncate">Hypertube</h1>
                            <p>you can change password</p>
                            <div className="px-2">
                                <Form onSubmit={submit} className="justify-content-center" ref={form}>
                                    <div className="form-group">
                                        <label className="sr-only">Password</label>
                                        <Input 
                                            type="password" 
                                            name="password"
                                            value={password}
                                            onChange={onChangePassword} 
                                            validations={[required,vpassword]}
                                            placeholder="Password" />
                                    </div>
                                    <div className="form-group">
                                        <label className="sr-only">Confirm</label>
                                        <Input 
                                            type="password" 
                                            name="confirm" 
                                            value={confirm}
                                            onChange={onChangeConfirm} 
                                            placeholder="confirm" 
                                            validations={[required,vpassword]} />

                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-primary btn-block" disabled={loading}>
                                            {loading && (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            )}
                                            <span>change</span>
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

                                </Form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}

export default Resetpassword;