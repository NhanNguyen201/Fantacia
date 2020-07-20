import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getHids, clearHids } from '../Redux/actions/dataActions';
import PostTextStatus from '../Components/PostHid/PostTextStatus/PostTextStatus';
import PostPhotoStatus from '../Components/PostHid/PostPhotoStatus/PostPhotoStatus';
import Hid from '../Components/Hid/Hid';
// mui
import Grid from '@material-ui/core/Grid';

const Home = ({getHids, clearHids, authenticated, dataLoading, userLoading, data}) => {
    useEffect(() => {
        getHids();
        return () => clearHids();
        // eslint-disable-next-line
    }, [])
    const { hids } = data;
    let markup = authenticated 
        ? ( userLoading 
            ? (<p>Loading</p>)
            : (dataLoading 
                ? <p>Loading</p>
                : ( (hids && hids.length > 0)
                    ? (
                        <Grid container spacing={10}>
                            <Grid item md={8} sm={12} xs={12} >
                                <PostTextStatus/>
                                <PostPhotoStatus/>
                                {hids.map(hid => <Hid key={hid.hidId} hid={hid}/>)}
                            </Grid>
                            <Grid item sm={4} xs={12}>
                                
                            </Grid>
                        </Grid>
                    ) 
                    : (
                        <Grid container spacing={10}>
                            <Grid item md={8} sm={12} xs={12} >
                                <PostTextStatus/>
                                <PostPhotoStatus/>
                                <p>There is no hid now</p>
                            </Grid>
                            <Grid item sm={4} xs={12}>
                                
                            </Grid>
                        </Grid>
                    )
                )
            )
        )
        : ( userLoading
            ? (<p>Loading</p>)
            : (<p>Unauthenticated</p>)
        )
    return markup;
}



Home.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    dataLoading: PropTypes.bool.isRequired,
    userLoading: PropTypes.bool.isRequired,
    getHids: PropTypes.func.isRequired,
    clearHids: PropTypes.func.isRequired,
    hids: PropTypes.array,
}

const mapStateToProps = state => ({
    authenticated: state.user.authenticated,
    dataLoading: state.data.loading,
    userLoading: state.user.loading,
    data: state.data
})

export default connect(mapStateToProps, { getHids, clearHids })(Home);

