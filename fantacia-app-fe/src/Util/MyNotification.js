import React from 'react';
import Badge from '@material-ui/core/Badge';

export default ({ children, notifications }) => {
    var unreadNotifications = notifications.filter(noti => noti.read === false)
    return (
        <Badge badgeContent={unreadNotifications.length} color="secondary">
            {children}
        </Badge>

    )
}
