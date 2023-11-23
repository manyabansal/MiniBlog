import React, { useMemo } from "react";
import { Pagination } from "antd";
import TagRow from "./tag-row";
import { Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.css";
import "./css/post-grid.css";

export default function PostGrid({
  posts,
  current,
  setCurrent,
  setPaginationChanged,
}) {
  const onChange = (page) => {
    setCurrent(page);  
    setPaginationChanged(true);
    
  };

  const pageSize = 10;
  const paginatedPosts = useMemo(() => {
    const lastIndex = current * pageSize;
    const firstIndex = lastIndex - pageSize;
   
    return posts.slice(firstIndex, lastIndex);
  }, [current]);
  async function addClick(post) {
    await fetch(`/api/post/${post._id}?set=click`, {
      method: "PATCH",
      credentials: "include",
    });
  }
  return (
    <section className="pagination-container">
      <section className="post-grid container">
        {paginatedPosts.map((post, index) => {
         
          return (
            <div key={index} className="post-container">
              <a href={`/post/${post._id}`}  onClick={()=>addClick(post)}>
              <figure className="post-image">
                
                 
                  <img
                    src={require(`../../../rest/uploads/${post.image.slice(8)}`)}
                    alt={post.image}
                  />
                 
              
              </figure>
              </a>
              <TagRow tags={post.categories} />
              <h2>{post.title}</h2>
              <p className="author-text">
                <span>
                  By:
                  <a href={`/posts/${post.author._id}`}>{post.author.username}</a>
                </span>
                <span className="post-date">- {post.date}</span>
              </p>
            </div>
          );
        })}
      </section>
      <Pagination
        className="paginationItem"
        defaultCurrent={current}
        onChange={onChange}
        total={posts.length}
      />
    </section>
  );
}
