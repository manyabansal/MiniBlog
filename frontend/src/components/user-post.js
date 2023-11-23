import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./css/user-post.css";
import { useNavigate } from "react-router";
import TagRow from "./tag-row";


export default function UserPost({ post}) {
  const navigate= useNavigate();

  const postPageRender = () => {

    navigate(`/post/${post._id}`);
  };

  async function AuthorPage(){
    navigate(`/posts/${post.author._id}`);
  }
  return (
    
    <div className="post-box">
      <div
        onClick={postPageRender}
        className={`post-image`}
      >
        <img
          src={`${require(`../../../rest/uploads/${post.image.slice(8)}`)}`}
          alt="Post Image"
        />
        
      </div>
      <div className={`post-text`}>
        <div>
          <h2 onClick={postPageRender}>{post.title}</h2>
          <span className="author-text" onClick={AuthorPage}>{post.author.username}</span>
          <span>{post.date}</span>
          <span className="post-tags"><TagRow tags={post.categories}/></span>
        </div>
         
        <p>{post.summary}</p>
      </div>
    </div>
  );
}
