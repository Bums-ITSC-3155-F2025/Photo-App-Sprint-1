import React from 'react';
import {
  AppBar, Toolbar, Typography
} from '@mui/material';
import './TopBar.css';

/**
 * Define TopBar, a React componment of project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      app_info: undefined
    };
  }
  componentDidMount() {
    this.handleAppInfoChange();
  }

  handleAppInfoChange(){
    const app_info = this.state.app_info;
    if (app_info === undefined){
        fetchModel("/test/info")
            .then((response) =>
            {
                this.setState({
                    app_info: response.data
                });
            });
    }
  }
  render() {
    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" color="inherit">
              This is the TopBar component
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;

