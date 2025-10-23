// import React from 'react';
// import {
//   Typography
// } from '@mui/material';
// import './userDetail.css';
// import fetchModel from '../../lib/fetchModelData';

import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField } from '@mui/material';
import './userDetail.css';
import fetchModel from '../../lib/fetchModelData';

/**
 * Define UserDetail, a React component of project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
    };
  }

  componentDidMount() {
    const new_user_id = this.props.match.params.userId;
    this.handleUserChange(new_user_id);
  }

  componentDidUpdate(prevProps) {
    const prev_user_id = prevProps.match.params.userId;
    const new_user_id = this.props.match.params.userId;

    if (prev_user_id !== new_user_id) {
      this.handleUserChange(new_user_id);
    }
  }

  handleUserChange(user_id) {
    fetchModel(`/user/${user_id}`).then((response) => {
      const new_user = response.data;
      this.setState({
        user: new_user,
      });
      const main_content = `User Details for ${new_user.first_name} ${new_user.last_name}`;
      this.props.changeMainContent(main_content);
    });
  }

  render() {
    const { user } = this.state;

    return user ? (
      <div>
        <Box component="form" noValidate autoComplete="off">
          <div>
            <Button
              variant="contained"
              component="a"
              href={`#/photos/${user._id}`}
            >
              User Photos
            </Button>
          </div>
          <div>
            <TextField
              id="first_name"
              label="First Name"
              variant="outlined"
              disabled
              fullWidth
              margin="normal"
              value={user.first_name}
            />
          </div>
          <div>
            <TextField
              id="last_name"
              label="Last Name"
              variant="outlined"
              disabled
              fullWidth
              margin="normal"
              value={user.last_name}
            />
          </div>
          <div>
            <TextField
              id="location"
              label="Location"
              variant="outlined"
              disabled
              fullWidth
              margin="normal"
              value={user.location}
            />
          </div>
          <div>
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              disabled
              fullWidth
              margin="normal"
              value={user.description}
            />
          </div>
          <div>
            <TextField
              id="occupation"
              label="Occupation"
              variant="outlined"
              disabled
              fullWidth
              margin="normal"
              value={user.occupation}
            />
          </div>
        </Box>
      </div>
    ) : (
      <div />
    );
  }
}

UserDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  changeMainContent: PropTypes.func.isRequired,
};

export default UserDetail;



// /**
//  * Define UserDetail, a React component of project #5
//  */
// class UserDetail extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       user: undefined
//     };
//   }
// componentDidMount() {
//     const new_user_id = this.props.match.params.userId;
//     this.handleUserChange(new_user_id);
// }
// handleUserChange(user_id){
//   fetchModel("/user/" + user_id)
//       .then((response) =>
//       {
//           const new_user = response.data;
//           this.setState({
//               user: new_user
//           });
//           const main_content = "User Details for " + new_user.first_name + " " + new_user.last_name;
//           this.props.changeMainContent(main_content);
//       });
// }

// componentdidupdate() {
//     const new_user_id = this.props.match.params.userId;
//     const current_user_id = this.state.user?._id;
//     if (current_user_id  !== new_user_id){
//         this.handleUserChange(new_user_id);
//     }
// }


//   render() {
//     return (
//       <Typography variant="body1">
//         This should be the UserDetail view of the PhotoShare app. Since
//         it is invoked from React Router the params from the route will be
//         in property match. So this should show details of user:
//         {this.props.match.params.userId}. You can fetch the model for the
//         user from window.models.userModel(userId).
//       </Typography>
//     );
//   }
// }

// export default UserDetail;

