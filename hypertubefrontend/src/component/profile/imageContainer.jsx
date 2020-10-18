import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:9000/";

const ImageContainer = ({newImage})=>{
    const [image, setImage] = useState([]);
    const [fallback, setFallback] = useState('');

    const getImage = async()=>{
        try {
            const res = await axios.get(API_URL+'profile');
            if(!res.data.files){
                setFallback(res.data.msg);
                return
            }else{
                setImage(res.data.files)
            }
            
        } catch (error){
            console.log(error.message)
        }
    }
    useEffect(
        ()=>{
            getImage();
        },[newImage])

    const configureImage = image=>{
        return API_URL + image;
    }
    console.log(image);

    return(
        <div>
            {image.length >0?
            (
                image.map(image => (
                    <img src={configureImage(image)} key={image} alt={image} width="200"
                    height="200" className="image"/>
                ))
            )
            :
            <>
                <h1>
                    {fallback}
                </h1>
                <hr/>
                <h3>upload image in the front</h3>
            </>
            }
        </div>
    )
}

export default ImageContainer;