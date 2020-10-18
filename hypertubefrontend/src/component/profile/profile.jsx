import React, { useState } from 'react';
import './profile.css';
import { Input } from 'reactstrap'
import { useHistory } from 'react-router-dom';
import AuthService from "../../services/auth.service";
// import ImageContainer from './imageContainer'

function Editprofile() {

    const currentUser = AuthService.getCurrentUser();
    console.log(currentUser);
    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        oldpassword: "",
        newpassword: "",
        confirm: "",
    })

    const [newImage, setNewImage] = useState()
    
    const history = useHistory();

    const uploadImage = (e)  => {
        e.preventDefault()
        AuthService.upload(newImage);
        console.log(newImage)
    }
    const upload = e =>{
        console.log(e.target.name)
        // console.log(e.target.file)
        setNewImage(e.target.files[0]);
        // AuthService.upload(newImage)
    }
    const submit = e => {
        e.preventDefault()
        console.log(currentUser)

        fetch('http://localhost:9000/profile', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'content-Type': 'application/json',
                'x-access-token': `${currentUser.accessToken}`
            }
        })
            .then(res => {
                console.log(`req successful ${res.status}`);
                if (res.status === 401)
                    history.push('/profile')
                else if (res.status === 200)
                    history.push('/homepage')

            })
            .catch(error => console.log(error))
    }

    const handleChange = (e) => {
        e.persist();
        // debugger
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        })
    }
    const profileImage = `http://localhost:9000/images/${currentUser.Image}`
    const defaultImage = "http://ssl.gstatic.com/accounts/ui/avatar_2x.png"
    return (
        <div className="container rounded bg-white mt-5 mb-5">
            {/* <Header/> */}
            <div className="row">
                <div className="col-md-3 border-right">
                    <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                        
                        <form onSubmit={uploadImage}/*  encType="multipart/form-data" */>
                        <img src={currentUser.Image ? profileImage : defaultImage} height="150px" width="150px" className="avatar img-circle img-thumbnail" alt="avatar" />
                            <h6>Upload a different photo...</h6>
                            <input name="image" type="file" onChange={upload} className="text-center center-block file-upload" />
                            <button className="btn btn-primary profile-button" type="submit">update image</button>
                        </form>
                        {/* <img src={ProfileImage} width="200px" height="300px"/> */}
                        <p>
                            firstname:{currentUser.firstname}
                        </p>
                        <p>
                            lastname: {currentUser.lastname}

                        </p>

                        <p>
                            username: {currentUser.username}
                        </p>
                        
                    </div>
                </div>
                <div className="col-md-5 border-right">
                    <form onSubmit={submit} >
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile Settings</h4>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label className="labels">firstname</label>
                                    <Input type="text" name="firstname" value={user.firstname}
                                        onChange={handleChange} placeholder="firstName" />
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Lastname</label>
                                    <Input type="text" name="lastname" value={user.lastname}
                                        onChange={handleChange} placeholder="LastName" />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <label className="labels">UserName</label>
                                    <Input type="text" name="username" value={user.username}
                                        onChange={handleChange} placeholder="username" />
                                </div>
                                <div className="col-md-12">
                                    <label className="labels">Email</label>
                                    <Input type="text" name="email" value={user.email}
                                        onChange={handleChange} placeholder="email" />
                                </div>
                                <div className="col-md-12">
                                    <label className="labels">Changepassword</label>
                                    <Input type="password" name="oldpassword" value={user.oldpassword}
                                        onChange={handleChange} placeholder="Oldpassword" />
                                    <Input type="password" name="newpassword" value={user.newpassword}
                                        onChange={handleChange} placeholder="NewPassword" />
                                    <Input type="password" name="confirm" value={user.confirm}
                                        onChange={handleChange} placeholder="ConfirmNewPassword" />
                                </div>
                            </div>
                            {/* <div className="row mt-3">
                                <div className="col-md-12">
                                    <imageContainer newImage={newImage} />
                                    <imageContainer handleNewImage={handleNewImage} />

                                </div>
                            </div> */}
                            <div className="mt-5 text-center">
                                <button className="btn btn-primary profile-button" type="submit">update Profile</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )

}

export default Editprofile;