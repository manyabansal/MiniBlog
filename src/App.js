import React from "react";
import Navigation from "./components/navigation";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import PageRenderer from "./page-renderer";
import PostPage from "./pages/post-page.js"
import UserPosts from "./pages/UserPosts";
import EditPost from "./pages/edit-post.js"
import Home from "./pages/home";
import './pages/home';
import './pages/UserPosts';
import { UserContextProvider } from "./user-context";
function App() {
  return (
    <UserContextProvider>
    <Router>
    <div className="App">
      <Navigation/>
      <Routes>
      <Route path="/:page" element={<PageRenderer />} />
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostPage />}/>
        <Route path="/posts/:id" element={<UserPosts />}/>
        <Route path="/edit/:id" element={<EditPost />} />
        <Route component={()=>404}/>
      </Routes>
    </div>
    </Router>
    </UserContextProvider>
  );
}

export default App;
