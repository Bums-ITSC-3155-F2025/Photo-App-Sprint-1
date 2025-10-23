import PropTypes from 'prop-types';
import React from 'react';
import fetchModel from '../../lib/fetchModelData.js';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
}
from '@mui/material';
import './userList.css';

/**
 * Define UserList, a React component of project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      user : undefined
     //user_id : undefined
    }
  }
componentDidMount() {
  this.handleUserListChange();
}
componentDidUpdate() {
  const new_user_id = this.props.match.params.userId;
  const current_user_id = this.state.user?._id;
  if (current_user_id  !== new_user_id){
      this.handleUserChange(new_user_id);
  }
}

handleUserChange(user_id){
  fetchModel("/user/" + user_id)
      .then((response) =>
      {
          const new_user = response.data;
          this.setState({
              user: new_user
          });
          const main_content = "User Details for " + new_user.first_name + " " + new_user.last_name;
          this.props.changeMainContent(main_content);
      });
}

handleUserListChange(){
  fetchModel("/user/list")
      .then((response) =>
      {
          this.setState({
              users: response.data
          });
      });
}
  render() {
    return (
      <div>
        <Typography variant="body1">
          This is the user list, which takes up 3/12 of the window.
          You might choose to use <a href="https://mui.com/components/lists/">Lists</a> and <a href="https://mui.com/components/dividers/">Dividers</a> to
          display your users like so:
        </Typography>
        <List component="nav">
          <ListItem>
            <ListItemText primary="Item #1" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Item #2" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Item #3" />
          </ListItem>
          <Divider />
        </List>
        <Typography variant="body1">
          The model comes in from window.models.userListModel()
        </Typography>
      </div>
    );
  }
}

export default UserList;

UserList.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
    }),
  }),
  changeMainContent: PropTypes.func,
};


