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
import CircularProgress from '@material-ui/core/CircularProgress';
// redux
import { editHid, clearErrors } from '../../../Redux/actions/dataActions';
import { connect } from 'react-redux';
// util
const EditHid = ({editHid, clearErrors, ui, hidId}) => {
    const [open, setOpen] = useState(false);
    const [body, setBody] = useState('');
    const [editError, setEditError] = useState(null)

    useEffect(() => {
        if(ui.errors && ui.errors.data.error) setEditError(ui.errors.data.error)
        if(!ui.loading && !ui.errors) setOpen(false)
        // eslint-disable-next-line
    }, [ui])

    const handleClickOpen = () => setOpen(true)

    const handleClose = () => {
        setOpen(false);
        setEditError(null)
        clearErrors();  
    }

    const handleSubmit = e => {
        e.preventDefault();
        editHid(hidId, {body});
    }

    return (
        <div>
            <Button color="primary" onClick={handleClickOpen} style={{padding: '10px 30px'}}>
               Edit 
            </Button>
            <Dialog 
                open={open} 
                onClose={handleClose} 
                aria-labelledby="form-dialog-title" 
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="form-dialog-title">Edit a hid</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Change the content of this hid
                    </DialogContentText>
                    <TextField
                        name="body"
                        type="text"
                        label="Edit hid"
                        placeholder="Enter your content here"
                        error={editError ? true : false}
                        helperText={editError}
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
        </div>
    )
}
EditHid.propTypes = {
    editHid: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired,
    hidId: PropTypes.string.isRequired
}
const mapStateToProps = state => ({
    ui: state.UI
})

export default connect(mapStateToProps, {editHid, clearErrors})(EditHid)
