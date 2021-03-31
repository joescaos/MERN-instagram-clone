import { React, useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom'
import { UserContext } from '../../App'
import M from "materialize-css";

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext)

  useEffect(() => {
    fetch("/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        setData(result.posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unLikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter(item => {
          return item._id != result._id
        })
        setData(newData)
      });
  };

  const deleteComment = (postid, commentid) => {
    fetch(`/deletecomment/${postid}/${commentid}`, {
      method: 'delete',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    }).then(res => res.json())
    .then(result => {
      const newData = data.map(item => {
        if(item._id == result._id){
          return result
        } else{
          return item
        }
      })
      setData(newData)
      M.toast({
        html: "Comment deleted successfully",
        classes: "#43a047 green darken-1",
      });
    })
  }
  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5>
              <Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id: "/profile"}>{item.postedBy.name}</Link> <i className="material-icons" style={{float: 'right'}}
                onClick={() => deletePost(item._id)}>delete</i>
            </h5>
            <div className="card-image">
              <img src={item.photo} alt="" />
            </div>
            <div className="card-content">
              <i className="material-icons" style={{color: 'red'}}>favorite</i>
              <i
                className="material-icons"
                onClick={() => {
                  likePost(item._id);
                }}
              >
                thumb_up
              </i>
              <i
                className="material-icons"
                onClick={() => {
                  unLikePost(item._id);
                }}
              >
                thumb_down
              </i>
              <h6>{item.likes.length} Me gusta</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  <h6>
                    <span style={{ fontWeight: "500" }}>
                      {record.postedBy.name}
                    </span>{" "}
                    {record.text}
                    {record.postedBy._id === state._id && (
                      <i className="material-icons" style={{float: 'right'}}
                      onClick={() => deleteComment(item._id, record._id)}>delete</i>
                    )}
                  </h6>
                );
              })}
              <form
                action=""
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type="text" name="" placeholder="Añadir comentario" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
