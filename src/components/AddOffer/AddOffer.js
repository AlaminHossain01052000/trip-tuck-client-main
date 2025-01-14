import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import "./AddOffer.css";
import {  getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage()
const AddOffer = () => {
    
    const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
    const { register, handleSubmit, reset } = useForm();
    const handleImageChange = (event) => {
        setSelectedImage(event.target.files[0]);
      };
      const handleUpload = async () => {
        if (!selectedImage) {
          return; // Handle no image selected case
        }
    
        const imageRef = ref(storage, `images/${selectedImage.name}`);
    
        try {
          await uploadBytes(imageRef, selectedImage);
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
          return url
          
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      };
    const onSubmit = async data => {
        console.log(data)
        if(!selectedImage&&!data?.img){
          alert("Please upload an image first")
          return
        }
        if(selectedImage){
          const url=await handleUpload();
          console.log(url)
          if(!url){
            alert("There is an error while uploading the image. Please refresh the page and try again");
          }
          else{
            data.img=url
            fetch("http://localhost:5000/offers", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
                    alert("Data inserted successfully");
                    setSelectedImage(null)
                    reset();
                }



            })
          }

        }
        else{
         await  fetch("http://localhost:5000/offers", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
                    alert("Data inserted successfully");
                    reset();
                }



            })
        }
        
        
        
    };
    return (
        <div id="add-an-offer">
            <h1 className="heading-title">Add an new offer</h1>
            <hr className="heading-line mb-3" />
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("title")} placeholder="Title"required />
                <div style={{display:"flex",justifyContent:'center',alignItems:'center'}}>
                <input {...register("img")} placeholder="Image-Url" />
                <input style={{marginLeft:"10px "}}type="file" onChange={handleImageChange} title='Upload an image'/>
                </div>

                <input type="number" {...register("price")} placeholder="Price" required/>
                <input {...register("videoSource")} placeholder="Video-Url" />

                <textarea {...register("descriprion")}
                    placeholder="description" className="form-control" id="exampleFormControlTextarea1" rows="3" />
                <input type="submit" />
            </form>
        </div>
    );
};

export default AddOffer;