import { React, useState, useContext } from "react";
import { UserContext } from '../../App'
import { Link, useHistory } from "react-router-dom";
import  M from 'materialize-css';

const Login = () => {

  const { state, dispatch } = useContext(UserContext)
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const history = useHistory()

  const postData = () => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html: "email invalido", classes:"#c62828 red darken-3"})
      return 
    }
    fetch("/signin",
      {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          password,
          email
        })
      }
    ).then(res => res.json())
    .then(data => {
      if(data.error){
        M.toast({html: data.error, classes:"#c62828 red darken-3"})
      } else {
        console.log(data.user)
        localStorage.setItem("jwt", data.token)
        localStorage.setItem("user", JSON.stringify(data))
        dispatch({type: "USER", payload:data})
        M.toast({html: "Sesión iniciada", classes: "#388e3c green darken-2"});
        history.push("/")
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
          <input type="password" placeholder="password" 
            value={ password }
            onChange={evt => setPassword(evt.target.value )}/>
          <a className="waves-effect waves-light btn #2196f3 blue"
          onClick={() => postData()}>
            Iniciar Sesión
          </a>
          <div className="endtext">
          <p className="left-align endtext">
              <Link to="/signup">Aún no tienes cuenta? Registrate</Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
