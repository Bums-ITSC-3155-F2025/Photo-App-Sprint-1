import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  HashRouter, Route, Switch
} from 'react-router-dom'; // ✅ change: use Switch, not Routes
import {
  Grid, Typography, Paper
} from '@mui/material';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      main_content: undefined
    };
    this.changeMainContent = this.changeMainContent.bind(this);
  }

  changeMainContent = (main_content) => {
    this.setState({ main_content });
  };

  render() {
    return (
      <HashRouter>
        <div>
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
                        Welcome to your photosharing app! This{' '}
                        <a href="https://mui.com/components/paper/">Paper</a>{' '}
                        component displays the main content of the application.
                      </Typography>
                    )}
                  />
                  <Route
                    path="/users/:userId"
                    render={(props) => (
                      <UserDetail
                        {...props}
                        changeMainContent={this.changeMainContent}
                      />
                    )}
                  />
                  <Route
                    path="/photos/:userId"
                    render={(props) => (
                      <UserPhotos
                        {...props}
                        changeMainContent={this.changeMainContent}
                      />
                    )}
                  />
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
    );
  }
}

const container = document.getElementById('photoshareapp');
const root = createRoot(container);
root.render(<PhotoShare />);
