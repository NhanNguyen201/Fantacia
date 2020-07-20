import React from 'react';
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import RequestPaper from '../RequestPaper/RequestPaper';
const FriendRequests = ({requests}) => {
    return(
        <div className="friend-request-container" style={{width: "400px", padding: "10px 0"}}>
            <Typography variant="body1" style={{padding: "0 20px"}}>Your friend requests:</Typography>
            {requests.map(each => <RequestPaper friendRequest={each} key={each.requestId}/>)}
        </div>
    )
}
FriendRequests.propTypes = {
    requests: PropTypes.array.isRequired
}
export default FriendRequests;