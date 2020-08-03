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
import { postTextStatus, clearErrors } from '../../../Redux/actions/dataActions';
import { connect } from 'react-redux';
// util
import MyRoundBtn from '../../../Util/MyRoundBtn';
const PostTextStatus = ({postTextStatus, clearErrors, ui}) => {
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
        postTextStatus({body});
    }
    return (
        <>
            <MyRoundBtn onClick={handleClickOpen} tip="Post a status">
                <PostAddIcon color="primary" fontSize="large"/>
            </MyRoundBtn>
            <Dialog 
                open={open} 
                onClose={handleClose} 
                aria-labelledby="form-dialog-title" 
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle id="form-dialog-title">Post a status</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Post your status 
                    </DialogContentText>
                    <TextField
                        name="body"
                        type="text"
                        label="Status post"
                        placeholder="Post your status here"
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
PostTextStatus.propTypes = {
    postTextStatus: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    ui: state.UI,
})

export default connect(mapStateToProps, {postTextStatus, clearErrors})(PostTextStatus)
