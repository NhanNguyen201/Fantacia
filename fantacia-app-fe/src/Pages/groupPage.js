import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Hid from '../Components/Hid/Hid';
import JoinGroupPaper from '../SubComponent/JoinGroupPaper/JoinGroupPaper'
import { getOneGroup, clearGroup, clearHids } from '../Redux/actions/dataActions';
// mui
import Grid from '@material-ui/core/Grid';
// 
import PostTextHid from '../Components/PostHid/PostTextHid/PostTextHid';
import PostPhotoHid from '../Components/PostHid/PostPhotoHid/PostPhotoHid';
import GroupBanner from '../Components/GroupBanner/GroupBanner';
import ErrorPaper from '../SubComponent/ErrorPaper/ErrorPaper';
const GroupPage = ({getOneGroup, clearGroup,clearHids, data : { hids, group }, dataLoading, match, ui }) => {
    const { errors } = ui;
    const [ error, setError ] = useState(null);
    useEffect(() => {
        getOneGroup(match.params.group);
        return () => {
            clearGroup();
            clearHids();
        }
    // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (errors && errors.status === 404 ) setError(errors)
        // eslint-disable-next-line
    }, [ui])
    let markup = !dataLoading
        ? ( error
            ? (
                <Grid container spacing={10}>
                    <Grid item md={12} sm={12} xs={12}>
                        <ErrorPaper error={error}/>
                    </Grid>
                </Grid>
            )
            : ( 
                <Grid container spacing={10}>
                    <Grid item md={12} sm={12} xs={12} style={{padding: "0 40px"}}>
                        <GroupBanner />
                    </Grid>
                    <Grid item md={8} sm={12} xs={12}>
                        {group.dataCode === 400 
                            ? <JoinGroupPaper groupId={group.groupId}/>
                            :   ( hids && hids.length > 0
                                ?   (<>
                                        <PostTextHid/>
                                        <PostPhotoHid/>
                                        {hids.map(hid => <Hid key={hid.hidId} hid={hid}/>)}
                                    </>)                
                                : (<>
                                        <PostTextHid/>
                                        <PostPhotoHid/>
                                        <p>There is no hid yet</p>
                                    </>)
                                ) 
                        }
                    </Grid>
                </Grid>
            )
        )
        : (<p>Loading</p>)
    return markup;
}
GroupPage.propTypes = {
    dataLoading: PropTypes.bool.isRequired,
    getOneGroup: PropTypes.func.isRequired,
    clearGroup: PropTypes.func.isRequired,
    clearHids: PropTypes.func.isRequired,
    
} 
const mapStateToProps = state => ({
    dataLoading: state.data.loading,
    data: state.data,
    ui: state.UI
})

export default connect(mapStateToProps, {getOneGroup, clearGroup, clearHids})(GroupPage)