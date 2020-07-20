import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// mui
import Popover from '@material-ui/core/Popover';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

// component
import Requests from '../Requests/FriendRequests';

// my util
import MyRoundBtn from '../../../Util/MyRoundBtn';
import MyFriendRequestBadge from '../../../Util/MyFriendRequestBadge';
import { markFriendRequestRead } from '../../../Redux/actions/userActions'
const FriendRequestPopover = ({friendRequests, markFriendRequestRead}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    var unreadReq = [], requestClone = [];
    useEffect(() => {
        friendRequests.forEach(each => {
            requestClone.push(each);
            if (each.read === false) unreadReq.push(each.requestId)
        } )
        // eslint-disable-next-line
    })

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        if(unreadReq.length > 0){
            markFriendRequestRead(unreadReq)
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'FriendRequestPopover' : undefined;
    return (
        <>
            <MyRoundBtn tip="Your Friend Request" onClick={handleClick}>
                <MyFriendRequestBadge friendRequests={friendRequests}>
                    <PersonAddIcon style={{color: "white"}}/>
                </MyFriendRequestBadge>
            </MyRoundBtn>
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
                className="friend-request-popover"
            >
                <Requests requests={requestClone}/>
            </Popover>
        </>
    )
}

FriendRequestPopover.propTypes = {
    friendRequests: PropTypes.array.isRequired,
    markFriendRequestRead: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    friendRequests: state.user.friendRequests
})
export default connect(mapStateToProps, {markFriendRequestRead})(FriendRequestPopover)