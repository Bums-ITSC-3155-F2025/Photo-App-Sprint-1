import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Grid, Typography, Paper } from '@mui/material';

import './styles/main.css';

import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import LoginRegister from './components/loginRegister/LoginRegister';

axios.defaults.withCredentials = true; // keep session cookies

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      main_content: 'Welcome!',
      currentUser: null,
      loadingSession: true,
      photoRefreshToken: 0
    };

    this.changeMainContent = this.changeMainContent.bind(this);
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this);
  }

  componentDidMount() {
    // Restore session if user is already logged in
    axios.get('/session')
      .then((res) => {
        this.setState({
          currentUser: res.data,
          loadingSession: false
        });
      })
      .catch(() => {
        this.setState({
          currentUser: null,
          loadingSession: false
        });
      });
  }

  // Update the center text
  changeMainContent(main_content) {
    this.setState({ main_content });
  }

  // When LoginRegister succeeds
  handleLoginSuccess(user) {
    this.setState({
      currentUser: user,
      main_content: `Hi ${user.first_name}!`
    });
  }

  // When logout happens
  handleLogout() {
    this.setState({
      currentUser: null,
      photoRefreshToken: 0
    });
  }

  // Upload photo
  handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('uploadedphoto', file);

    axios.post('/photos/new', formData)
      .then(() => {
        console.log('Photo uploaded!');
        this.setState((prevState) => ({
          photoRefreshToken: prevState.photoRefreshToken + 1
        }));
      })
      .catch((err) => {
        console.log('UPLOAD ERROR:', err);
      });
  }

  render() {
    const { currentUser, loadingSession } = this.state;

    if (loadingSession) {
      return <div>Loading...</div>;
    }

    return (
      <HashRouter>
        <Grid container spacing={8}>
          {/* TOP BAR */}
          <Grid item xs={12}>
            <TopBar
              main_content={this.state.main_content}
              currentUser={this.state.currentUser}
              onUploadPhoto={this.handlePhotoUpload}
              onLogout={this.handleLogout}
            />
          </Grid>

          <div className="main-topbar-buffer" />

          {/* SIDE USER LIST */}
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              {currentUser ? (
                <UserList />
              ) : (
                <Typography>Please login to view users.</Typography>
              )}
            </Paper>
          </Grid>

          {/* MAIN CONTENT */}
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Switch>

                {/* LOGIN ROUTE */}
                <Route
                  path="/login-register"
                  render={() => (
                    currentUser
                      ? (<Redirect to={`/users/${currentUser._id}`} />)
                      : (<LoginRegister onLoginSuccess={this.handleLoginSuccess} />)
                  )}
                />

                {/* REQUIRE LOGIN FOR ALL OTHER ROUTES */}
                <Route
                  exact
                  path="/"
                  render={() => (
                    currentUser
                      ? (<Typography>Welcome to PhotoShare!</Typography>)
                      : (<Redirect to="/login-register" />)
                  )}
                />

                <Route
                  path="/users/:userId"
                  render={(props) => (
                    currentUser
                      ? (<UserDetail {...props} changeMainContent={this.changeMainContent} />)
                      : (<Redirect to="/login-register" />)
                  )}
                />

                <Route
                  path="/photos/:userId"
                  render={(props) => (
                    currentUser
                      ? (
                        <UserPhotos
                          {...props}
                          changeMainContent={this.changeMainContent}
                          photoRefreshToken={this.state.photoRefreshToken}
                        />
                      )
                      : (<Redirect to="/login-register" />)
                  )}
                />

                {/* DEFAULT: redirect to login */}
                <Redirect to="/login-register" />

              </Switch>
            </Paper>
          </Grid>
        </Grid>
      </HashRouter>
    );
  }
}

ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp')
);
