import fetchModel from '../../lib/fetchModelData.js';
import PropTypes from 'prop-types';
import React from 'react';
import { Typography, Divider } from '@mui/material';
import './userPhotos.css';

/**
 * Define UserPhotos, a React component of project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: undefined,
      photos: undefined,
    };
  }

  componentDidMount() {
    const user_id = this.props.match?.params?.userId;
    this.handleUserChange(user_id);
  }

  componentDidUpdate() {
    const new_user_id = this.props.match?.params?.userId;
    const current_user_id = this.state.user_id;
    if (current_user_id !== new_user_id) {
      this.handleUserChange(new_user_id);
    }
  }

  handleUserChange(user_id) {
    fetchModel('/photosOfUser/' + user_id).then((response) => {
      this.setState({
        user_id: user_id,
        photos: response.data,
      });
    });

    fetchModel('/user/' + user_id).then((response) => {
      const new_user = response.data;
      const main_content =
        'User Photos for ' +
        new_user.first_name +
        ' ' +
        new_user.last_name;
      this.props.changeMainContent(main_content);
    });
  }

  render() {
    const { photos } = this.state;

    if (!photos) {
      return <Typography variant="body1">Loading photos...</Typography>;
    }

    return (
      <div className="user-photos">
        {photos.map((photo) => (
          <div key={photo._id} className="photo">
            <div>
              <img src={`images/${photo.file_name}`} alt={photo.file_name} />
            </div>
            <div className="photo-info">Taken: {photo.date_time}</div>
            {photo.comments && photo.comments.length > 0 && (
              <div className="comments">
                <Typography variant="subtitle2">Comments</Typography>
                <Divider style={{ margin: '6px 0 10px' }} />
                {photo.comments.map((c) => (
                  <div key={c._id} className="comment">
                    <div>
                      <a href={`#/users/${c.user._id}`}>
                        {c.user.first_name} {c.user.last_name}
                      </a>{' '}
                      on {c.date_time}
                    </div>
                    <div>{c.comment}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}

UserPhotos.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
    }),
  }),
  changeMainContent: PropTypes.func,
};

export default UserPhotos;
