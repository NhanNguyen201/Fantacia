import React from 'react';
import PropTypes from 'prop-types'

import {Link} from 'react-router-dom'
// redux
import { connect } from 'react-redux';
import { answerFriendRequest } from '../../../Redux/actions/dataActions';

//mui
import Button from '@material-ui/core/Button';

import './RequestPaper.scss'
const RequestPaper = ({answerFriendRequest, friendRequest, uiLoading, focusPerson }) => {
    const {requestId, sender, senderBio, senderImage} = friendRequest;

    const acceptReq = () => {
        let currentFocusUserName = null; 
        if(focusPerson && focusPerson.userInfo) currentFocusUserName = focusPerson.userInfo.userName  
        answerFriendRequest(requestId, "accept", sender, currentFocusUserName)
    }
    const denyReq = () => {
        let currentFocusUserName = null; 
        if(focusPerson && focusPerson.userInfo) currentFocusUserName = focusPerson.userInfo.userName  
        answerFriendRequest(requestId, "deny", sender, currentFocusUserName)
    }
    return (
        <div className="friend-request-paper">
            <div className="sender-info">
                <img alt="senderAvatar" src={senderImage} className="sender-avatar"/>
                <Link to={`/user/${sender}`} className="sender-link">{senderBio}</Link>
            </div>
            <div className="answers">
                <Button color="primary" variant="outlined" onClick={acceptReq} disabled={uiLoading} className='answer-btn'>
                    Accept
                </Button>
                <Button color="secondary" variant="outlined" onClick={denyReq} disabled={uiLoading} className='answer-btn'>
                    Deny
                </Button>
            </div>
        </div>
    )
}
RequestPaper.propTypes = {
    answerFriendRequest: PropTypes.func.isRequired,
    friendRequest: PropTypes.object.isRequired,
    focusPerson: PropTypes.object,
    uiLoading: PropTypes.bool.isRequired
}
const mapStateToProps = state => ({
    focusPerson: state.data.focusPerson,
    uiLoading: state.UI.loading
})
export default connect(mapStateToProps, {answerFriendRequest})(RequestPaper)