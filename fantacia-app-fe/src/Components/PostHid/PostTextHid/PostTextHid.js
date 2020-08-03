import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';

//mui
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import PostAddIcon from '@material-ui/icons/PostAdd';
import CircularProgress from '@material-ui/core/CircularProgress';
// redux
import { postHid, clearErrors } from '../../../Redux/actions/dataActions';
import { connect } from 'react-redux';
// util
import MyRoundBtn from '../../../Util/MyRoundBtn';
const PostTextHid = ({postHid, clearErrors, group, ui}) => {
    const [open, setOpen] = useState(false);
    const [body, setBody] = useState('');
    const [postError, setPostError] = useState(null)
    useEffect(() => {
        if(ui.errors && ui.errors.data.error) setPostError(ui.errors.data.error)
        if(!ui.loading && !ui.errors) setOpen(false)
        // eslint-disable-next-line
    }, [ui])
    const handleClickOpen = () => setOpen(true)

    const handleClose = () => {
        setOpen(false);
        setPostError(null)
        clearErrors();  
    }
    const handleSubmit = e => {
        e.preventDefault();
        postHid({body}, group);
    }
    return (
        <>
            <MyRoundBtn onClick={handleClickOpen} tip="Post a hid">
                <PostAddIcon color="primary" fontSize="large"/>
            </MyRoundBtn>
            <Dialog 
                open={open} 
                onClose={handleClose} 
                aria-labelledby="form-dialog-title" 
                maxWidth="sm"
            >
                <DialogTitle id="form-dialog-title">Create a Hid</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Share with everyone the group what you think, what have made you interesting in recently ?
                    </DialogContentText>
                    <TextField
                        name="body"
                        type="text"
                        label="Post what you like"
                        multiline
                        rows="2"
                        placeholder="Post what you like"
                        error={postError ? true : false}
                        helperText={postError}
                        onChange={e => setBody(e.target.value)}
                        fullWidth

                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        color="primary"
                        disabled={ui.loading}

                    >
                        Submit
                        {ui.loading && (
                            <CircularProgress size={20} color="primary"/>
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
PostTextHid.propTypes = {
    group: PropTypes.string,
    postHid: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    group: state.data.group.groupId,
    ui: state.UI,
})

export default connect(mapStateToProps, {postHid, clearErrors})(PostTextHid)
