import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom'
import { connect } from 'react-redux';
import Hid from '../Components/Hid/Hid';
import ErrorPaper from '../SubComponent/ErrorPaper/ErrorPaper';
import { getOneUser, clearFocusPersonInfo, clearHids } from '../Redux/actions/dataActions';
// import { 
//     calcCompatible,
//     clearScore 
// } from '../Redux/actions/scoreActions'
import OtherUserBanner from '../Components/OtherUserBanner/OtherUserBanner';
// mui
// import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
const OtherUserPage = ({getOneUser, clearFocusPersonInfo, clearHids, user, data: {hids, focusPerson}, dataLoading, match, ui }) => {
    const [hidIdParam, setHidIdParam] = useState(null)
    var history = useHistory();
    let location = useLocation()
    const { errors } = ui;
    const [ error, setError ] = useState(null);

    useEffect(() => {
        getOneUser(match.params.userName);
        
        if(match.params.hidId) setHidIdParam(match.params.hidId)

        // calcCompatible(match.params.userName);
        return () => {
            clearFocusPersonInfo();
            clearHids();
            // clearScore();
        }
        // eslint-disable-next-line
    }, [])
    
    useEffect(() => {
        if(user.credentials.userName === match.params.userName) {
            let { pathname } = location;
            let pathArray = pathname.split('/');
            pathArray.splice(2, 1)
            let joinPath = pathArray.join('/');
            history.push(joinPath);
        }
        if (errors && errors.status === 404) setError(errors)
        // eslint-disable-next-line
    }, [user, ui]);
    var fullMarkup = !dataLoading 
        ? ( error 
            ?(<Grid container spacing={10}>
                <Grid item md={12} sm={12} xs={12}>
                    <ErrorPaper error={error}/>
                </Grid>
            </Grid>) 
            :(<Grid container spacing={10}>
                <Grid item md={12} sm={12} xs={12} style={{padding: "0 40px"}}>
                    <OtherUserBanner />
                </Grid>
                <Grid item md={8} sm={12} xs={12}>
                    {hids.map(hid => <Hid key={hid.hidId} hid={hid} isOpen={hid.hidId === hidIdParam}/>)}
                </Grid>
            </Grid>) 
        )
        : (
            <p>Loading</p>
        )  


    return fullMarkup
}
OtherUserPage.propTypes = {
    dataLoading: PropTypes.bool.isRequired,
    getOneUser: PropTypes.func.isRequired,
    clearFocusPersonInfo: PropTypes.func.isRequired,
    clearHids: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
} 
const mapStateToProps = state => ({
    dataLoading: state.data.loading,
    user: state.user,
    data: state.data,
    ui: state.UI
})

export default connect(mapStateToProps, {getOneUser, clearFocusPersonInfo, clearHids})(OtherUserPage)