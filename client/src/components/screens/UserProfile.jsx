import { React, useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";

const Profile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [ showfollow, setShowFollow] = useState(state?!state.following.includes(userid):true)

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        setProfile(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({type:"UPDATE", payload:{following:data.following, followers: data.followers}})
        localStorage.setItem("user", JSON.stringify(data))
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id]
            }
          }
        })
        setShowFollow(false)
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({type:"UPDATE", payload:{following:data.following, followers: data.followers}})
        localStorage.setItem("user", JSON.stringify(data))
        setProfile((prevState) => {
          const newFollowers = prevState.user.followers.filter(item => item != data._id)
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollowers
            }
          }
        })
        setShowFollow(true)
      });
  };

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "80%", margin: "10px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid lightgrey",
            }}
          >
            <div>
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={userProfile.user.pic}
                alt=""
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{userProfile.posts.length} posts</h6>
                <h6>{state?userProfile.user.followers.length:"0"} followers</h6>
                <h6>{state?userProfile.user.following.length:"0"} following</h6>
              </div>
              {
                showfollow?<a
                className="waves-effect waves-light btn #2196f3 blue follow-unfollow"
                onClick={() => followUser()}
              >
                Seguir
              </a>:
              <a
              className="waves-effect waves-light btn #d50000 red accent-4 follow-unfollow"
              style={{float: "right"}}
              onClick={() => unfollowUser()}
            >
              Dejar de seguir
            </a>
              }
              
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  className="item"
                  src={item.photo}
                  alt={item.title}
                  key={item._id}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>Cargando Perfil ...!</h2>
      )}
    </>
  );
};

export default Profile;
