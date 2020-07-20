import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
//component
import { 
    home,
    login, 
    signup, 
    joinGroup,
    groupPage,
    userPage,
    otherUserPage,
    errorPage
} from './Pages';
import Navbar from './Components/Navbar/Navbar';
import AuthRoute from './Util/AuthRoute';
import ProtectedRoute from './Util/ProtectedRoute';
//Redux
import { Provider } from 'react-redux';
import store from './Redux/store';
import { SET_AUTHENTICATED } from './Redux/types';
import { logoutUser,getUserData } from './Redux/actions/userActions';
//MUi
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeFile from './Util/theme';
import './App.css';
import axios from 'axios';

const theme = createMuiTheme(themeFile);
const token = localStorage.FBIdToken;

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

if (token){
  const decodedToken = jwtDecode(token);
  if((decodedToken.exp * 1000) < Date.now()){
    store.dispatch(logoutUser())
    window.location.href = '/login';
  } else {
    store.dispatch({type: SET_AUTHENTICATED});
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData())
  }
}
class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={home} />
                <AuthRoute exact path="/login" component={login}/>
                <AuthRoute exact path="/signup" component={signup}/>
                <ProtectedRoute exact path="/groups" component={joinGroup}/>
                <ProtectedRoute exact path="/user" component={userPage}/>
                <ProtectedRoute exact path="/user/hid/:hidId" component={userPage}/>
                <ProtectedRoute exact path="/group/:group" component={groupPage}/>
                <ProtectedRoute exact path="/group/:group/hid/:hidId" component={groupPage}/>
                <ProtectedRoute exact path="/user/:userName" component={otherUserPage}/>
                <ProtectedRoute axact path="/user/:userName/hid/:hidId" component={otherUserPage}/>
                <Route component={errorPage}/>
              </Switch>
            </div>
          </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
