import { React, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import  M from 'materialize-css';

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {});
  });

  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/profile">Perfil</Link>
        </li>,
        <li>
          <Link to="/create-post">Crear Post</Link>
        </li>,
        <li>
          <Link to="/myfollowingposts">Posts siguiendo</Link>
        </li>,
        <li>
          <a
            className="waves-effect waves-light btn #d50000 red accent-4"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/login");
            }}
          >
            Cerrar Sesión
          </a>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/login">Iniciar Sesión</Link>
        </li>,
        <li>
          <Link to="/signup">Registrarse</Link>
        </li>,
      ];
    }
  };
  return (
    <>
      <nav>
        <div className="nav-wrapper">
          <Link to={state ? "/" : "/login"} className="brand-logo">
            Instagram
          </Link>
          <a href="#" data-target="mobile-demo" class="sidenav-trigger">
            <i class="material-icons">menu</i>
          </a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
          </ul>
        </div>
      </nav>
      <ul className="sidenav" id="mobile-demo">
        {renderList()}
      </ul>
    </>
  );
};

export default Navbar;
