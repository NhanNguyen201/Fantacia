import React from 'react';
import MySquareBtn from '../../../Util/MySquareBtn';
import PropTypes from 'prop-types';
// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { likeHid, unlikeHid } from '../../../Redux/actions/dataActions';
import { connect } from 'react-redux';
const LikeBtn = ({user, hidId, likeHid, unlikeHid}) => {
    const likedHid = () => {
        if(user.likes && user.likes.find(like => like.hidId === hidId)){ 
            return true 
        } else return false
    }
    const likeAction = () => likeHid(hidId);
    const unlikeAction = () => unlikeHid(hidId);
    const likeBtn = likedHid() ?(
        <MySquareBtn tip="Undo like" onClick={unlikeAction}>
            <FavoriteIcon color="secondary" />
            Liked
        </MySquareBtn>
    ) : (
        <MySquareBtn tip="Like" onClick={likeAction}>
            <FavoriteBorder color="secondary" />
            Like
        </MySquareBtn>
    );
    return likeBtn;
}
LikeBtn.propTypes = {
    user: PropTypes.object.isRequired,
    hidId: PropTypes.string.isRequired,
    likeHid: PropTypes.func.isRequired,
    unlikeHid: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps, {likeHid, unlikeHid})(LikeBtn)