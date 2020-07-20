import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
//mui
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Paper from '@material-ui/core/Paper';

import './NotificationPaper.scss'
const NotificationPaper = ({notification}) => {
    const { createdAt, sender, senderBio, senderImage, type } = notification;
    var paper;
    if(type === 'hidLike') {
        paper = (
            <Paper variant="outlined" className='notification-paper' component={Link} to={`/group/${notification.groupId}/hid/${notification.hidId}`}>
                <img src={senderImage} className="sender-avatar" alt='avatar'/>
                <div className="sender-info">
                    <p><Link to={`/user/${sender}`} className='sender-link'>{senderBio}</Link> has liked your hid</p>
                    <small><AccessTimeIcon color='primary' className='clock-icon' fontSize='small'/>  {createdAt}</small>
                </div>
            </Paper>
        )
    } else if (type === 'hidComment'){
        paper = (
            <Paper variant="outlined" className='notification-paper' component={Link} to={`/group/${notification.groupId}/hid/${notification.hidId}`}>
                <img src={senderImage} className="sender-avatar" alt='avatar'/>
                <div className="sender-info">
                    <p><Link to={`/user/${sender}`} className='sender-link'>{senderBio}</Link> has commented on your hid</p>
                    <small><AccessTimeIcon color='primary' className='clock-icon' fontSize='small'/>  {createdAt}</small>
                </div>
            </Paper>
        )
    } else if(type === 'statusLike'){
        paper = (
            <Paper variant="outlined" className='notification-paper' component={Link} to={`/user/hid/${notification.hidId}`}>
                <img src={senderImage} className="sender-avatar" alt='avatar'/>
                <div className="sender-info">
                    <p><Link to={`/user/${sender}`} className='sender-link'>{senderBio}</Link> has liked your status</p>
                    <small><AccessTimeIcon color='primary' className='clock-icon' fontSize='small'/>  {createdAt}</small>
                </div>
            </Paper>
        )
    } else if(type === 'statusComment'){
        paper = (
            <Paper variant="outlined" className='notification-paper' component={Link} to={`/user/hid/${notification.hidId}`}>
                <img src={senderImage} className="sender-avatar" alt='avatar'/>
                <div className="sender-info">
                    <p><Link to={`/user/${sender}`} className='sender-link'>{senderBio}</Link> has commented on your status</p>
                    <small><AccessTimeIcon color='primary' className='clock-icon' fontSize='small'/>  {createdAt}</small>
                </div>
            </Paper>
        )
    } else if(type === 'userLike') {
        paper = (
            <Paper variant="outlined" className='notification-paper'>
                <img src={senderImage} className="sender-avatar" alt='avatar'/>
                <div className="sender-info">
                    <p><Link to={`/user/${sender}`} className='sender-link'>{senderBio}</Link> has liked you</p>
                    <small><AccessTimeIcon color='primary' className='clock-icon' fontSize='small'/>  {createdAt}</small>
                </div>
            </Paper>
        )
    } else if (type === 'avatarLike'){
        paper = (
            <Paper variant="outlined" className='notification-paper' component={Link} to={`/user/hid/${notification.hidId}`}>
                <img src={senderImage} className="sender-avatar" alt='avatar'/>
                <div className="sender-info">
                    <p><Link to={`/user/${sender}`} className='sender-link'>{senderBio}</Link> has liked your avatar</p>
                    <small><AccessTimeIcon color='primary' className='clock-icon' fontSize='small'/>  {createdAt}</small>
                </div>
            </Paper>
        )
    } else if(type === 'avatarComment'){
        paper = (
            <Paper variant="outlined" className='notification-paper' component={Link} to={`/user/hid/${notification.hidId}`}>
                <img src={senderImage} className="sender-avatar" alt='avatar'/>
                <div className="sender-info">
                    <p><Link to={`/user/${sender}`} className='sender-link'>{senderBio}</Link> has commented on your avatar</p>
                    <small><AccessTimeIcon color='primary' className='clock-icon' fontSize='small'/>  {createdAt}</small>
                </div>
            </Paper>
        )
    }
    else if(type === 'friendRequest') {
        paper = (
            <Paper variant="outlined" className='notification-paper'>
                <img src={senderImage} className="sender-avatar" alt='avatar'/>
                <div className="sender-info">
                    <p><Link to={`/user/${sender}`} className='sender-link'>{senderBio}</Link> has sended you a friend request</p>
                    <small><AccessTimeIcon color='primary' className='clock-icon' fontSize='small'/>  {createdAt}</small>
                </div>
            </Paper>
        )
    } else paper = null;
    return paper;
}

NotificationPaper.propTypes = {
    notification: PropTypes.object.isRequired
}
export default NotificationPaper;
