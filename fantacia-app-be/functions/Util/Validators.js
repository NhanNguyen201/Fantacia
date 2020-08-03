const isEmpty = (string) => {
    if(string === "" || String(string).trim() === "") {
        return true;
    } else {
        return false;
    }
}

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
}

exports.validateSignupData = (data) => {
    let errors = {};
    if(isEmpty(data.email)){
        errors.email = 'Must not be empty'
    } else if(!isEmail(data.email)){
        errors.email = 'Must be a valid email eddress'
    }

    if(isEmpty(data.password)) errors.password = "Must not be empty";
    if(data.password !== data.confirmPassword) errors.confirmPassword = 'Confirm password must match';
    if(isEmpty(data.bio)) errors.bio = "Must not be empty";
    if(isEmpty(data.gender)) errors.gender = "Must not be empty";
    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}


exports.validateLoginData = (data) => {
    let errors = {};
    if(isEmpty(data.email)) errors.email = "must not be empty";
    if(isEmpty(data.password)) errors.password = "must not be empty";
    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}

exports.reduceUserData = data => {
    let userData = {};
    if (!isEmpty(data.bio.trim())) userData.bio = data.bio;
    if (!isEmpty(data.location.trim())) userData.location = data.location;
    if (!isEmpty(data.birth.toString().trim())) userData.birth = data.birth;
    if (!isEmpty(data.favorite.trim())) userData.favorite = data.favorite;
    return userData
}
