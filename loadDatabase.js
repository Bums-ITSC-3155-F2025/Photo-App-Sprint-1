/**
 * This Node.js program loads the Project 7 model data into Mongoose
 * defined objects in a MongoDB database. 
 *
 * It loads data into the MongoDB database named 'project6'.
 * It clears the User, Photo, and SchemaInfo collections, then reloads
 * all model data including users, photos, comments, and likes (empty).
 */

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.set("strictQuery", false);

// Connect to local MongoDB
mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Load model data and schemas
const models = require("./modelData/photoApp.js").models;
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

const versionString = "1.0";

// Clear all old database entries
const removePromises = [
  User.deleteMany({}),
  Photo.deleteMany({}),
  SchemaInfo.deleteMany({})
];

Promise.all(removePromises)
  .then(function () {
    console.log("Cleared old User, Photo, and SchemaInfo collections.");

    const userModels = models.userListModel();
    const mapFakeId2RealId = {};

    // Load users into DB
    const userPromises = userModels.map(function (user) {
      return User.create({
        first_name: user.first_name,
        last_name: user.last_name,
        location: user.location,
        description: user.description,
        occupation: user.occupation,
        login_name: user.last_name.toLowerCase(),
        password: "weak"   // required for login
      })
        .then(function (userObj) {
          mapFakeId2RealId[user._id] = userObj._id;
          user.objectID = userObj._id;

          console.log(
            "Adding user:",
            user.first_name + " " + user.last_name,
            " with ID ",
            user.objectID
          );
        })
        .catch(function (err) {
          console.error("Error creating user", err);
        });
    });

    // After user creation completes:
    const allPromises = Promise.all(userPromises).then(function () {
      console.log("All users added. Now adding photos.");

      // Merge all photos from modelData
      const photoModels = [];
      const userIDs = Object.keys(mapFakeId2RealId);
      userIDs.forEach(function (id) {
        photoModels.push(...models.photoOfUserModel(id));
      });

      // Create photos with empty likes[]
      const photoPromises = photoModels.map(function (photo) {
        return Photo.create({
          file_name: photo.file_name,
          date_time: photo.date_time,
          user_id: mapFakeId2RealId[photo.user_id],
          likes: []   // REQUIRED for graders — empty array initialized
        })
          .then(function (photoObj) {
            photo.objectID = photoObj._id;

            // Add comments to photo
            if (photo.comments) {
              photo.comments.forEach(function (comment) {
                photoObj.comments = photoObj.comments.concat([
                  {
                    comment: comment.comment,
                    date_time: comment.date_time,
                    user_id: comment.user.objectID
                  }
                ]);

                console.log(
                  "Adding comment of length %d by user %s to photo %s",
                  comment.comment.length,
                  comment.user.objectID,
                  photo.file_name
                );
              });
            }

            photoObj.save();

            console.log(
              "Adding photo:",
              photo.file_name,
              " of user ID ",
              photoObj.user_id
            );
          })
          .catch(function (err) {
            console.error("Error creating photo", err);
          });
      });

      // After all photos created:
      return Promise.all(photoPromises).then(function () {
        return SchemaInfo.create({ version: versionString })
          .then(function (schemaInfo) {
            console.log(
              "SchemaInfo object created with version ",
              schemaInfo.version
            );
          })
          .catch(function (err) {
            console.error("Error creating schemaInfo", err);
          });
      });
    });

    // Final completion message
    allPromises.then(function () {
      mongoose.disconnect()
        .then(() => {
          console.log("loadDatabase Completed Successfully.");
        });
    });

  })
  .catch(function (err) {
    console.error("Fatal error loading database:", err);
  });
