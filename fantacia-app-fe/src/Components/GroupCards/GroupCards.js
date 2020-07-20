import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//mui
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import BeenhereIcon from '@material-ui/icons/Beenhere';

import MyRoundBtn from '../../Util/MyRoundBtn';
import './GroupCards.scss'
const GroupCards = ({groupList, credentials}) => {
    var markup = groupList.map(each => 
        <Grid item md={6} sm={12} xs={12} key={each.name}>
            <Paper elevation={4} className="group-card-paper">
                <img src={each.avatarIcon} alt="GroupAvatar" className="group-card-image"/>
                <div className="group-card-body">
                    <Link to={`/group/${each.groupId}`} className="group-card-name">
                        {each.name} 
                    </Link>
                    {(credentials.groups && credentials.groups.some(eachGroup => eachGroup.groupId === each.groupId)) && <MyRoundBtn tip="You have joined this group already"><BeenhereIcon color="secondary" className="group-card-icon"/></MyRoundBtn>}
                </div>
            </Paper>
        </Grid>
    )
    return (
        <Grid container spacing={10} className="group-card-container">
            {markup}
        </Grid>
    )
}

GroupCards.propTypes = {
    credentials: PropTypes.object.isRequired,
    groupList: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
    credentials: state.user.credentials
})
export default connect(mapStateToProps)(GroupCards)