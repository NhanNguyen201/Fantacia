import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import themeFile from '../Util/theme'
//Redux
import { connect } from 'react-redux';
import { clearErrors } from '../Redux/actions/dataActions';
import { signupUser } from '../Redux/actions/userActions';

const styles = themeFile;

const Signup = ({ui, signupUser, clearErrors, classes}) => {
    let history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword ] = useState('');
    const [bio, setBio] = useState('');
    const [gender, setGender] = useState('male');
    const [error, setError] = useState({});
    useEffect(() => {
        if(ui.errors) setError(ui.errors)
        console.log(ui.errors)
    }, [ui])
    const handleSubmit = e => {
        e.preventDefault();
        clearErrors();
        const newUser = {
            email,
            password,
            confirmPassword,
            bio,
            gender
        }
        console.log(newUser);
        signupUser(newUser, history)
    }
    return (
        <Grid container className={classes.form}>
                <Grid item sm></Grid>
                <Grid item sm>
                    <Typography variant='h2' className={classes.pageTitle}>Sign up</Typography>
                    <form noValidate onSubmit={handleSubmit}>
                        <TextField 
                            type='email' 
                            label='Email' 
                            className={classes.textField} 
                            helperText={error.email}
                            error={error.email ? true : false}
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            fullWidth
                        />
                        <TextField 
                            type='password' 
                            label='Password' 
                            className={classes.textField} 
                            helperText={error.password}
                            error={error.password ? true : false}
                            value={password} 
                            onChange={e => {setPassword(e.target.value)}} 
                            fullWidth
                        />
                        <TextField 
                            type='password' 
                            label='Confirm password' 
                            className={classes.textField} 
                            helperText={error.confirmPassword}
                            error={error.confirmPassword ? true : false}
                            value={confirmPassword} 
                            onChange={e => {setConfirmPassword(e.target.value)}} 
                            fullWidth
                        />
                        <TextField 
                            type='text' 
                            label='Your name' 
                            className={classes.textField} 
                            helperText={error.bio}
                            error={error.bio ? true : false}
                            value={bio} 
                            onChange={e => setBio(e.target.value)} 
                            fullWidth
                        />
                        <FormControl variant="outlined" className={classes.textField} fullWidth>
                            <InputLabel id="genderLabel">Gender</InputLabel>
                            <Select
                                labelId="genderLabel"
                                id="gender"
                                name="gender"
                                value={gender}
                                onChange={e => setGender(e.target.value)}
                                label="Gender"
                            >
                                <MenuItem value={"female"}>Female</MenuItem>
                                <MenuItem value={"male"}>Male</MenuItem>
                            </Select>
                        </FormControl>
                        <br/>
                        {error.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {error.general}
                            </Typography>
                        )}
                        {error.message && (
                            <Typography variant="body2" className={classes.customError}>
                                {error.message}
                            </Typography>
                        )}
                        <Button type="submit" variant="outlined" color="primary" disabled={ui.loading}>
                            Sign up
                            {ui.loading && (
                                <CircularProgress size={20} className={classes.progress}/>
                            )}
                        </Button>
                        <br/>
                        <small>Already have an account ? Login <Link to='/login'>here</Link></small>
                    </form>
                </Grid>
                <Grid item sm></Grid>
            </Grid>
    )
}
Signup.propTypes = {
    classes: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
}
const mapStateToProps = (state) => ({
    ui: state.UI
})
export default connect(mapStateToProps, { signupUser, clearErrors })(withStyles(styles)(Signup));