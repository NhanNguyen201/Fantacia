import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
// mui
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import Dialog from '@material-ui/core/Dialog';
import { getOneHid } from '../../../Redux/actions/dataActions'
import LikeList from '../LikeList/LikeList';
import CircularProgress from '@material-ui/core/CircularProgress';

import './LikeListDialog.scss';
const LikeListDialog = ({hids, hidId, likeCount, getOneHid, uiLoading}) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [likeList, setLikeList] = useState([])

    useEffect(() => {
        if(!uiLoading){
            const currentHid = hids.find(hid => hid.hidId === hidId)
            if(currentHid){
                if(currentHid.likes) setLikeList(currentHid.likes)
            }
        }
        // eslint-disable-next-line
    }, [uiLoading])
    const handleClose = () => {
        setDialogOpen(false)
    }
    const handleOpen = () => {
        setDialogOpen(true)
        getOneHid(hidId)
    }
    var markup = uiLoading 
        ? <div className='loading-dialog'><CircularProgress size={200}/></div>    
        : <div className='likeList-dialog'>
            <div>
                <FavoriteIcon fontSize='default' color='secondary' style={{transform: "translateY(25%)"}}/><span>{likeCount}</span>
            </div>
            <hr style={{margin: "5px"}}/>
            <LikeList likeList={likeList}/>
        </div>
    return (
        <div>
            <p variant="text" onClick={handleOpen} className='like-counter'>
                {likeCount > 0 
                    ? <FavoriteIcon color="secondary" style={{transform: "translateY(25%)"}}/> 
                    : <FavoriteBorder color="secondary" style={{transform: "translateY(25%)"}}/>
                }
                {likeCount}
            </p>
            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
            >
                {markup}
            </Dialog>
        </div>
    )
}
const mapStateToProps = state => ({
    uiLoading: state.UI.loading,
    hids: state.data.hids
})
LikeListDialog.propTypes = {
    hids: PropTypes.array,
    hidId: PropTypes.string.isRequired,
    likeCount: PropTypes.number.isRequired,
    getOneHid: PropTypes.func.isRequired,
    uiLoading: PropTypes.bool.isRequired,
}
export default connect(mapStateToProps, { getOneHid })(LikeListDialog)