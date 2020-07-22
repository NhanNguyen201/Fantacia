import React from 'react';
import PropTypes from 'prop-types';
//mui
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SendIcon from '@material-ui/icons/Send';
import HowToRegIcon from '@material-ui/icons/HowToReg';

import MyRoundBtn from '../../Util/MyRoundBtn';
import MySquareBtn from '../../Util/MySquareBtn';
import { connect } from 'react-redux'; 
import AcceptAndDenyBtn from '../AcceptAndDenyBtn/AcceptAndDenyBtn';
import { likeUser, unlikeUser, sendFriendRequest } from '../../Redux/actions/dataActions'
import './OtherUserBanner.scss';
const  OtherUserBanner = ({currentUser, uiLoading, likeUser, unlikeUser, sendFriendRequest}) => {
    const { isLiked, isRequested, isFriend, isRequestToUs, userInfo } = currentUser;
    const likeThisUser = () => {
        if(!uiLoading) likeUser(userInfo.userName)
    }
    const unlikeThisUser = () => {
        if(!uiLoading) unlikeUser(userInfo.userName)
    }
    const sendThisFriendReq = () => {
        if(!uiLoading) sendFriendRequest(userInfo.userName)
    }
    const likeMarkup = isLiked 
        ? <MyRoundBtn tip="Liked" onClick={unlikeThisUser} btnClassName="user-like-btn"><FavoriteIcon color="secondary"/></MyRoundBtn>
        : <MyRoundBtn tip="Like this user" onClick={likeThisUser} btnClassName="user-like-btn"><FavoriteBorderIcon color="secondary"/></MyRoundBtn>
    const friendMarkup = isFriend 
        ? <MySquareBtn tip="Friend" btnClassName="user-friend-btn"><HowToRegIcon color="secondary" /> Friend</MySquareBtn>
        : ( isRequested
            ? <MySquareBtn tip="Friend request sended" btnClassName="user-friend-btn"><SendIcon color="secondary"/> Friend request sended</MySquareBtn>
            : ( isRequestToUs 
                ? <AcceptAndDenyBtn/>
                : <MySquareBtn tip="Friend request sended" btnClassName="user-friend-btn" onClick={sendThisFriendReq}><PersonAddIcon color="secondary" /> Add Friend </MySquareBtn>
            )
        )
    return(
        <div className="other-user-banner">
            <>
                <div className="user-info">
                    {userInfo && <img src={userInfo.imageUrl} alt="userAvatar" className="user-avatar"/>}
                    {userInfo && <p className="user-bio">{userInfo.bio}</p>}
                </div>
                <div className="icon-container">
                    {likeMarkup}
                    {friendMarkup}
                </div>
            </>
        </div>
    )
}
OtherUserBanner.propTypes = {
    currentUser: PropTypes.object.isRequired,
    uiLoading: PropTypes.bool.isRequired,
    likeUser: PropTypes.func.isRequired,
    unlikeUser: PropTypes.func.isRequired,
    sendFriendRequest: PropTypes.func.isRequired,

}
const mapStateToProp = state => ({
    currentUser: state.data.focusPerson,
    uiLoading: state.UI.loading
})
export default connect(mapStateToProp, {likeUser, unlikeUser, sendFriendRequest})(OtherUserBanner)