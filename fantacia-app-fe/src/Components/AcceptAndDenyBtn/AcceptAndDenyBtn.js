import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
// mui
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
//redux
import { answerFriendRequest } from '../../Redux/actions/dataActions';
// component
import MySquareBtn from '../../Util/MySquareBtn';

import './AcceptAndDenyBtn.scss'
const AcceptAndDenyBtn = ({friendRequests, focusPerson, answerFriendRequest}) => {
    const request = friendRequests.find(req => req.sender === focusPerson.userInfo.userName)
    // console.log(request.requestId);
    const acceptReq = () => {
        if(request){
            answerFriendRequest(request.requestId, "accept", request.sender, focusPerson.userInfo.userName)
        }
    }
    const denyReq = () => {
        if(request){
            answerFriendRequest(request.requestId, "deny", request.sender, focusPerson.userInfo.userName)
        }
    }
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <Button color="primary" onClick={handleOpen} variant="outlined">
                Answer send request
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >   
                <div className="answer-btn-container">
                    <MySquareBtn tip="Accept friend request" onClick={acceptReq}>
                        <CheckIcon color="primary" fontSize="large"/>
                        Accept
                    </MySquareBtn>
                </div>
                <div className="answer-btn-container">
                    <MySquareBtn tip="Deny friend request" onClick={denyReq}>
                        <ClearIcon color="secondary" fontSize="large"/>
                        Deny
                    </MySquareBtn>
                </div>
            </Popover>
        </div>
    )
}

const mapStateToProps = (state) => ({
    focusPerson: state.data.focusPerson,
    friendRequests : state.user.friendRequests
})

const mapDispatchToProps = {
    answerFriendRequest
}
AcceptAndDenyBtn.propTypes = {
    answerFriendRequest: PropTypes.func.isRequired,
    focusPerson: PropTypes.object,
    friendRequests: PropTypes.array

}
export default connect(mapStateToProps, mapDispatchToProps)(AcceptAndDenyBtn)
