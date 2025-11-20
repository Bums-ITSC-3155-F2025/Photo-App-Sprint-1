import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import './topBar.css';

axios.defaults.withCredentials = true;

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    axios.post('/admin/logout')
      .then(() => {
        if (this.props.onLogout) this.props.onLogout();
        window.location = '#/login-register';
      })
      .catch(() => {
        console.log('Logout failed');
      });
  }

  render() {
    const { currentUser, onUploadPhoto } = this.props;

    // Message to display in top bar 
    const loginMessage = currentUser
      ? `Hi ${currentUser.first_name}`
      : "Please Login";

    return (
      <AppBar className="topbar-appbar" position="absolute">
        <Toolbar className="topbar-toolbar">

          {/* LEFT: App title */}
          <Typography variant="h5" className="topbar-title">
            PhotoShare
          </Typography>

          {/* CENTER: Message (NOW controlled by top bar itself) */}
          <Typography variant="h6" className="topbar-message">
            {loginMessage}
          </Typography>

          {/* RIGHT: Controls */}
          <div className="topbar-controls">

            {currentUser ? (
              <>
                {/* Add Photo */}
                <Button
                  variant="contained"
                  component="label"
                  className="topbar-button"
                >
                  Add Photo
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => onUploadPhoto(e)}
                  />
                </Button>

                {/* Logout */}
                <Button
                  variant="outlined"
                  className="topbar-button"
                  onClick={this.handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Typography variant="body1" className="topbar-login-text">
                Please Login
              </Typography>
            )}
          </div>

        </Toolbar>
      </AppBar>
    );
  }
}

TopBar.propTypes = {
  currentUser: PropTypes.object,
  onUploadPhoto: PropTypes.func,
  onLogout: PropTypes.func
};

export default TopBar;

