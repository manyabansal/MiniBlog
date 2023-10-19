import React from "react";
import TagRow from "./tag-row";
import "./css/masonry-post.css";
export default function MasonryPost({ post, tagsOnTop, styles }) {
  const windowWidth = window.innerWidth;
  const imageBackground = {
    backgroundImage: post.image && `url("${require(`../../rest/uploads/${post.image.slice(
      8
    )}`)}")`,
  };

  const style =
    windowWidth > 900
      ? { ...imageBackground, ...post.style }
      : { ...imageBackground, ...styles };

  async function addClick() {
    await fetch(`https://miniblog-cxzz.onrender.com/post/${post._id}?set=click`, {
      method: "PATCH",
      credentials: "include",
    });
  }
  return (
    <a
      className="masonry-post overlay"
      style={style}
      onClick={addClick}
      href={`/post/${post._id}`}
    >
      <div className="image-text" style={{ justifyContent: "space-between" }}>
        <TagRow tags={post.categories} />
        <div>
          <h2 className="image-title">{post.title}</h2>
          <span className="image-date">{post.date}</span>
        </div>
      </div>
    </a>
  );
}
