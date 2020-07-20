import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
//mui
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

import { connect } from 'react-redux';
import { deleteHid, clearErrors } from '../../../Redux/actions/dataActions';
const DeleteHid = ({hidId, deleteHid, clearErrors, ui}) =>  {
    const [open, setOpen] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        if(ui.errors && ui.errors.data.error) setDeleteError(ui.errors.data.error)
        if(!ui.loading && !ui.errors) setOpen(false)
        // eslint-disable-next-line
    }, [ui])
    const handleClickOpen = () => setOpen(true);
    
    const handleClose = () => {
        setOpen(false);
        setDeleteError(null)
        clearErrors()
    };

    const handleDelete = () => {
        deleteHid(hidId)
    }
    return (
        <div>
            <Button color="primary" onClick={handleClickOpen} style={{padding: '10px 20px'}}>
               Delete 
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete this hid</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this hid. This action can't be undo.
                    </DialogContentText>
                    {deleteError && 
                        <DialogContentText style={{color: 'red'}}>
                            {deleteError}
                        </DialogContentText>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Disagree
                    </Button>
                    <Button 
                        onClick={handleDelete} 
                        color="secondary"
                        disabled={ui.loading}
                    >
                        Agree
                        {ui.loading && (
                            <CircularProgress size={20} color="primary"/>
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
  );
}
DeleteHid.propTypes = {
    deleteHid: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired,
    hidId: PropTypes.string.isRequired
}
const mapStateToProps = state => ({
    ui: state.UI
})
export default connect(mapStateToProps, {deleteHid, clearErrors})(DeleteHid)