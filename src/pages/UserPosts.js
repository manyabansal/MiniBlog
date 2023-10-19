import React,  {useEffect, useState} from 'react';
import { useParams } from 'react-router';
import "bootstrap/dist/css/bootstrap.css";
import UserPost from '../components/user-post';
import './css/user-posts.css'
function UserPosts(){
    const {id} = useParams();
    const [posts, setPosts]=useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [author, setAuthor]= useState({});
  useEffect(() => {
   
    fetch(`http://127.0.0.1:8000/posts/${id}`, {
      credentials: "include",
    }).then((res) => {
      res.json().then((posts) => {
      setPosts(posts);
      });
    });

    fetch("http://127.0.0.1:8000/profile", {
      credentials: "include",
    }).then((res) => {
      res.json().then((userInfo) => {
      setUserInfo(userInfo);
     console.log(userInfo.username)
      });
    })

    fetch(`http://localhost:8000/user/${id}`).then(response =>{
      response.json().then(authorInfo=>{
        setAuthor(authorInfo);
      //  console.log(authorInfo.username)
      })
    });
  }, []);

    return (
   <div className='container'>
     <div>
      <h1 className='heading'>{id===userInfo.id? 'My Posts' : `Posts by ${author.username}`}</h1>
      <hr></hr>
     </div>
     {posts.map((post, index)=>{
        return(
          <>
         <UserPost key={index} post={post} />
         </>
        );
     })}
   </div>
    );
}

export default UserPosts;