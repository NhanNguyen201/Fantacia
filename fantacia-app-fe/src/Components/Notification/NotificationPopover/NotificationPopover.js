import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// mui
import Popover from '@material-ui/core/Popover';
import NotificationsIcon from '@material-ui/icons/Notifications';

// component
import Notifications from '../Notifications/Notifications';

// my util
import MyRoundBtn from '../../../Util/MyRoundBtn';
import MyNotificationBagde from '../../../Util/MyNotificationBagde';
import { markNotificationsRead } from '../../../Redux/actions/userActions'
const NotificationPopover = ({notifications, markNotificationsRead}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    var unreadNoti = [], notificationsClone = [];
    useEffect(() => {
        notifications.forEach(each => {
            notificationsClone.push(each);
            if (each.read === false) unreadNoti.push(each.notificationId)
        } )
        // eslint-disable-next-line
    })

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        if(unreadNoti.length > 0){
            markNotificationsRead(unreadNoti)
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'NotificationPopover' : undefined;
    return (
        <>
            <MyRoundBtn tip="Notification" onClick={handleClick}>
                <MyNotificationBagde notifications={notifications}>
                    <NotificationsIcon style={{color: "white"}}/>
                </MyNotificationBagde>
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
                className="notification-popover"
            >
                <Notifications notifications={notificationsClone}/>
            </Popover>
        </>
    )
}

NotificationPopover.propTypes = {
    notifications: PropTypes.array.isRequired,
    markNotificationsRead: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    notifications: state.user.notifications
})
export default connect(mapStateToProps, {markNotificationsRead})(NotificationPopover)