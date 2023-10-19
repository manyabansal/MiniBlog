require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User.js");
const Post = require("./models/Post.js");
const Tag = require("./models/Tag.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const moment = require("moment");
const categoryColors = require("./assets/category-colors.js");

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

const HOST = "http://localhost:3000";
const salt = bcrypt.genSaltSync(10);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors({ credentials: true, origin: HOST }));
app.use(express.json())

mongoose
  .connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

//////////////////////////////////////"""/"""//////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("ok");
});

///////////////////////////////////////"""/sign-up"""////////////////////////////////////////////
app.post("/sign-up", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.find({ username: username })
    .then((users) => {
      if (users.length > 0) {
        // Username is already taken
        return res.status(400).json({ message: "Username is already taken" });
      } else {
        const userInfo = new User({
          username: username,
          password: bcrypt.hashSync(password, salt),
        });

        userInfo.save();
        return res.json(userInfo);
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    });
});

///////////////////////////////////////"""/login"""////////////////////////////////////////////

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username })
    .then((user) => {
      if (user) {
        const userInfo = user;
        const passOk = bcrypt.compareSync(password, userInfo.password);
        if (passOk) {
          const token = jwt.sign(
            { username, id: userInfo._id },
            process.env.SECRET
          );

          return res
            .cookie(`token`, token, {
              path: "/",
              secure: true,
              httpOnly: true,
              sameSite: "none",
            })
            .json({
              id: userInfo._id,
              username,
            });
        } else {
          return res.status(401).json({ message: "Wrong password" });
        }
      } else {
        return res.status(400).json({ message: "Username doesn't exist" });
      }
    })
    .catch((err) => console.log(err));
});

///////////////////////////////////////"""/profile"""////////////////////////////////////////////

app.get("/profile", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const info = jwt.verify(token, process.env.SECRET);
  res.json(info);
});

///////////////////////////////////////"""/logout"""////////////////////////////////////////////

app.post("/logout", (req, res) => {
  res
    .clearCookie(`token`, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "none",
    })
    .json("logged out");
});

///////////////////////////////////////"""/post"""////////////////////////////////////////////
/////////POST
app
  .post("/post", upload.single("file"), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    const { title, summary, content, category1, category2 } = req.body;

    const categories = [category1.toUpperCase(), category2.toUpperCase()];
    let tags = [];

    await Promise.all(
      categories.map(async (element) => {
        return Tag.findOne({ name: element }).then((tag) => {
          if (!tag) {
            const tagInfo = new Tag({
              name: element,
              color:
                categoryColors[
                  Math.floor(Math.random() * categoryColors.length)
                ],
            });
            return tagInfo.save().then((savedTag) => {
              tags.push(savedTag);
            });
          } else {
            tags.push(tag);
          }
        });
      })
    );
    const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const info = jwt.verify(token, process.env.SECRET);

    const postDoc = await Post.create({
      title,
      summary,
      content,
      categories: tags,
      date: moment().format("MMMM DD, YYYY"),
      image: newPath,
      author: info.id,
      click: 0,
      likesCount: 0,
      likes: [],
    });

    res.json(postDoc);
  })
  ////////PUT
  .put("/post", upload.single("file"), async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const info = jwt.verify(token, process.env.SECRET);

    let newPath = "";
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }
    console.log("New path:", newPath);

    const { id, title, summary, content, category1, category2 } = req.body;

    const categories = [category1.toUpperCase(), category2.toUpperCase()];
    let tags = [];

    await Promise.all(
      categories.map(async (element) => {
        return Tag.findOne({ name: element }).then((tag) => {
          if (!tag) {
            const tagInfo = new Tag({
              name: element,
              color:
                categoryColors[
                  Math.floor(Math.random() * categoryColors.length)
                ],
            });
            return tagInfo.save().then((savedTag) => {
              tags.push(savedTag);
            });
          } else {
            tags.push(tag);
          }
        });
      })
    );

    const postDoc = await Post.findById(id).populate("author");
    const isAuthor =
      JSON.stringify(postDoc.author._id) === JSON.stringify(info.id);
    if (!isAuthor) {
      res.status(400).json("You are not the author of this post!");
    }

    const oldPath = postDoc?.image;
    await postDoc.updateOne({
      title,
      summary,
      content,
      categories: tags,
      image: newPath ? newPath : oldPath,
    });

    if (newPath) {
      const previousImagePath = `${oldPath}`;
      fs.unlink(previousImagePath, (error) => {
        if (error) {
          console.error("Error deleting previous image:", error);
        }
      });
    }
    const updatedPostDoc = await Post.findById(id).populate("author");

    res.json(updatedPostDoc);
  })
  ///////GET
  .get("/post", async (req, res) => {
    const trending = await Post.find()
      .sort({ clicks: -1 }) // Sort in descending order of clicks
      .limit(5)
      .populate("author", ["username"])
      .populate("categories")
      .catch((err) => {
        console.log(err);
        return;
      });

    const featured = await Post.find()
      .sort({ likesCount: -1 })
      .limit(4)
      .populate("author", ["username"])
      .populate("categories")
      .catch((err) => {
        console.log(err);
        return;
      });

    const recent = await Post.find()
      .sort({ date: "desc" })
      .limit(24)
      .populate("author", ["username"])
      .populate("categories")
      .catch((err) => {
        console.log(err);
        return;
      });

    res.json({
      trending,
      featured,
      recent,
    });
  });

///////////////////////////////////////"""/post/:id"""////////////////////////////////////////////
//////GET
app
  .get("/post/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const postDoc = await Post.findById(id)
        .populate("author", ["username"])
        .populate("categories");

      if (!postDoc) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(postDoc);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
  ///////PATCH
  .patch("/post/:id", async (req, res) => {
    const { token } = req.cookies;
    const { id } = req.params;
    const change= req.query.set;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const info = jwt.verify(token, process.env.SECRET);

    const postDoc = await Post.findById(id).populate("author");
    const isAuthor =
      JSON.stringify(postDoc.author._id) === JSON.stringify(info.id);
    
      if(change==='click'){
        await postDoc.updateOne({
          $set: {
            clicks: isAuthor ? postDoc.clicks : postDoc.clicks + 1,
          },
        });
      }
      if(change==='addLike'){
        await postDoc.updateOne({
          $set: {
            likesCount: postDoc.likesCount + 1,
            likes: [...postDoc.likes, info.id],
          },
        });
      }
      if(change==='removeLike'){
        await postDoc.updateOne({
          $set: {
            likesCount: postDoc.likesCount - 1,
            likes: postDoc.likes.filter((userId)=> userId!=info.id),
          },
        });
      }
   
    const updatedPostDoc = await Post.findById(id).populate("author");
    res.json(updatedPostDoc);
  })
  /////DELETE
  .delete("/post/:id", async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id);
    const imagePath = postDoc?.image;
    Post.deleteOne({ _id: id })
      .then(() => {
        fs.unlink(`${imagePath}`, (error) => {
          if (error) {
            console.error("Error deleting previous image:", error);
          }
        });
        res.json("Successfully deleted");
      })
      .catch((err) => console.log(err));

    
  });
  
///////////////////////////////////////"""/posts/:userid"""////////////////////////////////////////////

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const userDoc = await User.findById(id, ["username"]);
  const posts = await Post.find({ author: userDoc._id })
    .populate("author", ["username"])
    .populate("categories");

  res.json(posts);
});

///////////////////////////////////////"""/user/:id"""////////////////////////////////////////////

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const userDoc = await User.findById(id, ["username"]);

  res.json(userDoc);
});

//////////////////////////////////////"/posts"/////////////////////////////////////

app.get("/posts", async (req, res) => {
  const substring = req.query.search;
  const isTag= substring?.startsWith("#")
  const tagSub= await substring?.slice(1).toUpperCase();

  if(isTag && substring){
       const tags = await Tag.find({name:tagSub });
    Post.find({
      categories: {$in : tags}
    }).populate("categories").then(posts=>res.json(posts));

  }
  else{
  Post.find({
    title: {
      $regex: substring,
      $options: "i",
    },
  }).populate("author", ["username"])
  .populate("categories")
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      throw err;
    });
  }
 
});
///////////////////////////////////////APP.LISTEN////////////////////////////////////////////
  
app.listen(process.env.PORT||8000, function (req, res) {
  console.log("Server is running");
});
