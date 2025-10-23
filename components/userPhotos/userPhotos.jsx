import fetchModel from '../../lib/fetchModelData.js';
import PropTypes from 'prop-types';
import React from 'react';
import { Typography } from '@mui/material';
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
    return (
      <Typography variant="body1">
        This should be the UserPhotos view of the PhotoShare app. Since
        it is invoked from React Router the params from the route will be
        in property match. So this should show details of user:
        {this.props.match?.params?.userId}. You can fetch the model for the user from
        window.models.photoOfUserModel(userId):
        <Typography variant="caption">
          {JSON.stringify(
            window.models.photoOfUserModel(this.props.match?.params?.userId)
          )}
        </Typography>
      </Typography>
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
