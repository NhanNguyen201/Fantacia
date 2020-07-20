import React, { useEffect } from 'react';
import PropTypes from 'prop-types'
import Modal from '@material-ui/core/Modal';
import { connect } from 'react-redux';
import { getOneHid, clearHid } from '../../../Redux/actions/dataActions';
const HidPaper = ({ uiLoading, hidId }) => {
    useEffect(() => {
        getOneHid(hidId)
        return () => clearHid()
    }, [])
    
}

const mapStateToProps = state => ({
    uiLoading : state.UI.loading 
})

export default connect(mapStateToProps, {getOneHid, clearHid})(HidPaper)