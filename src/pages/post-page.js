import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import {Link} from "react-router-dom"
import { UserContext } from "../user-context";
import { Navigate } from "react-router";
import "bootstrap/dist/css/bootstrap.css";
import "./css/post-page.css";
import TagRow from "../components/tag-row";

export default function PostPage() {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);
  const {userInfo}= useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  const [heartClass, setHeartClass] = useState("fa-regular");
  const [isLiked, setIsLiked]= useState(false);

  const [user, setUser]= useState({});
  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await fetch(`/api/profile`, {
          method: 'GET',
          credentials: "include",
        });
        const userData = await userResponse.json();
        setUser(userData);
        
        const postResponse = await fetch(`/api/post/${id}`);
        const postInfoData = await postResponse.json();
        setPostInfo(postInfoData);
       
      } catch (error) {
        console.error(error);
      }
    }
  
    fetchData();
  }, []);

  useEffect(()=>{
    if (postInfo && user) {
    const isUserLiked = postInfo.likes.includes(user.id);
    console.log(isUserLiked);
    setIsLiked(isUserLiked);
    setHeartClass(`${isUserLiked}? fa-solid: fa-regular`);
    }
  }, [postInfo, user]);
  

  async function deletePost(){
    const response = await fetch(`/api/post/${id}`,{
      method: "DELETE"
    }).catch(err=>console.log(err));

    if(response.ok){
      setRedirect(true);
    }
  }
  
  async function setLike(){
    try{
      if(isLiked){
        await fetch(`/api/post/${id}?set=removeLike`,{
          method: "PATCH",
          credentials: "include",
        }).catch(err=>console.log(err));
        setHeartClass('fa-regular');
      }
      else{
        await fetch(`/api/post/${id}?set=addLike`,{
          method: "PATCH",
          credentials: "include",
        }).catch(err=>console.log(err));
        setHeartClass('fa-solid');
      }
    } catch(err){
      console.log(err);
    }
    
  }

  if(redirect){
    return <Navigate to={`/posts/${userInfo.id}`} />
  }

  if (!postInfo) return "";
  return (
    <div className="post-page">
      <div className="post-page-image">
        <img
          src={`${require(`../../rest/uploads/${postInfo.image.slice(8)}`)}`}
        />
      </div>
      <h1>{postInfo.title}</h1>
      <p className="author-text">
        <span className="post-date">{postInfo.date}</span>
        <span className="post-author">
          By: @
          <a href={`/posts/${postInfo.author._id}`}>
            {postInfo.author.username}
          </a>
        </span>
      </p>
      <span className="tags">
        <TagRow tags={postInfo.categories} />
      </span>
      <span className="like d-flex justify-content-center"
      onMouseEnter={()=>setHeartClass("fa-solid")}
      onMouseLeave={()=>{!isLiked && setHeartClass("fa-regular")}}
      onClick={()=>{
        setIsLiked(!isLiked);
        setLike();
    }}>
      <i class={`${heartClass} fa-heart`} />
      <p>Like</p>
      </span>
      <div
        className=" post-content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
      <div className={`buttons  ${userInfo.id!==postInfo.author._id && "d-none"}`}>
       <Link to={`/edit/${id}`}> <button className="edit btn btn-dark">Edit</button></Link>
        <button className=" btn btn-dark" onClick={deletePost}>Delete</button>
      </div>
    </div>
  );
}
