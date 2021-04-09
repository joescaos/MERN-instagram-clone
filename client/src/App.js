import Navbar from "./components/Navbar";
import { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import { BrowserRouter, Route, useHistory, Switch } from "react-router-dom";
import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
import Profile from "./components/screens/Profile";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile"
import SubscribeUserPosts from "./components/screens/SubscribeUserPosts"
import Reset from './components/screens/Reset'
import { reducer, initialState } from "./reducers/userReducer";
import NewPassword from "./components/screens/NewPassword";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch} = useContext(UserContext)
  useEffect(()=> {
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type: "USER", payload: user})
      //history.push("/")
    } else {
      if(!history.location.pathname.startsWith('/reset'))
      history.push("/login")
    }
  }, [])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create-post">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingposts">
        <SubscribeUserPosts />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
    </Switch>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider  value={{state, dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
