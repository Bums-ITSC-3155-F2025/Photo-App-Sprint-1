import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, TextField,
  ImageList, ImageListItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography
} from '@mui/material';
import './userPhotos.css';
import axios from 'axios';


/**
 * Define UserPhotos, a React component of project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: undefined,
      photos: undefined,
      new_comment: undefined,
      add_comment: false,
      current_photo_id: undefined
    };
    this.handleCancelAddComment = this.handleCancelAddComment.bind(this);
    this.handleSubmitAddComment = this.handleSubmitAddComment.bind(this);
  }

  componentDidMount() {
    const new_user_id = this.props.match.params.userId;
    this.handleUserChange(new_user_id);
  }

  componentDidUpdate(prevProps) {
    const new_user_id = this.props.match.params.userId;
    const current_user_id = this.state.user_id;

    // Reload when viewing a different user
    if (current_user_id !== new_user_id) {
      this.handleUserChange(new_user_id);
      return;
    }

    // Reload when a new photo is uploaded for the current user
    if (this.props.photoRefreshToken !== prevProps.photoRefreshToken && current_user_id) {
      this.handleUserChange(current_user_id);
    }
  }

  handleUserChange(user_id) {
    axios.get("/photosOfUser/" + user_id)
      .then((response) => {
        console.log('then');
        this.setState({
          user_id: user_id,
          photos: response.data
        });
      })
      .catch(() => {
        console.log('catch');
      });
    axios.get("/user/" + user_id)
      .then((response) => {
        const new_user = response.data;
        const main_content = "User Photos for " + new_user.first_name + " " + new_user.last_name;
        this.props.changeMainContent(main_content);
      })
      .catch(() => {
        console.log('catch2');
      });
  }

  handleNewCommentChange = (event) => {
    this.setState({
      new_comment: event.target.value
    });
  };

  handleShowAddComment = (photo_id) => {
    this.setState({
      add_comment: true,
      current_photo_id: photo_id
    });
  };

  isPhotoLikedByCurrentUser = (photo) => {
    const { currentUser } = this.props;
    if (!currentUser || !photo.likes) {
      return false;
    }
    const currentUserId = currentUser._id.toString();
    return photo.likes.some((id) => {
      const value = id && id._id ? id._id : id;
      return value && value.toString() === currentUserId;
    });
  };

  handleLikePhoto = (photo_id) => {
    const { currentUser } = this.props;
    if (!currentUser) {
      return;
    }

    axios.post("/likePhoto/" + photo_id)
      .then((response) => {
        const { liked } = response.data;
        const currentUserId = currentUser._id.toString();

        this.setState((prevState) => {
          const updatedPhotos = (prevState.photos || []).map((photo) => {
            if (photo._id !== photo_id) return photo;

            const likesArray = Array.isArray(photo.likes) ? [...photo.likes] : [];
            const existingIndex = likesArray.findIndex((id) => {
              const value = id && id._id ? id._id : id;
              return value && value.toString() === currentUserId;
            });

            const nextLikes = [...likesArray];
            if (liked && existingIndex < 0) {
              nextLikes.push(currentUserId);
            } else if (!liked && existingIndex >= 0) {
              nextLikes.splice(existingIndex, 1);
            }

            return { ...photo, likes: nextLikes };
          });

          return { photos: updatedPhotos };
        });
      })
      .catch(error => {
        console.log('Error liking photo:', error);
      });
  };

  handleCancelAddComment = () => {
    this.setState({
      add_comment: false,
      new_comment: undefined,
      current_photo_id: undefined
    });
  };

  handleSubmitAddComment = () => {
    const currentState = JSON.stringify({ comment: this.state.new_comment });
    const photo_id = this.state.current_photo_id;
    const user_id = this.state.user_id;
    axios.post("/commentsOfPhoto/" + photo_id,
      currentState,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(() => {
        this.setState({
          add_comment: false,
          new_comment: undefined,
          current_photo_id: undefined
        });
        axios.get("/photosOfUser/" + user_id)
          .then((response) => {
            this.setState({
              photos: response.data
            });
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return this.state.user_id ? (
      <div>
        <div>
          <Button variant="contained" component="a" href={"#/users/" + this.state.user_id}>
            User Detail
          </Button>
        </div>
        <ImageList variant="masonry" cols={1} gap={8}>
          {this.state.photos ? this.state.photos.map((item) => {
            const isLiked = this.isPhotoLikedByCurrentUser(item);
            const likeCount = item.likes ? item.likes.length : 0;

            return (
              <div key={item._id}>
                <TextField label="Photo Date" variant="outlined" disabled fullWidth margin="normal"
                  value={item.date_time} />
                <ImageListItem key={item.file_name}>
                  <img
                    src={`images/${item.file_name}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    srcSet={`images/${item.file_name}?w=164&h=164&fit=crop&auto=format`}
                    alt={item.file_name}
                    loading="lazy"
                  />
                </ImageListItem>
                <div>
                  {item.comments ?
                    item.comments.map((comment) => (
                      <div key={comment._id}>
                        <TextField label="Comment Date" variant="outlined" disabled fullWidth
                          margin="normal" value={comment.date_time} />
                        <TextField label="User" variant="outlined" disabled fullWidth
                          margin="normal"
                          value={comment.user.first_name + " " + comment.user.last_name}
                          component="a" href={"#/users/" + comment.user._id}>
                        </TextField>
                        <TextField label="Comment" variant="outlined" disabled fullWidth
                          margin="normal" multiline rows={4} value={comment.comment} />
                      </div>
                    ))
                    : (
                      <div>
                        <Typography>No Comments</Typography>
                      </div>
                    )}
                  <Typography variant="body2" sx={{ marginTop: 1, marginBottom: 1 }}>
                    Likes: {likeCount}
                  </Typography>
                  <Button photo_id={item._id} variant="contained" onClick={() => this.handleShowAddComment(item._id)}>
                    Add Comment
                  </Button>
                  <Button photo_id={item._id} variant="contained" onClick={() => this.handleLikePhoto(item._id)}>
                    {isLiked ? "Unlike" : "Like"}
                  </Button>

                </div>
              </div>
            );
          }) : (
            <div>
              <Typography>No Photos</Typography>
            </div>
          )}
        </ImageList>
        <Dialog open={this.state.add_comment}>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter New Comment for Photo
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="comment"
              label="Comment"
              multiline rows={4}
              fullWidth
              variant="standard"
              onChange={this.handleNewCommentChange}
              defaultValue={this.state.new_comment}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { this.handleCancelAddComment(); }}>Cancel</Button>
            <Button onClick={() => { this.handleSubmitAddComment(); }}>Add</Button>
          </DialogActions>
        </Dialog>
      </div>
    ) : (
      <div />
    );
  }
}

UserPhotos.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  changeMainContent: PropTypes.func.isRequired,
  photoRefreshToken: PropTypes.number,
  currentUser: PropTypes.shape({
    _id: PropTypes.string.isRequired
  })
};

UserPhotos.defaultProps = {
  photoRefreshToken: 0,
  currentUser: null
};

export default UserPhotos;
