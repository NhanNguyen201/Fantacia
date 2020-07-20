import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFocusHid, clearFocusHid, clearErrors } from '../../Redux/actions/dataActions'
// emoji
import { emojify } from 'react-emojione';


// mui
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Paper from '@material-ui/core/Paper';
// dayjs
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

// component
import LikeCommentSection from '../LikeAndComment/LikeCommentSection/LikeCommentSection'
import './HidDialog.scss';

const HidDialog = ({ isOpen, hidId, groupId, getFocusHid,clearFocusHid, uiLoading, data: {focusHid} }) => {
    const locale = {
        name: 'vi',
        relativeTime: {
            future: '%s from now',
            past: '%s ago',
            s: 'few seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'a hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years'
        }
    }
    dayjs.locale(locale, null, true)
    dayjs.extend(relativeTime);

    // let history = useHistory(); 
    let location = useLocation();
    const [open, setOpen] = useState(false);
    const [oldPath, setOldPath] = useState('')
    const [newPath, setNewPath] = useState('');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if(isOpen) handleOpen()    
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(uiLoading && !focusHid) setLoading(true)
        if(uiLoading && focusHid) setLoading(false)
        if(!uiLoading) setLoading(false)
    }, [uiLoading, focusHid])

    const handleOpen = () => {
        getFocusHid(hidId);
        setOldPath(location.pathname)
        setNewPath(`/group/${groupId}/hid/${hidId}`);
        if(oldPath === newPath) setOldPath(`/group/${groupId}`);
        window.history.pushState(null, null, newPath);
        setOpen(true);
    }
    const handleClose = () => {
        window.history.pushState(null, null, oldPath);
        setOpen(false);
        clearFocusHid();
        clearErrors();
    }
    const dialogMarkup = loading
        ? ( <Dialog 
                open={open}
                fullWidth
                maxWidth='sm'
            >   
                <DialogContent>
                    <Paper>
                        <CircularProgress fontSize={200}/>
                    </Paper>
                </DialogContent>
            </Dialog>
        )
        : ( focusHid.type === 'textHid'
            ? ( <Dialog 
                    open={open}
                    onClose={handleClose}
                    fullWidth
                    maxWidth='sm'
                >
                    <DialogContent>
                        <div className="textHid-dialog-container">
                            <div className="textHid-dialog-header">
                                <div className="header-info">
                                    <img src={focusHid.userImage} alt="userAvatar" className="userAvatar"/>
                                    <div className="header-content">
                                        <b><Link to={`/user/${focusHid.userName}`} className="user-link">{focusHid.bio}</Link></b>
                                        <small><AccessTimeIcon color='primary' className='clock-icon' fontSize='small'/>  {dayjs(focusHid.createdAt).fromNow()}</small>
                                    </div>
                                </div>
                            </div>
                            <div className="textHid-dialog-body">
                                <p className="body-content">{emojify(focusHid.body)}</p>
                            </div>
                            <div className="textHid-dialog-footer">
                                <div className="counter">
                                    <p>{focusHid.likeCount > 0 
                                        ? <FavoriteIcon color="secondary" style={{transform: "translateY(25%)"}}/> 
                                        : <FavoriteBorder color="secondary" style={{transform: "translateY(25%)"}}/>
                                    }{focusHid.likeCount}</p>
                                    <p>{focusHid.commentCount} {focusHid.commentCount > 1 ? "comments" : "comment"}</p>
                                </div>
                                <hr/>
                                <LikeCommentSection hidId={focusHid.hidId} comments={focusHid.comments ? focusHid.comments : []} openComment/>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>)
            : focusHid.type === 'photoHid' 
            ?(  <Dialog
                    open={open}
                    onClose={handleClose}
                    fullWidth
                    maxWidth='lg'
                >
                    <DialogContent>
                            <Grid container spacing={5} className="photoHid-dialog-container">
                                <Grid item lg={8} md={8} sm={12} xs={12} className="photoHid-dialog-imgContent">
                                    <img src={focusHid.image} alt="photoHidImage" className="photoHid-dialog-img"/>
                                </Grid>
                                <Grid item lg={4} md={4} sm={12} xs={12} className="photoHid-dialog-content">
                                    <div className="photoHid-dialog-header">
                                        <div className="header-info">
                                            <img src={focusHid.userImage} alt="userAvatar" className="userAvatar"/>
                                            <div className="header-content">
                                                <b><Link to={`/user/${focusHid.userName}`} className="user-link">{focusHid.bio}</Link></b>
                                                <small><AccessTimeIcon color='primary' className='clock-icon' fontSize='small'/>  {dayjs(focusHid.createdAt).fromNow()}</small>
                                            </div>
                                        </div>
                                    </div>
                                    {focusHid.body && (
                                        <div className="photoHid-dialog-body">
                                            <p className="body-content">{emojify(focusHid.body)}</p>
                                        </div>
                                    )}
                                    <div className="photoHid-dialog-footer">
                                        <div className="counter">
                                            <p>{focusHid.likeCount > 0 
                                                ? <FavoriteIcon color="secondary" style={{transform: "translateY(25%)"}}/> 
                                                : <FavoriteBorder color="secondary" style={{transform: "translateY(25%)"}}/>
                                            }{focusHid.likeCount}</p>
                                            <p>{focusHid.commentCount} {focusHid.commentCount > 1 ? "comments" : "comment"}</p>
                                        </div>
                                        <hr/>
                                        <LikeCommentSection hidId={focusHid.hidId} comments={focusHid.comments ? focusHid.comments : []} openComment/>
                                    </div>
                                </Grid>
                            </Grid>
                    </DialogContent>
                </Dialog>)
            : null
        )
    return dialogMarkup
}
const mapStateToProps = state => ({
    data: state.data,
    uiLoading: state.UI.loading
})
HidDialog.propTypes = {
    focusHid: PropTypes.object,
    getFocusHid: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearFocusHid: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    groupId: PropTypes.string,
    hidId: PropTypes.string
}
export default connect(mapStateToProps, {getFocusHid, clearErrors, clearFocusHid})(HidDialog);