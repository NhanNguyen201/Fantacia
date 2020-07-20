import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// MUI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
import PublicIcon from '@material-ui/icons/Public';
import AppAvatar from '../../Img/fantacia.png'
// my util
import MyRoundBtn from '../../Util/MyRoundBtn';
// component
import FriendRequestPopover from '../FriendRequest/FriendRequestPopover/FriendRequestPopover';
import NotificationPopover from '../Notification/NotificationPopover/NotificationPopover';
// redux
import { connect } from 'react-redux';
import { logoutUser } from '../../Redux/actions/userActions';

import './Navbar.scss'
const Navbar = ({ authenticated, user, logoutUser}) => {
    return (
        <AppBar>
            <Toolbar className="nav-container">
                {authenticated ? (
                    <div className="nav-icon-container">
                        <img src={AppAvatar} alt="app avtar" className="app-icon"/>
                        <div className="nav-router-container">
                            {user.credentials.imageUrl && <img src={user.credentials.imageUrl} alt="user avatar" className="user-icon"/>}
                            {user.credentials.bio && <Link to='/user'style={{color: "white"}}><b>{user.credentials.bio}</b></Link>}                            
                            <Link to="/groups">
                                <MyRoundBtn tip="Join a new group" btnClassName="route-link">
                                    <PublicIcon/>
                                </MyRoundBtn>
                            </Link>
                            <Link to="/">
                                <MyRoundBtn tip="Home" btnClassName="route-link">
                                    <HomeIcon/>
                                </MyRoundBtn>
                            </Link>
                            <FriendRequestPopover/>
                            <NotificationPopover/>
                            <MyRoundBtn tip="Logout" onClick={logoutUser} btnClassName="route-link">
                                <KeyboardReturn />
                            </MyRoundBtn>
                        </div>
                    </div>
                ) : (
                    <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/signup">Signup</Button>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    )
}
Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    logoutUser: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    authenticated: state.user.authenticated,
    user: state.user
})
export default connect(mapStateToProps, {logoutUser})(Navbar);