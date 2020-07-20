import React from 'react';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import './GroupBanner.scss';
const GroupBanner = ({ group }) => {
    const { name, avatarIcon } = group;
    return (
        <div className='group-banner'>
            {avatarIcon && <img alt='groupImg' className='group-avatar' src={avatarIcon}/>}
            {name && <p className='group-name'>{name}</p>}
        </div>
    )
}
GroupBanner.propTypes = {
    group: PropTypes.object
}
const mapStateToProps = state => ({
    group: state.data.group
})
export default connect(mapStateToProps, null)(GroupBanner);