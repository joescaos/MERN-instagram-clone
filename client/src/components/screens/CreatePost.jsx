import { React, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import  M from 'materialize-css';

const CreatePost = () => {
  const [ title, setTitle ] = useState("")
  const [ body, setBody ] = useState("")
  const [ image, setImage ] = useState("")
  const [ url, setUrl ] = useState("")
   const history = useHistory()

  useEffect(() => {
    if(url){
      fetch("/createpost", {
  
        method: 'post',
        headers: {
          'content-type': 'application/json',
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          title,
          body,
          pic: url
        })
      }
    )
    .then(res => res.json())
    .then(data => {
      if(data.error){
        M.toast({html: data.error, classes:"#c62828 red darken-3"})
      } else {
        M.toast({html: "Post creado", classes: "#388e3c green darken-2"});
        history.push("/")
      }
    }).catch( err => {
      console.log(err)
    })
    }
  }, [url])

  const postDetails = () => {
    const data = new FormData()
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "dzglj31s2");
    fetch("	https://api.cloudinary.com/v1_1/dzglj31s2/image/upload", {
      method: 'post',
      body: data
    })
    .then(res => res.json())
    .then(data => {
      setUrl(data.url)
    })
    .catch(err => console.log(err))
  }

  return (
    <div className="card input-field create-post">
      <input type="text" 
        placeholder="Titulo" 
        value={ title }
        onChange={evt => setTitle(evt.target.value)}/>
      <input type="text" placeholder="Contenido" 
         value={ body }
         onChange={evt => setBody(evt.target.value)}/>
      <div className="file-field input-field">
        <div className="btn">
          <span>Cargar imagen</span>
          <input type="file" onChange={(evt) => setImage(evt.target.files[0])}/>
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <a className="waves-effect waves-light btn #2196f3 blue"
        onClick={() => postDetails()}>
        Crear Post
      </a>
    </div>
  );
};

export default CreatePost;
