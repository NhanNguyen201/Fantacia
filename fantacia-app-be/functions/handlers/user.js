const { admin, db } = require('../Util/admin');
const config = require('../Util/config');
const firebase = require('firebase');
firebase.initializeApp(config);
const { validateSignupData, validateLoginData, reduceUserData } = require('../Util/Validators');

// sign up

exports.signup = (req, res) => {
    var userName;
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        bio: req.body.bio,
        gender: req.body.gender,
    }
    const { valid, errors } = validateSignupData(newUser);
    if(!valid) return res.status(400).json(errors);
    const defaultImg = 'user.png';
    const defaultBg = 'background.png';
    // validate
    let token, userId;
    db.doc(`/users/${newUser.userName}`).get()
        .then(doc => {
            if(doc.exists){
                return res.status(400).json({ userName: 'This userName is already taken'})
            } else {
                return firebase
                            .auth()
                            .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken()            
        })
        .then(idToken => {
            token = idToken;
            userName = newUser.email.split('@')[0];
            var newDate = new Date();
            newDate.setHours(newDate.getHours() + 7)
            const userCredential = {
                email: newUser.email,
                bio: newUser.bio.trim(),
                joinedAt: newDate.toLocaleString(),
                gender: newUser.gender,
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultImg}?alt=media`,
                background: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultBg}?alt=media`,
                groups: [],
                userName,
                userId
            };
            return db.doc(`/users/${userName}`).set(userCredential);
        })
        .then(() => {
            const friendList = [];
            return db.doc(`/friendLists/${userName}`).set({friendList})
        })
        .then(() => {
            return res.status(201).json({token});
        })
        .catch(err => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use'){
                return res.status(400).json({email: 'Email is already in use'})
            } else {
                return res.status(500).json({general: 'something is wrong, please try again'})
            }            
        })
}
// login
exports.login =  (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    const { valid, errors } = validateLoginData(user);
    if(!valid) return res.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json({token})
        })
        .catch(err => {
            console.error(err);
            return res.status(403).json({general: "Wrong credential, please try again"})
        })
}
// get authenticate
exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.userName}`).get()
        .then(doc => {
            if(doc.exists){
                userData.credentials = doc.data();
                return db.collection('notifications')
                    .where('recipient', '==', req.user.userName)
                    .orderBy('createdAt','desc')
                    .get()
            }
        })
        .then(data => {
            userData.notifications = [];
            if(!data.empty){
                data.forEach(doc => {
                    userData.notifications.push({...doc.data(), notificationId: doc.id})
                })
            }
            return db.collection('hidLikes').where('userName', '==', req.user.userName).get()
        })
        .then(data => {
            userData.likes = [];
            if(!data.empty){
                data.forEach(doc => {
                    userData.likes.push(doc.data())
                })
            }
            return db.collection('friendRequests')
                .where('recipient', '==', req.user.userName)
                .get();
        })
        .then(data => {
            userData.friendRequests = [];
            if(!data.empty){
                data.forEach(doc => {
                    userData.friendRequests.push({
                        ...doc.data(),
                        requestId: doc.id
                    })
                })
            }
            return db.doc(`/friendLists/${req.user.userName}`).get()
        })
        .then(doc => {
            if(doc.exists){
                userData.friendList = doc.data().friendList
            }
            return res.json(userData)
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err})
        })
}
// update user
exports.updateUserData = (req, res) => {
    let userData = reduceUserData(req.body);
    db.doc(`/users/${req.user.userName}`).update(userData)
        .then(() => {
            return res.json({message: "Update user data successfully"})
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code})
        })
}
// get one user
exports.getOneUser = (req, res)=> {
    const likeDoc = 
        db.collection('userLikes')
        .where('userName', '==', req.user.userName)
        .where('target', '==', req.params.userName)
        .limit(1);
    const hidDocs = 
        db.collection('hids')
        .where('userName', '==', req.params.userName)
        .orderBy('createdAt', 'desc')
    const requestDoc = 
        db.collection('friendRequests')
        .where('sender', '==', req.user.userName)
        .where('recipient', '==', req.params.userName)
        .limit(1)
    const theirRequest =
        db.collection('friendRequests')
            .where('sender', '==', req.params.userName)
            .where('recipient', '==', req.user.userName)
            .limit(1)
    const myFriendList = db.doc(`/friendLists/${req.user.userName}`)
    var userData = {};  
    db.doc(`/users/${req.params.userName}`)
        .get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({error: "User not found"})
            } else {
                userData.userInfo = {...doc.data(), groups: "You are unable to see this info"};
                userData.commonGroup = [];
                if(req.user.groups && doc.data().groups){
                    userData.commonGroup = req.user.groups.filter(x => doc.data().groups.some(y => x.groupId === y.groupId))
                }
                return likeDoc.get()
            }
        })
        .then(data => {
            userData.isLiked = !data.empty; 
            return theirRequest.get()
        })
        .then((data) => {
            userData.isRequestToUs = !data.empty;
            return requestDoc.get()
        })
        .then(data => {
            userData.isRequested = !data.empty; 
            return myFriendList.get()
        })
        .then(doc => {
            if(doc.exists) {
                userData.isFriend = doc.data().friendList.includes(String(req.params.userName))
            }
            return hidDocs.get()
        })
        .then(data => {
            userData.hids = [];
            if(!data.empty) {
                data.forEach(doc => {
                    if(userData.commonGroup.some(each => each.groupId === doc.data().group.groupId) || (["textStatus", "photoStatus", "avatarChange"].includes(doc.data().type) && userData.isFriend)){
                        userData.hids.push({...doc.data(), hidId: doc.id})
                    } 
                })
            }
            return res.json(userData)
        })
        .catch(err => res.status(500).json({error: err}))
}

exports.calcCompatible = (req, res) => {
    const likeByUser =
        db.collection('hidLikes')
        .where('userName', '==', req.user.userName)
        .where('hidHost', '==', req.params.userName)
    const likeByThem =
        db.collection('hidLikes')
        .where('userName', '==', req.params.userName)
        .where('hidHost', '==', req.user.userName)
    const commentByUser =
        db.collection('hidComments')
        .where('userName', '==', req.user.userName)
        .where('hidHost', '==', req.params.userName)
    const commentByThem =
        db.collection('hidComments')
        .where('userName', '==', req.params.userName)
        .where('hidHost', '==', req.user.userName)
    var compatibleScore = {}
    db.doc(`/users/${req.params.userName}`)
        .get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({error: "User not found"})
            } else {
                var commonGroup = [];
                if(req.user.groups && doc.data().groups){
                    commonGroup = req.user.groups.filter(x => doc.data().groups.some(y => x.groupId === y.groupId))
                    compatibleScore.numberOfGroup = commonGroup.length;
                }
                return likeByUser.get()
            }
        })
        .then(data => {
            if(!data.empty) {
                compatibleScore.likeByUser = data.docs.length;
            } else {
                compatibleScore.likeByUser = 0;
            }
            return likeByThem.get()
        })
        .then(data => {
            if(!data.empty) {
                compatibleScore.likeByThem = data.docs.length;
            } else {
                compatibleScore.likeByThem = 0;
            }
            return commentByUser.get()
        })
        .then(data => {
            if(!data.empty) {
                compatibleScore.commentByUser = data.docs.length;
            } else {
                compatibleScore.commentByUser = 0;
            }
            return commentByThem.get()
        })
        .then(data => {
            if(!data.empty){
                compatibleScore.commentByThem = data.docs.length;
            } else {
                compatibleScore.commentByThem = 0;
            }   
            var compatibleAfterCalc = 
                compatibleScore.numberOfGroup 
                + compatibleScore.likeByUser * 10 
                + compatibleScore.likeByThem * 10 
                + compatibleScore.commentByUser * 20 
                + compatibleScore.commentByThem * 20;
            return res.json({value: compatibleAfterCalc})
        })
        .catch(err => res.status(500).json({error: err}))
    
}
exports.likeUser = (req, res) => {
    const likeDoc = db.collection('userLikes')
        .where('userName', '==', req.user.userName)
        .where('target', '==', req.params.userName)
        .limit(1)
    db.doc(`/users/${req.params.userName}`)
        .get()
        .then(doc => {
            if(doc.exists){
                if(req.user.userName == req.params.userName){
                    return res.status(400).json({error: "You can't like yourself"})
                } else {
                    return likeDoc.get()
                }
            } else {
                return res.status(404).json({error: "User not found"})
            }
        })
        .then(data => {
            if(data.empty){
                return db.collection('userLikes')
                    .add({
                        userName: req.user.userName,
                        userImage: req.user.imageUrl,
                        bio: req.user.bio,
                        target: req.params.userName
                    })
                    .then(() => res.json({message: 'Like successfully'}))
            } else {
                return res.status(400).json({error: 'You have liked this user already'})
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err})
        })
}

exports.unlikeUser = (req, res) => {
    const likeDoc = db.collection('userLikes')
        .where('userName', '==', req.user.userName)
        .where('target', '==', req.params.userName)
        .limit(1)
    db.doc(`/users/${req.params.userName}`)
        .get()
        .then(doc => {
            if(doc.exists) {
                return likeDoc.get()
            } else {
                return res.status(404).json({error: 'user not found'})
            }
        })
        .then(data => {
            if(data.empty) {
                return res.status(400).json({error: "you haven't like this user yet"})
            } else {
                return db.doc(`/userLikes/${data.docs[0].id}`).delete()
                    .then(() => res.json({message: "unlike successfully"}))
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err})
        })
}

// update avatar
exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    let imageFileName;
    let imageToBeUploaded = {};
    const busboy = new BusBoy({headers: req.headers});
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png' && mimetype !== 'image/jpg'){
            return res.status(400).json({error: 'wrong file type submited'})
        }
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${Math.round(Math.random() * 1000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filepath, mimetype};
        file.pipe(fs.createWriteStream(filepath));
    })
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/users/${req.user.userName}`).update({imageUrl})
        })
        .then(() => {
            return res.json({message: 'Image upload successfully'})
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err})
        })
    });
    busboy.end(req.rawBody);
}

exports.uploadBackground = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    let imageFileName;
    let imageToBeUploaded = {};
    const busboy = new BusBoy({headers: req.headers});
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png' && mimetype !== 'image/jpg'){
            return res.status(400).json({error: 'wrong file type submited'})
        }
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${Math.round(Math.random() * 1000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filepath, mimetype};
        file.pipe(fs.createWriteStream(filepath));
    })
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const background = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/users/${req.user.userName}`).update({background})
        })
        .then(() => {
            return res.json({message: 'Image upload successfully'})
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err})
        })
    });
    busboy.end(req.rawBody);
}

exports.uploadImageCollection = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    let imageFileName;
    let imageToBeUploaded = {};
    const busboy = new BusBoy({headers: req.headers});
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png' && mimetype !== 'image/jpg'){
            return res.status(400).json({error: 'wrong file type submited'})
        }
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${Math.round(Math.random() * 100000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filepath, mimetype};
        file.pipe(fs.createWriteStream(filepath));
    })
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            db.doc(`/users/${req.user.userName}`)
                .get()
                .then(doc => {
                    if(doc.exists){
                        var collection = doc.data().imageCollection;
                        if(!collection){
                            collection = []
                        }
                        collection.push(imageUrl);
                        return db.doc(`/users/${req.user.userName}`).update({imageCollection: collection})
                    } else {
                        return res.status(400).json({error: 'user not found'})
                    }
                })
        })
        .then(() => {
            return res.json({message: 'Image upload successfully'})
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err})
        })
    });
    busboy.end(req.rawBody);
}

// delete img in collection
exports.deleteImgInCollection = (req, res) => {
    const imageName = req.params.imgName;
    const imageSrc = `https://firebasestorage.googleapis.com/v0/b/dating-76c25.appspot.com/o/${imageName}?alt=media`
    
    db.doc(`/users/${req.user.userName}`)
        .get()
        .then(doc => {
            if(doc.exists){
                var collection = doc.data().imageCollection;
                if(collection && collection.length > 0){
                    var newCollection = collection.filter(item => item !== imageSrc)
                    return db.doc(`/users/${req.user.userName}`)
                        .update({imageCollection: newCollection})                    
                } else {
                    return db.doc(`/users/${req.user.userName}`)
                            .update({imageCollection: []})
                }
            } else {
                return res.status(400).json({error: 'user not found'})
            }
        })
        .then(() => admin.storage().bucket().file(imageName).delete())
        
        .then(() => res.json({message: "Delete image successfully"}))        
        .catch(err => {
            console.error(err.code)
            return res.status(500).json({error: err})
        })
}

// delete user
exports.deleteUser = (req, res) => {
    const notiAsSenderDoc = db.collection('notifications').where('sender', '==', req.user.userName);
    const notiAsRecipient = db.collection('notifications').where('recipient', '==', req.user.userName);
    const hids = db.collection('hids').where('userName', '==', req.user.userName);
    const hidLikes = db.collection('hidLikes').where('userName', '==', req.user.userName);
    const comments = db.collection('hidComments').where('userName', '==', req.user.userName);
    const userLikes = db.collection('userLikes').where('userName', '==', req.user.userName);
    const userLikesAsTarget = db.collection('userLikes').where('target', '==', req.user.userName);
    const friendRequest = db.collection('friendRequests').where('sender', '==', req.user.userName);
    const friendRequestAsRecipient = db.collection('friendRequests').where('recipient', '==', req.user.userName);
    var batch = db.batch();
    firebase.auth().currentUser
    .delete()
    .then(() => db.doc(`/users/${req.user.userName}`).get())
    .then(doc => {
        if(!doc.exists){
                return res.status(404).json({error: 'User not found'})
            } else {
                return notiAsSenderDoc.get()
            }
        })
        .then(data => {
            if(!data.empty) data.forEach(doc => batch.delete(db.doc(`/notifications/${doc.id}`)))
            
            return notiAsRecipient.get()
        })
        .then(data => {
            if(!data.empty) data.forEach(doc => batch.delete(db.doc(`/notifications/${doc.id}`)))
            
            return hids.get()
        })
        .then(data => {
            if(!data.empty) data.forEach(doc => batch.delete(db.doc(`/hids/${doc.id}`)))
            
            return hidLikes.get()
        })
        .then(data => {
            if(!data.empty) data.forEach(doc => batch.delete(db.doc(`/hidLikes/${doc.id}`)))
            
            return comments.get()
        })
        .then(data => {
            if(!data.empty) data.forEach(doc => batch.delete(db.doc(`/hidComments/${doc.id}`)))
            
            return userLikes.get()
        })
        .then(data => {
            if(!data.empty) data.forEach(doc => batch.delete(db.doc(`/userLikes/${doc.id}`)))
            
            return userLikesAsTarget.get() 
        })
        .then(data => {
            if(!data.empty) data.forEach(doc => batch.delete(db.doc(`/userLikes/${doc.id}`)))
            
            return friendRequest.get()
        })
        .then(data => {
            if(!data.empty) data.forEach(doc => batch.delete(db.doc(`/friendRequests/${doc.id}`)))
            return friendRequestAsRecipient.get()
        })
        .then(data =>{
            if(!data.empty) data.forEach(doc => batch.delete(db.doc(`/friendRequests/${doc.id}`)))
            return db.doc(`/friendLists/${req.user.userName}`).delete()
        })
        .then(() => db.doc(`/users/${req.user.userName}`).delete())
        .then(() => batch.commit())
        .then(() => res.json({message: "Delete user successfully"}))
        .catch(err => res.status(500).json({error: err})); 
}
// Add Friend 
exports.sendFriendRequest = (req, res) => {
    if(req.user.userName == req.params.userName) return res.status(400).json({error: "You can't send Friend Request to yourself"})
    const myFriendList = db.doc(`/friendLists/${req.user.userName}`)
    const theirFriendList = db.doc(`/friendLists/${req.params.userName}`)
    
    db.doc(`/users/${req.params.userName}`)
    .get()
    .then(doc => {
        if(doc.exists) {
            return myFriendList.get()
        } else {
            return res.status(404).json({error: "User not found"})
        }
    })
    .then(doc => {
        if(doc.exists){
            if(doc.data().friendList && doc.data().friendList.includes(req.params.userName)) {
                return res.status(400).json({error: "This user have already been your friend list"})
            }  else {
                return theirFriendList.get()
            }
        }
    })
    .then(doc => {
        if(doc.exists){
            if(doc.data().friendList && doc.data().friendList.includes(req.user.userName)){
                return res.status(400).json({error: "you have already been their friend list"})
            } else {
                return db.collection('friendRequests')
                .where('sender', '==', req.params.userName)
                .where('recipient', '==', req.user.userName)
                .limit(1)
                .get()
            }
        }
    })
    .then(data => {
        if(!data.empty) {
            return res.status(400).json({error: "You have an Friend request from them"})
        } else {
            return db.collection('friendRequests')
                .where('sender', '==', req.user.userName)
                .where('recipient', '==', req.params.userName)
                .limit(1)
                .get()
        }

    })
    .then(data => {
        if(!data.empty){
            return res.status(400).json({error: "Cann't send friend request because you have sended already"})
        } else {
            var newDate = new Date();
            newDate.setHours(newDate.getHours() + 7)
            return db.collection('friendRequests').add({
                read: false,
                sender: req.user.userName,
                senderBio: req.user.bio,
                senderImage: req.user.imageUrl,
                recipient: req.params.userName,
                createdAt: newDate.toLocaleString('vi-VN')
            })
        }
    })
    .then(() => res.json({message: "send friend request successfully"}))
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: err})
    })
}

exports.answerFriendResquest = (req, res) => {
    const result = String(req.params.result).toLocaleLowerCase();
    const myFriendList = db.doc(`/friendLists/${req.user.userName}`);
    const theFriendReqDoc = db.doc(`/friendRequests/${req.params.friendRequestId}`)
    var sender;
    
    if(result == "accept") {
        theFriendReqDoc
        .get()
        .then(doc => {
            if(doc.exists) {
                sender = doc.data().sender;
                if(doc.data().recipient !== req.user.userName) return res.status(400).json({error: "Can't answer the Friend request"});
                return db.doc(`/users/${sender}`).get()
            } else {
                return res.status(404).json({error: "Friend Request not found"})
            }
        })
        .then(doc => {
            if(doc.exists){
                return myFriendList.get()
            } else {
                return res.status(404).json({error: "Sender not found"})
            }
        })
        .then(doc => {
            if(doc.exists){
                if(doc.data().friendList && doc.data().friendList.includes(sender)){
                    return res.status(400).json({error: "This user have already been in your friend list"})
                } else {
                    return db.doc(`/friendLists/${sender}`).get()
                }
            }
        })
        .then(doc => {
            if(doc.exists) {
                if(doc.data().friendList && doc.data().friendList.includes(req.user.userName)) {
                    return res.status(400).json({error: "You have already been in their friend list"})
                } else {
                    return myFriendList.get()
                }
            }
        })
        .then(doc => {
            if(doc.exists){
                var myList = doc.data().friendList;
                myList.push(sender);
                return myFriendList.update({friendList: myList})
            }
        })
        .then(() => db.doc(`/friendLists/${sender}`).get())
        .then(doc => {
            var theirList = doc.data().friendList;
            theirList.push(req.user.userName);
            return db.doc(`/friendLists/${sender}`).update({friendList: theirList})
        })
        .then(() => {
            return theFriendReqDoc.delete()
        })
        .then(() => {
            return res.json({message: "you two are now friend"})
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err})
        })
    } else if(result == "deny"){    
        theFriendReqDoc
        .get()
        .then(doc => {
            if(doc.exists){
                if(doc.data().recipient !== req.user.userName) return res.status(400).json({error: "Can't answer the Friend request"});
                return theFriendReqDoc.delete()
            } else {
                return res.status(404).json({error: "Friend request not found"})
            }
        })
        .then(() => {
            return res.json({message: "Deny the friend request successfuly"})
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err})
        })
    } else {
        return res.status(400).json({error: "Invalid answer"})
    }
} 

// mark the notification to read
exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, {read: true})
    });
    batch.commit()
        .then(() => {
            return res.json({message: 'Notifications marked read'})
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err})
        })
}

exports.markFriendRequestsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach(requestId => {
        const friendRequest = db.doc(`/friendRequests/${requestId}`);
        batch.update(friendRequest, {read: true})
    });
    batch.commit()
        .then(() => {
            return res.json({message: 'Friend request marked read'})
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err})
        })
}

exports.deleteNotification = (req, res) => {
    db.doc(`/notifications/${req.params.notiId}`)
        .get()
        .then(doc => {
            if(doc.exists) {
                if(doc.data().recipient !== req.user.userName) return res.status(400).json({error: "Can't delete other user's notification"})
                return doc.ref.delete()
            } else {
                return res.status(404).json({error: "Notification not found"})
            }
        })
        .then(() => res.json({message: "Delete notification done"}))
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err})
        })
}
