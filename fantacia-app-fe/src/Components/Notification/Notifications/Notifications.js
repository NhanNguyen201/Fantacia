import React from 'react';
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import NotificationPaper from '../NotificatioinPaper/NotificationPaper';
import Paper from '@material-ui/core/Paper';
const Notifications = ({notifications}) => {
    const notificationsMarkup = notifications.length > 0 
    ? notifications.map(each => <NotificationPaper notification={each} key={each.notificationId}/>)
    : <Paper style={{boxSizing: "border-box", padding: "20px"}}>You have no notification yet</Paper>
    return(
        <div className="notifications-container" style={{width: "400px", padding: "10px 0", maxHeight: '500px'}}>
            <Typography variant="body1" style={{padding: "0 20px"}}>Notifications:</Typography>
            {notificationsMarkup}
        </div>
    )
}
Notifications.propTypes = {
    notifications: PropTypes.array
}
export default Notifications;