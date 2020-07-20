import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { exploreGroup, clearGroups } from '../Redux/actions/dataActions';
import GroupCards from '../Components/GroupCards/GroupCards';
const JoinGroup = ({exploreGroup, clearGroups, authenticated, dataLoading, data:{ groups }}) => {
    useEffect(() => {
        exploreGroup();
        return () => clearGroups()
        // eslint-disable-next-line
    },[])
    return  (
        authenticated 
        ? (dataLoading ? <p>Loading</p> : <GroupCards groupList={groups}/>)
        : <p>Unorthorize</p>
    )
}
JoinGroup.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    dataLoading: PropTypes.bool.isRequired,
    exploreGroup: PropTypes.func.isRequired,
    clearGroups: PropTypes.func.isRequired,
    groups: PropTypes.array,
} 
const mapStateToProps = state => ({
    authenticated: state.user.authenticated,
    dataLoading: state.data.loading,
    data: state.data
})

export default connect(mapStateToProps, {exploreGroup, clearGroups})(JoinGroup)