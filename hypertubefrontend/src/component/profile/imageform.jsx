import React, { useState } from 'react';

import AuthService from "../../services/auth.service";

const ImageForm = ({ handleNewImage }) => {
    const [image, setImage] = useState('');
    const [preview, setPreview] = useState(false);

    const handleImageUpload = e => {
        setImage(e.target.files[0]);
        setPreview(true);
    }

    const clearImage = () => {
        setPreview(false);
        setImage('');
    }

    const handleSubmit = () => {
        AuthService.upload(image);
        setPreview(false);
        setImage(false);
        handleNewImage();
    }

    return (
        <div>
            {preview ?
                <>
                    <button onClick={clearImage}>x</button>
                    <h5>image preview</h5>
                    <img src={URL.createObjectURL(image)} alt="preview image" />
                    <button onClick={handleSubmit}>upload!</button>
                </> :
                <>
                    <input type="file" onClick={handleImageUpload} accept="png jpg jpeg"/>
                </>
            }
        </div>

    )
}

export default ImageForm;