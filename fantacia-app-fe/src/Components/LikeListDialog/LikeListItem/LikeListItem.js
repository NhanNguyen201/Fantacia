import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
//mui
import PersonIcon from '@material-ui/icons/Person';
import Paper from '@material-ui/core/Paper';
import './LikeListItem.scss';
export const LikeListItem = ({likeItem, friendList}) => {
    const { userName, userImage, bio} = likeItem;
    const isFriend = friendList.includes(userName);
    return (
        <div className='likeList-item'>
            <div className='like-info'>
                <img src={userImage} className='like-info-avatar' alt='user'/>
                <Link to={`/user/${userName}`} className='like-info-like'><b>{bio}</b></Link>
            </div>        
            {isFriend && 
                (<Paper elevation={4} className='isFriend-paper'>
                    <PersonIcon fontSize='large' color="primary"/>
                    <p>Friend</p>
                </Paper>)
            }
        </div>
    )
}

const mapStateToProps = (state) => ({
    friendList: state.user.friendList
})
LikeListItem.propTypes = {
    likeItem: PropTypes.object.isRequired,
    friendList: PropTypes.array.isRequired
}
export default connect(mapStateToProps, null)(LikeListItem)
