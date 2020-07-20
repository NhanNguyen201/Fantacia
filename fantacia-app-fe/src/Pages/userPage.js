import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Hid from '../Components/Hid/Hid';
import { connect } from 'react-redux';
import { getMyHids, clearHids } from '../Redux/actions/dataActions';
import Grid from '@material-ui/core/Grid';
import UserBanner from '../Components/UserBanner/UserBanner';
const UserPage = ({getMyHids, clearHids, data, dataLoading, match}) => {
    const [hidIdParam, setHidIdParam] = useState(null)
    useEffect(() => {
        getMyHids()
        if(match.params.hidId) setHidIdParam(match.params.hidId)
        return () => clearHids()
        // eslint-disable-next-line
    }, [])
    const { hids } = data;
    var fullMarkup = dataLoading 
        ? <p>Loading</p> 
        : (
            <Grid container spacing={10}>
                <Grid item md={12} sm={12} xs={12} style={{padding: "0 40px"}}>
                    <UserBanner/>
                </Grid>
                <Grid item md={8} sm={12} xs={12}>
                    {hids.map(hid => <Hid key={hid.hidId} hid={hid} isOpen={hid.hidId === hidIdParam}/>)}
                </Grid>
            </Grid>
        )
    return fullMarkup;
}

UserPage.propTypes = {
    dataLoading: PropTypes.bool.isRequired,
    getMyHids: PropTypes.func.isRequired,
    clearHids: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
} 
const mapStateToProps = state => ({
    dataLoading: state.data.loading,
    user: state.user,
    data: state.data
})
export default connect(mapStateToProps, {getMyHids, clearHids})(UserPage);