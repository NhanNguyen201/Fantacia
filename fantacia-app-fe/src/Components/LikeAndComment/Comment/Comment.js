import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { emojify } from 'react-emojione';
import MyTime from '../../../Util/MyTime'
import './Comment.scss';
const Comment = ({comment: {body, bio, userImage, userName, createdAt}}) => {
    return (
        <div className="comment-paper">
            <img src={userImage} alt="comment-user-avatar" className="comment-avatar"/>
            <div className="comment-content">
                <p className="comment-body"><Link to={`/user/${userName}`} className="comment-link">{bio}</Link>  {emojify(body)}</p>
                <small><MyTime createdAt={createdAt}/></small>
            </div>
        </div>        
    )
}
Comment.propTypes = {
    comment: PropTypes.object.isRequired
}
export default Comment;

