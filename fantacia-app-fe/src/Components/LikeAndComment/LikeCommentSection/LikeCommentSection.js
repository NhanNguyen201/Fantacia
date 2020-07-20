import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LikeBtn from '../LikeButton/LikeBtn';
import MySquareBtn from '../../../Util/MySquareBtn';
import { getOneHid } from '../../../Redux/actions/dataActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Comment from '../Comment/Comment';
import CommentInput from '../CommentInput/CommentInput';
import './LikeCommentSection.scss'
const LikeCommentSection = ({ hidId, comments, getOneHid, ui, openComment }) => {

    const [ expand, setExpand ] = useState(false);
    const [ commentList, setCommentList ] = useState([]);

    useEffect(() => {
        if(comments && comments.length > 0) setCommentList(comments)
        if(openComment) setExpand(true)
    },[comments, openComment])

    const handleExpand = () => {
        setExpand(!expand);
        if(!expand) getOneHid(hidId);
    }
    
    return (
        <div className="like-comment-section">
            <div className="like-comment-btn-section">
                <LikeBtn hidId={hidId}/>
                <MySquareBtn tip="Comment this hid" onClick={handleExpand}>Comment</MySquareBtn>
            </div>
            {expand && (
                <div className="comments-section">
                    <hr/>
                    <CommentInput hidId={hidId}/>
                    {(ui.loading && ui.target === hidId) && <div style={{textAlign: "center"}}><CircularProgress color="primary"/></div>}
                    {commentList.map(eachComment => <Comment comment={eachComment} key={eachComment.commentId}/>)}
                </div>  
            )}
        </div>
    )
}
LikeCommentSection.propTypes = {
    hidId: PropTypes.string.isRequired,
    comments: PropTypes.array,
    getOneHid: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    ui: state.UI
})

export default connect(mapStateToProps, {getOneHid})(LikeCommentSection)