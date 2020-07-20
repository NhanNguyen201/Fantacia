import React, { Component } from 'react';
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
import { signupUser } from '../Redux/actions/userActions';

const styles = themeFile;

class signup extends Component {
    constructor(){
        super();
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            bio: "",
            gender: "male",
            seek: "female",
            errors : {}
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({errors: nextProps.UI.errors})
        }
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const newUserData ={
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            bio: this.state.bio,
            gender: this.state.gender,        
        }
        this.props.signupUser(newUserData, this.props.history)
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    } 
    render(){
        const { classes, UI: {loading} } = this.props;
        const { errors } = this.state;
        return (
            <Grid container className={classes.form}>
                <Grid item sm></Grid>
                <Grid item sm>
                    <Typography variant='h2' className={classes.pageTitle}>Sign up</Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField 
                            id='email' 
                            name='email' 
                            type='email' 
                            label='Email' 
                            className={classes.textField} 
                            helperText={errors.email}
                            error={errors.email ? true : false}
                            value={this.state.email} 
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        <TextField 
                            id='password' 
                            name='password' 
                            type='password' 
                            label='Password' 
                            className={classes.textField} 
                            helperText={errors.password}
                            error={errors.password ? true : false}
                            value={this.state.password} 
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        <TextField 
                            id='confirmPassword' 
                            name='confirmPassword' 
                            type='password' 
                            label='Confirm password' 
                            className={classes.textField} 
                            helperText={errors.confirmPassword}
                            error={errors.confirmPassword ? true : false}
                            value={this.state.confirmPassword} 
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        <TextField 
                            id='bio' 
                            name='bio' 
                            type='text' 
                            label='Your name' 
                            className={classes.textField} 
                            helperText={errors.bio}
                            error={errors.bio ? true : false}
                            value={this.state.bio} 
                            onChange={this.handleChange} 
                            fullWidth
                        />
                        <FormControl variant="outlined" className={classes.textField} fullWidth>
                            <InputLabel id="genderLabel">Gender</InputLabel>
                            <Select
                                labelId="genderLabel"
                                id="gender"
                                name="gender"
                                value={this.state.gender}
                                onChange={this.handleChange}
                                label="Gender"
                            >
                                <MenuItem value={"female"}>Female</MenuItem>
                                <MenuItem value={"male"}>Male</MenuItem>
                            </Select>
                        </FormControl>
                        <br/>
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button type="submit" variant="outlined" color="primary" disabled={loading}>
                            Sign up
                            {loading && (
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
}
signup.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired
}
const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
})
export default connect(mapStateToProps, { signupUser })(withStyles(styles)(signup));