import React from "react";
import MasonryPost from "./masonry-post.js";
import "./css/post-masonry.css";

export default function PostMasonry({ posts, columns, tagsOnTop }) {
  // console.log(posts);
  return (
    <section
      className="masonry"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(27px,1fr))` }}
    >
      {posts.map((post, index) => {
        return <MasonryPost {...{ post, index, tagsOnTop, key: index }} />;
      })}
    </section>
  );
}
