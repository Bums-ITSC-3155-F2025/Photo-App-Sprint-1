import React from 'react';
import axios from 'axios';
import './loginRegister.css';

axios.defaults.withCredentials = true; // REQUIRED for session cookies

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Login fields
      login_name: '',
      login_password: '',
      loginError: '',

      // Registration fields
      reg_login_name: '',
      reg_first_name: '',
      reg_last_name: '',
      reg_location: '',
      reg_description: '',
      reg_occupation: '',
      reg_password: '',
      reg_password2: '',
      regError: '',
      regSuccess: ''
    };
  }

  /* ---------------- LOGIN ---------------- */
  handleLogin = (event) => {
    event.preventDefault();

    axios.post('/admin/login', {
      login_name: this.state.login_name,
      password: this.state.login_password
    })
      .then((res) => {
        this.setState({ loginError: '' });
        this.props.onLoginSuccess(res.data);

        // Redirect to user details
        window.location = `#/users/${res.data._id}`;
      })
      .catch(() => {
        this.setState({ loginError: 'Invalid login name or password.' });
      });
  };

  /* ---------------- REGISTER ---------------- */
  handleRegister = (event) => {
    event.preventDefault();

    const s = this.state;

    if (s.reg_password !== s.reg_password2) {
      this.setState({
        regError: 'Passwords do not match.',
        regSuccess: ''
      });
      return;
    }

    axios.post('/user', {
      login_name: s.reg_login_name,
      password: s.reg_password,
      first_name: s.reg_first_name,
      last_name: s.reg_last_name,
      location: s.reg_location,
      description: s.reg_description,
      occupation: s.reg_occupation
    })
      .then(() => {
        this.setState({
          regError: '',
          regSuccess: 'Registration successful! You may now login.',
          reg_login_name: '',
          reg_first_name: '',
          reg_last_name: '',
          reg_location: '',
          reg_description: '',
          reg_occupation: '',
          reg_password: '',
          reg_password2: ''
        });
      })
      .catch((err) => {
        const msg = err.response?.data || 'Registration failed.';
        this.setState({ regError: msg, regSuccess: '' });
      });
  };

  /* ---------------- RENDER ---------------- */
  render() {
    return (
      <div className="login-register-container">
        <h1>Login / Register</h1>

        {/* LOGIN FORM */}
        <div className="login-section">
          <h2>Login</h2>
          <form onSubmit={this.handleLogin}>
            <div>
              <label>Login Name</label>
              <input
                type="text"
                value={this.state.login_name}
                onChange={(e) => this.setState({ login_name: e.target.value })}
                required
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                value={this.state.login_password}
                onChange={(e) => this.setState({ login_password: e.target.value })}
                required
              />
            </div>

            {this.state.loginError && (
              <div className="error-msg">{this.state.loginError}</div>
            )}

            <button type="submit">Log In</button>
          </form>
        </div>

        <hr />

        {/* REGISTRATION FORM */}
        <div className="register-section">
          <h2>Register New User</h2>

          <form onSubmit={this.handleRegister}>
            <div>
              <label>Login Name *</label>
              <input
                type="text"
                value={this.state.reg_login_name}
                onChange={(e) => this.setState({ reg_login_name: e.target.value })}
                required
              />
            </div>

            <div>
              <label>First Name *</label>
              <input
                type="text"
                value={this.state.reg_first_name}
                onChange={(e) => this.setState({ reg_first_name: e.target.value })}
                required
              />
            </div>

            <div>
              <label>Last Name *</label>
              <input
                type="text"
                value={this.state.reg_last_name}
                onChange={(e) => this.setState({ reg_last_name: e.target.value })}
                required
              />
            </div>

            <div>
              <label>Location</label>
              <input
                type="text"
                value={this.state.reg_location}
                onChange={(e) => this.setState({ reg_location: e.target.value })}
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                rows="3"
                value={this.state.reg_description}
                onChange={(e) => this.setState({ reg_description: e.target.value })}
              />
            </div>

            <div>
              <label>Occupation</label>
              <input
                type="text"
                value={this.state.reg_occupation}
                onChange={(e) => this.setState({ reg_occupation: e.target.value })}
              />
            </div>

            <div>
              <label>Password *</label>
              <input
                type="password"
                value={this.state.reg_password}
                onChange={(e) => this.setState({ reg_password: e.target.value })}
                required
              />
            </div>

            <div>
              <label>Confirm Password *</label>
              <input
                type="password"
                value={this.state.reg_password2}
                onChange={(e) => this.setState({ reg_password2: e.target.value })}
                required
              />
            </div>

            {this.state.regError && (
              <div className="error-msg">{this.state.regError}</div>
            )}

            {this.state.regSuccess && (
              <div className="success-msg">{this.state.regSuccess}</div>
            )}

            <button type="submit">Register Me</button>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginRegister;
