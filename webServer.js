const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.set("strictQuery", false);

const express = require("express");
const app = express();

const session = require("express-session");
const multer = require("multer");
const fs = require("fs");

const processFormBody = multer({ storage: multer.memoryStorage() }).single("uploadedphoto");

const User = require("./schema/user");
const Photo = require("./schema/photo");
const SchemaInfo = require("./schema/schemaInfo");

mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/* ----------------------- MIDDLEWARE ----------------------- */
app.use(express.json());
app.use(express.static(__dirname));

app.use(
  session({
    secret: "project7-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

/* ----------------------- PUBLIC ROUTES ----------------------- */
/* These routes DO NOT require login:
   - /admin/login
   - /admin/logout
   - /user (registration)
   - /test/*
   - /session (restore)
*/

/* RESTORE SESSION */
app.get("/session", async (req, res) => {
  if (!req.session.user_id) return res.status(401).send("No active session");

  try {
    const user = await User.findById(req.session.user_id).exec();
    if (!user) return res.status(401).send("No active session");

    return res.status(200).json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      login_name: user.login_name
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/* USER REGISTRATION */
app.post("/user", async (req, res) => {
  const { login_name, password, first_name, last_name, location, description, occupation } = req.body;

  if (!login_name || !password || !first_name || !last_name) {
    return res.status(400).send("Required fields missing.");
  }

  const exists = await User.findOne({ login_name }).exec();
  if (exists) return res.status(400).send("login_name already taken.");

  const newUser = new User({
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation
  });

  return newUser.save()
    .then((savedUser) => res.status(200).json({
      _id: savedUser._id,
      login_name: savedUser.login_name,
      first_name: savedUser.first_name,
      last_name: savedUser.last_name,
      location: savedUser.location,
      description: savedUser.description,
      occupation: savedUser.occupation
    }))
    .catch((err) => res.status(500).send(err));
});

/* LOGIN */
app.post("/admin/login", async (req, res) => {
  const { login_name, password } = req.body;

  if (!login_name || !password) {
    return res.status(400).send("Missing credentials");
  }

  const user = await User.findOne({ login_name }).exec();
  if (!user || user.password !== password) {
    return res.status(400).send("Invalid login");
  }

  req.session.user_id = user._id;

  return res.status(200).json({
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    login_name: user.login_name
  });
});

/* LOGOUT */
app.post("/admin/logout", (req, res) => {
  if (!req.session.user_id) {
    return res.status(400).send("Not logged in");
  }
  return req.session.destroy(() => {
    res.status(200).send("Logged out");
  });
});

/* -------------------- 401 PROTECTION -------------------- */
app.use((req, res, next) => {
  const openRoutes = [
    "/admin/login",
    "/admin/logout",
    "/user",
    "/test",
    "/session"
  ];

  if (
    openRoutes.some((route) => req.path.startsWith(route)) ||
    req.path.startsWith("/test")
  ) {
    return next();
  }

  if (!req.session.user_id) {
    return res.status(401).send("Unauthorized");
  }

  return next();
});

/* ----------------------- PROTECTED ROUTES ----------------------- */

/* USER LIST */
app.get("/user/list", (req, res) => {
  User.find({}, { first_name: 1, last_name: 1 }, (err, users) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(users);
  });
});

/* USER DETAILS */
app.get("/user/:id", (req, res) => {
  User.findById(req.params.id, { __v: 0 }, (err, user) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(400).send("User not found");
    return res.status(200).send(user);
  });
});

/* PHOTOS OF USER */
app.get("/photosOfUser/:id", async (req, res) => {
  try {
    const photos = await Photo.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(req.params.id) } },
      { $addFields: { comments: { $ifNull: ["$comments", []] } } },
      {
        $lookup: {
          from: "users",
          localField: "comments.user_id",
          foreignField: "_id",
          as: "commentUsers"
        }
      },
      {
        $addFields: {
          comments: {
            $map: {
              input: "$comments",
              in: {
                comment: "$$this.comment",
                date_time: "$$this.date_time",
                user: {
                  $arrayElemAt: [
                    "$commentUsers",
                    {
                      $indexOfArray: ["$commentUsers._id", "$$this.user_id"]
                    }
                  ]
                }
              }
            }
          }
        }
      },
      { $project: { commentUsers: 0 } }
    ]);

    return res.status(200).send(photos);
  } catch (err) {
    return res.status(500).send(err);
  }
});

/* ADD COMMENT */
app.post("/commentsOfPhoto/:photo_id", async (req, res) => {
  if (!req.body.comment || req.body.comment.trim() === "") {
    return res.status(400).send("Empty comment");
  }

  try {
    const photo = await Photo.findById(req.params.photo_id);
    if (!photo) return res.status(400).send("Photo not found");

    photo.comments.push({
      comment: req.body.comment,
      user_id: req.session.user_id,
      date_time: new Date()
    });

    await photo.save();
    return res.status(200).send("Comment added");
  } catch (err) {
    return res.status(500).send(err);
  }
});

/* UPLOAD PHOTO */
app.post("/photos/new", (req, res) => {
  return processFormBody(req, res, function (err) {
    if (err || !req.file) {
      return res.status(400).send("No file uploaded");
    }

    const timestamp = new Date().valueOf();
    const filename = "U" + timestamp + req.file.originalname;

    return fs.writeFile("./images/" + filename, req.file.buffer, async function (writeErr) {
      if (writeErr) return res.status(500).send(writeErr);

      const newPhoto = new Photo({
        file_name: filename,
        date_time: new Date(),
        user_id: req.session.user_id,
        comments: []
      });

      return newPhoto.save()
        .then(() => res.status(200).send("Photo uploaded"))
        .catch((saveErr) => res.status(500).send(saveErr));
    });
  });
});

/* TOGGLE LIKE */
app.post("/likePhoto/:photo_id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photo_id);
    if (!photo) return res.status(400).send("Photo not found");

    const userId = req.session.user_id.toString();
    const index = photo.likes.findIndex(id => id.toString() === userId);

    if (index >= 0) {
      // User already liked → Unlike
      photo.likes.splice(index, 1);
    } else {
      // User has not liked → Like
      photo.likes.push(userId);
    }

    await photo.save();
    return res.status(200).json({
      likeCount: photo.likes.length,
      liked: index < 0
    });

  } catch (err) {
    console.error("LIKE ERROR", err);
    return res.status(500).send(err);
  }
});


/* ----------------------- TEST ROUTES ----------------------- */
app.get("/test/:p1?", (req, res) => {
  const param = req.params.p1 || "info";

  if (param === "info") {
    return SchemaInfo.find({}, (err, info) => {
      if (err) return res.status(500).send(err);
      if (!info.length) return res.status(400).send("Missing SchemaInfo");
      return res.status(200).send(info[0]);
    });
  } else if (param === "counts") {
    return Promise.all([
      User.countDocuments({}),
      Photo.countDocuments({}),
      SchemaInfo.countDocuments({})
    ]).then(([user, photo, schemaInfo]) => {
      return res.status(200).send({ user, photo, schemaInfo });
    });
  } else {
    return res.status(400).send("Bad param");
  }
});

/* ----------------------- SERVER START ----------------------- */
app.listen(3000, () => {
  console.log("Listening at http://localhost:3000");
});
