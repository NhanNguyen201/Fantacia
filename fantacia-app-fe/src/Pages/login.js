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
import themeFile from '../Util/theme'
//Redux
import { connect } from 'react-redux';
import { clearErrors } from '../Redux/actions/dataActions';
import { loginUser } from '../Redux/actions/userActions';

const styles = themeFile;
const Login = ({ui, loginUser, clearErrors, classes}) => {
    let history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({});
    useEffect(() => {
        if(ui.errors) setError(ui.errors)
        console.log(ui.errors)
    }, [ui])
    const handleSubmit = e => {
        e.preventDefault();
        clearErrors();
        const userData = {
            email,
            password,
        }
        console.log(userData);
        loginUser(userData, history)
    }
    return (
        <Grid container className={classes.form}>
                <Grid item sm></Grid>
                <Grid item sm>
                    <Typography variant='h2' className={classes.pageTitle}>Login</Typography>
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
                            Login
                            {ui.loading && (
                                <CircularProgress size={20} className={classes.progress}/>
                            )}
                        </Button>
                        <br/>
                        <small>Don't have an account ? Signup <Link to='/signup'>here</Link></small>
                    </form>
                </Grid>
                <Grid item sm></Grid>
            </Grid>
    )
}
Login.propTypes = {
    classes: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
}
const mapStateToProps = (state) => ({
    ui: state.UI
})
export default connect(mapStateToProps, { loginUser, clearErrors })(withStyles(styles)(Login));