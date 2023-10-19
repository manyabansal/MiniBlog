import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./css/home.css";
import PostMasonry from "../components/post-masonry";
import MasonryPost from "../components/masonry-post";
import PostGrid from "../components/post-grid";

const trendingConfig = {
  1: {
    gridArea: "1/2/3/3",
  },
};

const featuredConfig = {
  0: {
    gridArea: "1/1/2/3",
    height: "300px",
    width: "100%",
  },
  1: {
    height: "300px",
    width: "100%",
  },
  3: {
    height: "630px",
    marginLeft: "30px",
    width: "630px",
  },
};

const mergeStyles = function (posts, config) {
  posts.forEach((post, index) => {
    post.style = config[index];
  });
};

function Home() {
  const [current, setCurrent] = useState(1);
  const recentPostsRef = useRef(null);
  const [paginationChanged, setPaginationChanged] = useState(false);
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [lastPost, setLastPost] = useState(null);
  const [recentPosts, setRecent] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/post")
      .then(async (response) => {
        await response.json().then((posts) => {
          setTrending(posts.trending);
          setFeatured(posts.featured);
          setRecent(posts.recent);
        });
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (featured.length > 0) {
      setLastPost(featured.pop());
    }
  }, [featured]);

  useEffect(() => {
    if (paginationChanged) {
      recentPostsRef?.current.scrollIntoView({ behavior: "smooth" });
      return () => {
        setPaginationChanged(false);
      };
    }
  }, [paginationChanged]);

  mergeStyles(trending, trendingConfig);
  mergeStyles(featured, featuredConfig);

  if (trending.length > 0 && featured.length > 0 && lastPost) {
    return (
      <main className="home">
        <section className="container">
          <div className="row">
            <h1>Featured Posts</h1>
            <section className="featured-posts-container">
              <PostMasonry posts={featured} columns={2} tagsOnTop={true} />
              <MasonryPost
                post={lastPost}
                tagsOnTop={true}
                styles={{ marginTop: "40px" }}
              />
            </section>

            <section className="container">
              <div className="row" ref={recentPostsRef}>
                <h1>Recent Posts</h1>
                <PostGrid
                  posts={recentPosts}
                  current={current}
                  setCurrent={setCurrent}
                  setPaginationChanged={setPaginationChanged}
                />
              </div>
            </section>
            <h1>Trending Posts</h1>
            <PostMasonry posts={trending} columns={3} />
          </div>
        </section>
      </main>
    );
  }
}

export default Home;
