import React, { useState } from "react";
import UserPost from "../components/user-post";
import "bootstrap/dist/css/bootstrap.css";
import "./css/search.css";

function Search() {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [isRender, setIsRender] = useState(false);

  async function searchPost(ev) {
    ev.preventDefault();
    try {
      await fetch(
        `http://127.0.0.1:8000/posts?search=${encodeURIComponent(search)}`
      ).then(async (res) => {
        await res.json().then((posts) => {
          setPosts(posts);
          setIsRender(true);
        });
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <>
      <div className="search-container input-group rounded">
        <div className="search-component ">
          <form className=" d-flex" onSubmit={searchPost}>
            <input
              type="search"
              name="search"
              className="form-control rounded "
              placeholder="Search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search"
              aria-describedby="search-addon"
            />
            <span className="input-group-text border-0" id="search-addon">
              <button className="btn btn-dark">
                <i className="fas fa-search"></i>
              </button>
            </span>
          </form>
        </div>
        {/* <div className="search-hint">
        Search by tags: Add a '#' symbol before the tag you want to search for. e.g #example
      </div> */}
      </div>
    
      <div
        className={`search-posts none-found ${
          (!isRender && "d-none") || (isRender && posts.length > 0 && "d-none")
        }`}
      >
        <h2>No results found</h2>
      </div>
      <div
        className={`${isRender && posts.length === 0 && "d-none"} search-posts`}
      >
        {posts.map((post, index) => {
          return <UserPost post={post} key={index} />;
        })}
      </div>
    </>
  );
}

export default Search;
