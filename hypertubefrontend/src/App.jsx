import React ,{useState, useEffect}from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './component/login/login';
import Home from './component/movie/homepage';
import Forgotpassword from './component/resetpasswort/forgotpassword';
import Register from './component/register/register';
import Resetpassword from './component/password/password';
import Editprofile from './component/profile/profile';
import AuthService from "./services/auth.service";
import Searching from './component/movie/searching';
import Popular from './component/movie/popularm';


function App() {
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
    
        if (user) {
          setCurrentUser(user);

        }
      }, []);

      const logOut = () => {
        AuthService.logout();
      };

      return (
        <Router>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav mr-auto">
                <h1  className="text-danger" >HyperTube</h1>
              {currentUser && (
                <li className="nav-item">
                  <Link to={"/homepage"} className="nav-link">
                    Homepage
                  </Link>
                </li>
              )}
            </div>
    
            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/popularm"} className="nav-link">
                    Popular
                  </Link>
                </li>
                 <li className="nav-item">
                  <Link to={"/"} className="nav-link">
                    watched
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/searching"} className="nav-link">
                    Search
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={logOut}>
                    LogOut
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>
    
                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </div>
            )}
          </nav>
    
          <div className="container mt-3">
            <Switch>
              <Route exact path="/homepage" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/forgotpassword" component={Forgotpassword } />
              <Route path="/password" component={Resetpassword} />
              <Route path="/profile" component={ Editprofile} />
              <Route path="/searching" component={Searching} />
              <Route path="/popularm" component={Popular} />

            </Switch>
          </div>
        </Router>
      );

}

export default App