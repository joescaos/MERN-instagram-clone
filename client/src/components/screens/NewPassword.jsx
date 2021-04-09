import { React, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import  M from 'materialize-css';

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const history = useHistory()
  const { token } = useParams()

  const postData = () => {
    fetch("/newpassword",
      {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          password,
          token
        })
      }
    ).then(res => res.json())
    .then(data => {
      if(data.error){
        M.toast({html: data.error, classes:"#c62828 red darken-3"})
      } else {
        M.toast({html: data.message, classes: "#388e3c green darken-2"});
        history.push("/login")
      }
    }).catch( err => {
      console.log(err)
    })

  }

  return (
    <div className="my-card login-card input-field">
      <div className="card">
        <h2>Instagram</h2>
        <div className="card-content white-text">
          <input type="password" placeholder="Nueva Contraseña" 
            value={ password }
            onChange={evt => setPassword(evt.target.value )}/>
          <a className="waves-effect waves-light btn #2196f3 blue"
          onClick={() => postData()}>
            Cambiar contraseña
          </a>
          <div className="endtext">
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;