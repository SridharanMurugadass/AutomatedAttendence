import React from 'react';
import ReactDOM from 'react-dom';
import CameraPage from './components/CameraPage.jsx';
import Student from './components/Student.jsx';
import Admin from './components/Admin.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import AddStudent from './components/AddStudent.jsx';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false
    };
  }

  render () {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-inverse navbar-fixed-top">
            <div className="container">
              <div className="navbar-header">
                <Link to="/" className="navbar-brand" >Automated Attendance</Link>
              </div>

              <div id="navbar" className="navbar-collaspe">
                <ul className="nav navbar-nav navbar-right">
                  <li><Link to="/Student">Student</Link></li>
                  <li><Link to="/Admin">Admin</Link></li>
                  <li><Link to="/CameraPage">CameraPage</Link></li>
                  <li><a href="/login">Log In</a></li>
                  <li><Link to="/About">About</Link></li>
                  <li><Link to="/Contact">Contact</Link></li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="container">
            This is text on the page.
          </div>
          <div>
            <Route path="/Student" component={Student}/>
            <Route path="/CameraPage" component={CameraPage}/>
            <Route path="/Admin" component={Admin}/>
            <Route path="/About" component={About}/>
            <Route path="/Contact" component={Contact}/>
            <Route path="/AddStudent" component={AddStudent}/>
          </div>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
