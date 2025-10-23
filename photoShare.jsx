import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Grid, Typography, Paper } from '@mui/material';
import './styles/main.css';

// Import components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      main_content: undefined,
    };
    this.changeMainContent = this.changeMainContent.bind(this);
  }

  changeMainContent(main_content) {
    this.setState({ main_content });
  }

  render() {
    return (
      <HashRouter>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <TopBar main_content={this.state.main_content} />
          </Grid>

          <div className="main-topbar-buffer" />

          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList />
            </Paper>
          </Grid>

          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => (
                    <Typography variant="body1">
                      Welcome to your photosharing app! This <a href="https://mui.com/components/paper/">Paper</a> component
                      displays the main content. You can delete this route once you implement user routes.
                    </Typography>
                  )}
                />
                <Route
                  path="/users/:userId"
                  render={props => <UserDetail {...props} changeMainContent={this.changeMainContent} />}
                />
                <Route
                  path="/photos/:userId"
                  render={props => <UserPhotos {...props} changeMainContent={this.changeMainContent} />}
                />
              </Switch>
            </Paper>
          </Grid>
        </Grid>
      </HashRouter>
    );
  }
}

// Render using React 17
ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp')
);
