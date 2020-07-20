import React from 'react';
import Badge from '@material-ui/core/Badge';

export default ({ children, friendRequests }) => {
    var unread = friendRequests.filter(noti => noti.read === false)
    return (
        <Badge badgeContent={unread.length} color="secondary">
            {children}
        </Badge>
    )
}
