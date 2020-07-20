const user = {
    Uid: "",
    bio: "",
    group: [],
    avatar: "",
    imageCollection: [],
    location: "",
    favorite: "",
    birth: "",
}

const wish = {
    user,
    wishId,
    group,
    body: {
        image,
        content
    }
}

const likeUser = {
    user,
    target,
    time
}

const likePost = {
    user,
    postId, 
    time
}

const comment = {
    user, 
    postID,
    body : "",
    time 
}

const dislikeUser = {
    user,
    target
}
const notification = {
    time,
    recipient,
    sender,
    body
}