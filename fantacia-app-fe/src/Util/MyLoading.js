import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
const MyLoading = ({message, isOpen}) => {
    return (
        <Dialog
            open={isOpen}
        >
        <DialogContent>
            <DialogContentText>
                <CircularProgress size={25} disableShrink/><span>{message}</span>
            </DialogContentText>
        </DialogContent>
      </Dialog>)
}

export default MyLoading;