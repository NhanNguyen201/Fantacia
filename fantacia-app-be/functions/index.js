const functions = require('firebase-functions');
const app = require('express')();
const cors = require('cors');
app.use(cors());
const FBAuth = require('./Util/FBAuth');
const { db, admin } = require('./Util/admin');
const { 
    postOneHid,
    postPhotoHid,
    postStatus,
    postPhotoStatus,
    editHid,
    deleteHid,
    getMyHids,
    getAllMyViewHid,
    getAllHidsInOneGroups,
    getOneHid,
    likeHid,
    unlikeHid,
    commentOnHid,
    deleteComment,
} = require ('./handlers/data');
const { 
    signup,
    login,
    updateUserData,
    getOneUser, 
    calcCompatible,
    likeUser,
    unlikeUser,
    uploadImage,
    uploadBackground,
    deleteUser,
    getAuthenticatedUser,
    sendFriendRequest,
    answerFriendResquest,
    markNotificationsRead,
    markFriendRequestsRead,
    deleteNotification,
} = require ('./handlers/user');

const {
    exploreGroups,
    createGroup,
    joinGroup,
    leaveGroup
} = require('./handlers/group')
// data route
// => post hid
app.post('/status', FBAuth, postStatus);
app.post('/status/photo', FBAuth, postPhotoStatus);
app.post('/group/:groupId/hid', FBAuth, postOneHid);
app.post('/group/:groupId/photoHid', FBAuth, postPhotoHid);
app.put('/hid/:hidId/edit', FBAuth, editHid);
app.delete('/hid/:hidId/delete', FBAuth, deleteHid);
// => get hids
app.get('/hids/user', FBAuth, getMyHids);
app.get('/hids/all', FBAuth, getAllMyViewHid);
app.get('/hids/group/:groupId/all', FBAuth, getAllHidsInOneGroups);
// => hid manipulation as guest
app.get('/hid/:hidId/get', FBAuth, getOneHid);
app.get('/hid/:hidId/like', FBAuth, likeHid);
app.get('/hid/:hidId/unlike', FBAuth, unlikeHid);
app.post('/hid/:hidId/comment', FBAuth, commentOnHid);
app.delete('/hid/comment/:commentId/delete', FBAuth, deleteComment);


// user route
// => Personal route
app.post('/signup', signup);
app.post('/login', login);
app.get('/user', FBAuth, getAuthenticatedUser);
app.post('/user/uploadAvatar', FBAuth, uploadImage);
app.post('/user/background', FBAuth, uploadBackground);
app.post('/user/info', FBAuth, updateUserData);
app.delete('/user/delete', FBAuth, deleteUser);
// => Other user route
app.get('/user/:userName/get', FBAuth, getOneUser);
app.get('/user/:userName/calc', FBAuth, calcCompatible);
app.get('/user/:userName/like', FBAuth, likeUser);
app.get('/user/:userName/unlike', FBAuth, unlikeUser);
// => Friend route
app.get('/friend/:userName/add', FBAuth, sendFriendRequest);
app.get('/friend/:friendRequestId/:result', FBAuth, answerFriendResquest)
// => group route

app.get('/groups/explore', FBAuth, exploreGroups);
app.post('/group/create', FBAuth, createGroup);
app.get('/group/:groupId/join', FBAuth, joinGroup);
app.get('/group/:groupId/leave', FBAuth, leaveGroup);

// => notification route
app.post('/friendRequests/read', FBAuth, markFriendRequestsRead);

app.post('/notifications/read', FBAuth, markNotificationsRead);
app.delete('/notification/:notiId', FBAuth, deleteNotification);

exports.api = functions.region('asia-east2').https.onRequest(app);

exports.onUserImageChange = functions.region('asia-east2').firestore.document('/users/{userId}')
    .onUpdate(change => {
        if (change.before.data().imageUrl !== change.after.data().imageUrl){
            let oldFileName;
            let batch = db.batch();
            return db.collection('hids').where('userName', '==', change.before.data().userName).get()
                .then(data => {
                    if(!data.empty) {
                        data.forEach(doc => {
                            const hid = db.doc(`/hids/${doc.id}`);
                            batch.update(hid, {userImage: change.after.data().imageUrl})
                        })
                    }
                    oldFileName = change.before.data().imageUrl.split('/')[change.before.data().imageUrl.split('/').length - 1].split('?')[0]
                    return db.collection('hidComments').where('userName', '==',change.before.data().userName).get()
                })
                .then(data => {
                    if(!data.empty) {
                        data.forEach(doc => {
                            const comment = db.doc(`/hidComments/${doc.id}`);
                            batch.update(comment, {userImage: change.after.data().imageUrl})
                        })
                    }
                    return db.collection('hidLikes').where('userName', '==', change.before.data().userName).get()
                })
                .then(data => {
                    if(!data.empty){
                        data.forEach(doc => {
                            const hidLike = db.doc(`/hidLikes/${doc.id}`);
                            batch.update(hidLike, {userImage: change.after.data().imageUrl})
                        })
                    }
                    return db.collection('userLikes').where('userName', '==', change.before.data().userName).get()
                })
                .then(data => {
                    if(!data.empty){
                        data.forEach(doc => {
                            const userLike = db.doc(`/userLikes/${doc.id}`);
                            batch.update(userLike, {userImage: change.after.data().imageUrl})
                        })
                    }
                    return db.collection('notifications').where('sender', '==', change.before.data().userName).get()
                })
                .then(data => {
                    if(!data.empty){
                        data.forEach(doc => {
                            const noti = db.doc(`/notifications/${doc.id}`);
                            batch.update(noti, {senderImage: change.after.data().imageUrl})
                        })
                    }
                    return db.collection('hids').doc(); 
                })
                .then(doc => {
                    let newDate = new Date();
                    newDate.setHours(newDate.getHours() + 7)
                    batch.set(doc, {
                        userName: change.after.data().userName,
                        bio: change.after.data().bio,
                        userImage: change.after.data().imageUrl,
                        image: change.after.data().imageUrl,
                        createdAt: newDate.toLocaleString('vi-VN'),
                        type: "avatarChange",
                        group: {name: "none", groupId: "none"},
                        likeCount: 0,
                        commentCount: 0
                    })
                })
                .then(() => batch.commit())
        } else return true;
    })
    
exports.onLikeHid = functions.region('asia-east2').firestore.document('hidLikes/{id}')
    .onCreate(snapshot => {
        db.doc(`/hids/${snapshot.data().hidId}`).get()
        .then(doc => {
            if(doc.exists && doc.data().userName !== snapshot.data().userName){
                let newDate = new Date();
                newDate.setHours(newDate.getHours() + 7)
                if(['textHid', 'photoHid'].includes(doc.data().type)){
                    return db.collection('notifications').add({
                        createdAt: newDate.toLocaleString('vi-VN'),
                        recipient: doc.data().userName,
                        sender: snapshot.data().userName,
                        senderBio: snapshot.data().bio,
                        senderImage: snapshot.data().userImage,
                        groupId: doc.data().group.groupId,
                        type: 'hidLike',   
                        read: false,
                        hidId: doc.id,
                        hidLikeId: snapshot.id
                    })
                } else if(['textStatus', 'photoStatus'].includes(doc.data().type)){
                    return db.collection('notifications').add({
                        createdAt: newDate.toLocaleString('vi-VN'),
                        recipient: doc.data().userName,
                        sender: snapshot.data().userName,
                        senderBio: snapshot.data().bio,
                        senderImage: snapshot.data().userImage,
                        type: 'statusLike',   
                        read: false,
                        hidId: doc.id,
                        hidLikeId: snapshot.id
                    })
                } else if(doc.data().type === 'avatarChange'){
                    return db.collection('notifications').add({
                        createdAt: newDate.toLocaleString('vi-VN'),
                        recipient: doc.data().userName,
                        sender: snapshot.data().userName,
                        senderBio: snapshot.data().bio,
                        senderImage: snapshot.data().userImage,
                        type: 'avatarLike',   
                        read: false,
                        hidId: doc.id,
                        hidLikeId: snapshot.id
                    })
                }
            }
        })
        .catch(err => {
            return
        })
})

exports.onUnlikeHid = functions.region('asia-east2').firestore.document('hidLikes/{id}')
    .onDelete(snapshot => {
        db.collection('notifications')
            .where('hidLikeId', '==', snapshot.id)
            .limit(1)
            .get()
            .then(data => {
                if(!data.empty){
                    return db.doc(`/notifications/${data.docs[0].id}`).delete()
                } else return;
            })            
            .catch(err => {
                return
            })
    })

exports.onLikeUser = functions.region('asia-east2').firestore.document('userLikes/{id}')
    .onCreate(snapshot => {
        let newDate = new Date();
        newDate.setHours(newDate.getHours() + 7)
        db.collection('notifications').add({
            createdAt: newDate.toLocaleString('vi-VN'),
            sender: snapshot.data().userName,
            senderBio: snapshot.data().bio,
            senderImage: snapshot.data().userImage,
            recipient: snapshot.data().target,
            type: 'userLike',
            read: false,
            userLikeId : snapshot.id
        })
        .catch(err => {
            console.error(err);
            return;
        })
    })

exports.onUnlikeUser = functions.region('asia-east2').firestore.document('userLikes/{id}')
    .onDelete(snapshot => {
        db.collection('notifications')
            .where('userLikeId', '==', snapshot.id)
            .limit(1)
            .get()
            .then(data => {
                if(!data.empty) {
                    return db.doc(`/notification/${data.docs[0].id}`).delete()
                } else return;
            })
            .catch(err =>{
                return
            })
    })

exports.onComment = functions.region('asia-east2').firestore.document('hidComments/{id}')
    .onCreate(snapshot => {
        db.doc(`/hids/${snapshot.data().hidId}`).get()
        .then(doc => {                
            if(doc.exists && doc.data().userName !== snapshot.data().userName){
                let newDate = new Date();
                newDate.setHours(newDate.getHours() + 7)
                if(['textHid', 'photoHid'].includes(doc.data().type)){
                    return db.collection('notifications').add({
                        createdAt: newDate.toLocaleString('vi-VN'),
                        recipient: doc.data().userName,
                        sender: snapshot.data().userName,
                        senderBio: snapshot.data().bio,
                        senderImage: snapshot.data().userImage,
                        groupId: doc.data().group.groupId,
                        type: 'hidComment',
                        read: false,
                        hidId: doc.id,
                        commentId: snapshot.id
                    })
                } else if(['textStatus', 'photoStatus'].includes(doc.data().type)){
                    return db.collection('notifications').add({
                        createdAt: newDate.toLocaleString('vi-VN'),
                        recipient: doc.data().userName,
                        sender: snapshot.data().userName,
                        senderBio: snapshot.data().bio,
                        senderImage: snapshot.data().userImage,
                        type: 'statusComment',
                        read: false,
                        hidId: doc.id,
                        commentId: snapshot.id
                    })
                } else if(doc.data().type === 'avatarChange') {
                    return db.collection('notifications').add({
                        createdAt: newDate.toLocaleString('vi-VN'),
                        recipient: doc.data().userName,
                        sender: snapshot.data().userName,
                        senderBio: snapshot.data().bio,
                        senderImage: snapshot.data().userImage,
                        type: 'avatarComment',
                        read: false,
                        hidId: doc.id,
                        commentId: snapshot.id
                    })
                }
            }
        })
        .catch(err => {
            console.error(err);
        })
})

exports.onDeleteComment = functions.region('asia-east2').firestore.document('hidComments/{id}')
    .onDelete(snapshot => {
        const hidId = snapshot.data().hidId
        db.collection('notifications')
            .where('commentId', '==', snapshot.id)
            .limit(1)
            .get()
            .then(data => {
                if(!data.empty){
                    return db.doc(`/notifications/${data.docs[0].id}`).delete()
                }
            })
            .catch(err => {
                console.log(err)
            })
    })
exports.onDeleteHid = functions.region('asia-east2').firestore.document('hids/{id}')
    .onDelete(snapshot => {
        var batch = db.batch();
        db.collection('hidLikes')
            .where('hidId', '==', snapshot.id)
            .get()
            .then(data => {
                if(!data.empty){
                    data.forEach(doc => batch.delete(doc.ref))
                } 
                return db.collection('hidComments')
                    .where('hidId', '==', snapshot.id)
                    .get()
                    .then(data => {
                        if(!data.empty) {
                            data.forEach(doc => batch.delete(doc.ref))
                        }
                        return batch.commit()
                    })
            })
            .catch(err => {
                return
            })
    })

exports.onFriendRequest = functions.region('asia-east2').firestore.document('friendRequests/{id}')
    .onCreate(snapshot => {
        db.collection('notifications').add({
            createdAt: snapshot.data().createdAt,
            recipient: snapshot.data().recipient,
            sender: snapshot.data().sender,
            senderBio: snapshot.data().senderBio,
            senderImage: snapshot.data().senderImage,
            type: 'friendRequest',
            read: false,
            friendRequestId: snapshot.id
        })
        .catch(err => {
            return
        })
    })
exports.onFriendListDestroyed = functions.region('asia-east2').firestore.document('friendLists/{id}')
    .onDelete(snapshot => {
        return Promise.all(snapshot.data().friendList.map(each => {
            var doc = db.doc(`/friendLists/${each}`);
            var list = doc.data().friendList;
            var newList = list.filter(friend => friend !== each)
            return db.doc(`/friendLists/${each}`).update({friendList: newList})
        }))
        .catch(err => {
            console.log(err)
            return
        })
    })

