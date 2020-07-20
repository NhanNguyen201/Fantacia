import React from 'react';
// mui
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Paper from '@material-ui/core/Paper';
import MyRoundBtn from '../../Util/MyRoundBtn';
// redux
import { connect } from 'react-redux';
import { joinGroup } from '../../Redux/actions/dataActions'

import './JoinGroupPaper.scss'
const JoinGroupPaper = ({groupId, joinGroup}) => {
    const joinGroupAction = () => {
        joinGroup(groupId)
    }
    return (
        <Paper elevation={4} className="join-group-paper">
            <h2 className="join-group-message">You haven't joined the group. Please joined it to see more hid about for favorite</h2>
            <MyRoundBtn tip="click here to join this group" onClick={joinGroupAction}>
                <ArrowForwardIcon fontSize="large" color="primary"/>
            </MyRoundBtn>
        </Paper>
    )
}

export default connect(null, {joinGroup})(JoinGroupPaper)



