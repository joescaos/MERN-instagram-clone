import { React, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const history = useHistory();
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    if(url){
      uploadFields()
    }
  }, [url])

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "dzglj31s2");
    fetch("	https://api.cloudinary.com/v1_1/dzglj31s2/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  const uploadFields = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "email invalido", classes: "#c62828 red darken-3" });
      return;
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        pic:url
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({ html: data.message, classes: "#388e3c green darken-2" });
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const postData = () => {
   if(image){
     uploadPic()
   } else {
     uploadFields()
   }
  };

  return (
    <div className="my-card login-card input-field">
      <div className="card">
        <h2>Instagram</h2>
        <div className="card-content white-text">
          <input
            type="text"
            placeholder="Nombre usuario"
            value={name}
            onChange={(evt) => setName(evt.target.value)}
          />
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />
          <div className="file-field input-field">
            <div className="btn">
              <span>Subir foto</span>
              <input
                type="file"
                onChange={(evt) => setImage(evt.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <a
            className="waves-effect waves-light btn #2196f3 blue"
            onClick={() => postData()}
          >
            Registrarse
          </a>
          <div className="endtext">
            <p className="left-align endtext">
              <Link to="/login">Ya tienes cuenta? Inicia Sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;