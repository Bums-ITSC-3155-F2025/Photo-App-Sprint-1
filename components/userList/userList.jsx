import React from 'react';
import fetchModel from '../../lib/fetchModelData.js';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
}
from '@mui/material';
import './userList.css';

/**
 * Define UserList, a React component of project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: undefined,
    };
  }
  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers() {
    fetchModel('/user/list').then((response) => {
      this.setState({ users: response.data });
    });
  }

  activeUserId() {
    const hash = window.location.hash || '';
    // Match either #/users/:id or #/photos/:id
    const match = hash.match(/#\/(?:users|photos)\/([^/]+)/);
    return match ? match[1] : undefined;
  }
  render() {
    const { users } = this.state;
    const activeId = this.activeUserId();

    return (
      <div className="user-list">
        <div className="user-list__header">Users</div>
        <div className="user-list__items">
          <List component="nav" disablePadding>
            {users && users.map((u, idx) => (
              <React.Fragment key={u._id}>
                <li className={`user-list__item ${activeId === u._id ? 'is-active' : ''}`}>
                  <a className="user-list__link" href={`#/users/${u._id}`}>
                    <span className="user-list__avatar" aria-hidden>
                      {u.first_name?.[0]}{u.last_name?.[0]}
                    </span>
                    <span className="user-list__meta">
                      <span className="user-list__name">{u.first_name} {u.last_name}</span>
                      <span className="user-list__sub">{u.occupation}</span>
                    </span>
                  </a>
                </li>
                {idx < users.length - 1 && <Divider component="div" />}
              </React.Fragment>
            ))}
            {!users && (
              <ListItem>
                <ListItemText primary="Loading users..." />
              </ListItem>
            )}
          </List>
        </div>
      </div>
    );
  }
}

export default UserList;
