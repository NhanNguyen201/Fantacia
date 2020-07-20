import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submitComment } from '../../../Redux/actions/dataActions';
import TextField from '@material-ui/core/TextField';
import './CommentInput.scss';
const CommentInput = ({submitComment, user, ui, hidId}) => {
    const [commentBody, setCommentBody ] = useState('');
    const [error, setError] = useState(null)
    
    const handleSubmit = e =>{
        e.preventDefault();
        if(!ui.loading) submitComment(hidId, {body: commentBody})
    }

    useEffect(() => {
        if(ui.errors) setError(ui.errors.data.comment)
        if(!ui.errors) setError(null)
        if(!ui.errors && !ui.loading) setCommentBody('')
    }, [ui])

    return(
        <div className="comment-input-container">
            {user.imageUrl && <img alt="userAvatar" src={user.imageUrl} className="comment-input-avatar"/>}
            <form onSubmit={handleSubmit}>
                <TextField
                    name={hidId}
                    type="text"
                    label="Comment on this hid"
                    error={error ? true : false }
                    helperText={error}
                    value={commentBody}
                    onChange={e => setCommentBody(e.target.value)}
                    fullWidth
                    className="comment-input-textfield"
                />
            </form>
        </div>
    )
}
CommentInput.propTypes = {
    user: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    submitComment: PropTypes.func.isRequired,
    hidId: PropTypes.string.isRequired
}
const mapStateToProps = state => ({
    user: state.user.credentials,
    ui: state.UI
})

export default connect(mapStateToProps, {submitComment})(CommentInput)