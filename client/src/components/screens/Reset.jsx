import { React, useState } from "react";
import { useHistory } from "react-router-dom";
import  M from 'materialize-css';

const Reset = () => {

  const [email, setEmail] = useState("");
  const history = useHistory()

  const postData = () => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html: "email invalido", classes:"#c62828 red darken-3"})
      return 
    }
    fetch("/reset-password",
      {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          email
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
          <input type="text" placeholder="email" 
            value={ email }
            onChange={evt => setEmail(evt.target.value )}/>
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

export default Reset;