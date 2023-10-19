import ReactQuill from "react-quill";
import "bootstrap/dist/css/bootstrap.css";
import "react-quill/dist/quill.snow.css";
import "./css/create-post.css";
import { useState } from "react";
import { Navigate } from "react-router";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [category1, setCategory1]= useState("");
  const [category2, setCategory2]= useState("");
  const [redirect, setRedirect]= useState(false);
  
  async function createNewPost(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    data.set("category1", category1);
    data.set("category2", category2);
    ev.preventDefault();
 
   const response= await fetch('http://127.0.0.1:8000/post', {
        method: 'POST',
        body: data,
        credentials: "include",
    });

    if(response.ok ){
        setRedirect(true);
    }
  }
  
  if(redirect){
    return <Navigate to={'/home'} />
  }
  return (
    <form onSubmit={createNewPost}>
      <div className="form-group">
        <label className="top">Title</label>
        <input
          type="text"
          name="title"
          className="form-control"
          placeholder={"Title"}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Summary</label>
        <input
          className="form-control"
          type="summary"
          placeholder={"Summary"}
          name="summary"
          value={summary}
          maxLength={400}
          onChange={(event) => setSummary(event.target.value)}
        />
      </div>
      <div className="form-group">
        <label>File</label>
        <input
          className="form-control"
          name="file"
          type="file"
          onChange={(ev) => setFiles(ev.target.files)}
        />
      </div>
      <div className="form-group">
          <label>Categories</label>
          <div className="d-flex">
          <input className="form-control category"
          name="category1"
          type="text"
          value={category1}
          onChange={(event) => setCategory1(event.target.value)}
           />
           <input className="form-control category"
          name="category2"
          type="text" 
          value={category2}
          onChange={(event) => setCategory2(event.target.value)}
           />
           </div>
      </div>

      <div>
        <label>Content</label>
        <ReactQuill
          value={content}
          modules={modules}
          formats={formats}
          onChange={(newValue) => setContent(newValue)}
        />
      </div>
     
      <button type="submit" className="btn btn-dark">
        Create Post
      </button>
    </form>
  );
}
