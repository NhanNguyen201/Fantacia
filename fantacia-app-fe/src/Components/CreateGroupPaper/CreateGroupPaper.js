import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
// mui
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'
// redux
import { connect } from 'react-redux';
import { createGroup, clearErrors } from '../../Redux/actions/dataActions'
// util
import MyRoundBtn from '../../Util/MyRoundBtn';
import './CreateGroupPaper.scss';
const CreateGroupPaper = ({ui, createGroup, clearErrors}) => {
    var history = useHistory();
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false);
    const [createError, setCreateError] = useState(null);
 
    useEffect(() => {
        if(ui.errors && ui.errors.data.error) setCreateError(ui.errors.data.error)
        if(!ui.loading && !ui.errors) setOpen(false)
    }, [ui])

    const handleClickOpen = () => setOpen(true)

    const handleClose = () => {
        setOpen(false);
        setCreateError(null);
        clearErrors()
    }
    const handleSubmit = e => {
        e.preventDefault();
        const groupName = {name: name}
        createGroup(groupName, history);
    }

    return (
        <div>
            <Paper className='create-group-paper' elevation={4}>
                <MyRoundBtn onClick={handleClickOpen} tip="Create a new Group">
                    <AddIcon color="primary" fontSize='large'/>
                </MyRoundBtn>
                <p>Create a new group</p>
            </Paper>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" >
                <DialogTitle id="form-dialog-title">Create a group</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create a new group of hobby, topic 
                    </DialogContentText>
                    <TextField
                        name="body"
                        type="text"
                        label="New group's name"
                        placeholder="Name the new group"
                        error={createError ? true : false}
                        helperText={createError}
                        onChange={e => setName(e.target.value)}
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

const mapStateToProps = (state) => ({
    ui: state.UI
})

const mapDispatchToProps = {
    createGroup,
    clearErrors
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupPaper)
