import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';
import './TopBar.css';
import fetchModel from '../../lib/fetchModelData';

// Set your name for the left side of the TopBar
const AUTHOR_NAME = 'Team Bums';

/**
 * TopBar - shows app title, your name (left), and context + version (right)
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      app_info: undefined,
    };
  }

  componentDidMount() {
    this.fetchAppInfo();
  }

  fetchAppInfo() {
    if (!this.state.app_info) {
      fetchModel('/test/info')
        .then((response) => {
          this.setState({ app_info: response.data });
        })
        .catch(() => {
          // leave app_info undefined on error; keep UI functional
        });
    }
  }

  render() {
    const { main_content } = this.props;
    const version = this.state.app_info ? this.state.app_info.__v : undefined;

    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar className="topbar-container">
          <Box className="topbar-left">
            <Typography variant="h6" color="inherit">
              {AUTHOR_NAME}
            </Typography>
          </Box>
          <Box className="topbar-right">
            {main_content && (
              <Typography variant="subtitle1" color="inherit">
                {main_content}
              </Typography>
            )}
            {version !== undefined && (
              <Typography variant="caption" color="inherit" style={{ marginLeft: 8 }}>
                v{version}
              </Typography>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
}

TopBar.propTypes = {
  main_content: PropTypes.string,
};

export default TopBar;

