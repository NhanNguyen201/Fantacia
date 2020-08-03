const { db, admin } = require('../Util/admin');
const config = require('../Util/config');

// post a hid
exports.postOneHid = (req, res) => {
    var Filter = require('bad-words'),
    filter = new Filter();

    const groupId = req.params.groupId;
    var groupName;
    if(req.body.body.trim() === ''){
        return res.status(400).json({ error: 'Body must not be empty' })
    }
    db.doc(`/groups/${groupId}`)
        .get()
        .then(doc => {
            if(!doc.exists) return res.status(404).json({error: "this group doesn't exist"});
            if(req.user.groups){
                if(!req.user.groups.some(each => each.groupId === req.params.groupId)) {
                    return res.status(400).json({error: "you have't joined this group yet"})
                }
            } else {
                return res.status(400).json({error: "you haven't joined any group yet"})
            }
            groupName = doc.data().name;
            let newDate = new Date();
            newDate.setHours(newDate.getHours() + 7)
            const newHid = {
                body: filter.clean(req.body.body),
                userName: req.user.userName,
                bio: req.user.bio,
                userImage: req.user.imageUrl,
                createdAt: newDate.toLocaleString('vi-VN'),
                type: "textHid",
                group: {name: groupName, groupId},
                likeCount: 0,
                commentCount: 0
            };
            db.collection('hids')
                .add(newHid)
                .then((doc) => {
                    const resHid = {...newHid, hidId: doc.id};
                    return res.json(resHid)
                })
                .catch(err => {
                    res.status(500).json({ error: 'something went wrong'})
                    console.log(err);
                })
        })
}
// post a photo to a group
exports.postPhotoHid = (req, res) => {
    const groupId = req.params.groupId;
    var groupName;
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
        db.doc(`/groups/${groupId}`)
        .get()
        .then(doc => {
            if(!doc.exists) return res.status(404).json({error: "this group doesn't exist"});
            if(req.user.groups){
                if(!req.user.groups.some(each => each.groupId === req.params.groupId)) {
                    return res.status(400).json({error: "you have't joined this group yet"})
                } else {
                    groupName = doc.data().name;
                    return admin.storage()
                        .bucket()
                        .upload(imageToBeUploaded.filepath, {
                            resumable: false,
                            metadata: {
                                metadata: {
                                    contentType: imageToBeUploaded.mimetype
                                }
                            }
                        })
                }
            } else {
                return res.status(400).json({error: "you haven't joined any group yet"})
            }
        })      
        .then(async () => {
            const imageHid = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            let newDate = new Date();
            newDate.setHours(newDate.getHours() + 7)
            const newHid = {
                userName: req.user.userName,
                bio: req.user.bio,
                userImage: req.user.imageUrl,
                image: imageHid,
                createdAt: newDate.toLocaleString('vi-VN'),
                type: "photoHid",
                group: {name: groupName, groupId},
                likeCount: 0,
                commentCount: 0
            }
            try {
                const doc = await db.collection('hids').add(newHid);
                const resHid = {...newHid, hidId: doc.id};
                return res.json(resHid);
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({error: err});
            }
        })
        
    });
    busboy.end(req.rawBody);
}
// edite a hid
exports.editHid = (req, res) => {
    var Filter = require('bad-words'),
    filter = new Filter();
    var docData;
    db.doc(`/hids/${req.params.hidId}`)
        .get()
        .then(doc => {
            if(doc.exists) {
                if(doc.data().userName !== req.user.userName) return res.status(400).json({error: "Request can't be excecuted"})
                docData = doc.data();
                docData.hidId = doc.id;
                docData.body = filter.clean(req.body.body);
                return doc.ref.update({body: docData.body})
            } else {
                return res.status(404).json({error: "Hid not found"})
            }
        })
        .then(() => res.json(docData))
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err})
        })
}

exports.postStatus = (req, res) => {
    var Filter = require('bad-words'),
    filter = new Filter();
    if(req.body.body.trim() === ''){
        return res.status(400).json({ error: 'Body must not be empty' })
    }
    let newDate = new Date();
    newDate.setHours(newDate.getHours() + 7)
    const newStatus = {
        body: filter.clean(req.body.body),
        userName: req.user.userName,
        bio: req.user.bio,
        userImage: req.user.imageUrl,
        createdAt: newDate.toLocaleString('vi-VN'),
        type: "textStatus",
        group: {name: "none", groupId: "none"},
        likeCount: 0,
        commentCount: 0
    }
    db.collection('hids')
        .add(newStatus)
        .then(doc => {
            const resStatus = {...newStatus, hidId: doc.id}
            return res.json(resStatus)
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err})
        })
}
// post a photo status

exports.postPhotoStatus = (req, res) => {
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
        admin.storage()
            .bucket()
            .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            })
        .then(async () => {
            const imageStatus = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            let newDate = new Date();
            newDate.setHours(newDate.getHours() + 7)
            const newImageStatus = {
                userName: req.user.userName,
                bio: req.user.bio,
                userImage: req.user.imageUrl,
                image: imageStatus,
                createdAt: newDate.toLocaleString('vi-VN'),
                type: "photoStatus",
                group: {name: "none", groupId: "none"},
                likeCount: 0,
                commentCount: 0
            }
            try {
                const doc = await db.collection('hids').add(newImageStatus);
                    const resHid = {...newImageStatus, hidId: doc.id};
                    return res.json(resHid);
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({error: err});
            }
        })
    });
    busboy.end(req.rawBody);
}


exports.getOneHid = (req, res) => {
    let hidData = {};
    db.doc(`/hids/${req.params.hidId}`).get()
        .then(doc => {
            if(doc.exists){
                hidData = doc.data();
                hidData.hidId = doc.id;
                return db.collection('hidComments')
                    .orderBy('createdAt', 'desc')
                    .where('hidId', '==', req.params.hidId)
                    .get()
            } else {
                return res.status(404).json({error: "hid not found"})
            }
        })
        .then(data => {
            hidData.comments = [];
            if(!data.empty) {
                data.forEach(doc => {
                    hidData.comments.push({...doc.data(), commentId: doc.id})
                })
            }
            return db.collection('hidLikes')
                .where('hidId', '==', req.params.hidId)
                .get()
        })
        .then(data => {
            hidData.likes = [];
            if(!data.empty){
                data.forEach(doc => {
                    hidData.likes.push({...doc.data(), likeId: doc.id})
                })
            }
            return res.json(hidData)
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err})
        })
}

exports.getAllMyViewHid = (req, res) => {
    var myFriendList;
    db.doc(`/friendLists/${req.user.userName}`)
        .get()
        .then(doc => {
            if(doc.exists) myFriendList = doc.data().friendList
            return db.collection('hids')
                    .orderBy('createdAt', 'desc')
                    .get()
        })
        .then(data => {
            let hids = []
            if(!data.empty) {
                data.forEach(doc => {
                    if(req.user.groups && req.user.groups.some(each => each.groupId === doc.data().group.groupId)){
                        hids.push({...doc.data(), hidId: doc.id})
                    } else if(myFriendList.includes(doc.data().userName) && ["textStatus", "photoStatus", "avatarChange"].includes(doc.data().type)){
                        hids.push({...doc.data(), hidId: doc.id})
                    }
                })
            }
            return res.json(hids)
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err})
        })
}

exports.getAllHidsInOneGroups = (req, res) => {
    const groupId = req.params.groupId;
    var groupData = {};
    var myGroups;
    db.doc(`/groups/${groupId}`)
        .get()
        .then(doc => {
            if(!doc.exists) return res.status(404).json({error: "this group doesn't exist"})
            groupData.name = doc.data().name;
            groupData.member = doc.data().member;
            groupData.avatarIcon = doc.data().avatarIcon;
            groupData.groupId = doc.id;
            return db.doc(`/users/${req.user.userName}`).get()
        })
        .then(doc => {
            if(doc.exists) {
                myGroups = doc.data().groups;
                if(!myGroups || !myGroups.some(each => each.groupId === groupId)){                    
                    return res.json({...groupData, dataCode: 400})
                } 
                return db.collection('hids')
                        .orderBy('createdAt', 'desc')
                        .get()
            }
        })
        .then(data => {
            groupData.hids = [];
            if(!data.empty) {
                data.forEach(doc => {
                    if(doc.data().group.groupId === groupId) {
                        groupData.hids.push({...doc.data(), hidId: doc.id})
                    }
                })
            }
            return res.json({...groupData, dataCode: 200})
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err})
        })
}

exports.getMyHids = (req, res) => {
    db.collection('hids')
        .orderBy('createdAt', 'desc')
        .where('userName', '==', req.user.userName)
        .get()
        .then(data => {
            var myHids = [];
            if(!data.empty){
                data.forEach(doc => {
                    myHids.push({...doc.data(), hidId: doc.id})
                })
            }
            return res.json(myHids)
        })
        .catch(err =>{
            console.error(err);
            return res.status(500).json({error: err})            
        })

}

exports.likeHid = (req, res) => {
    let hidData;
    const likeDoc = db.collection('hidLikes')
        .where('userName' , '==', req.user.userName)
        .where('hidId', '==', req.params.hidId)
        .limit(1)
    db.doc(`/hids/${req.params.hidId}`)
        .get()
        .then(doc => {
            if(doc.exists){
                if((!req.user.groups || !req.user.groups.some(each => each.groupId === doc.data().group.groupId)) && !["textStatus", "photoStatus", "avatarChange"].includes(doc.data().type)) return res.status(400).json({error: "you haven't joined this group yet"})
                hidData = {...doc.data(), hidHost: doc.data().userName, hidId: doc.id};
                return likeDoc.get()
            } else {
                return res.status(404).json({error: 'hid not found'})
            }
        })
        .then(data => {
            if(data.empty){
                return db.collection('hidLikes')
                    .add({
                        hidId: hidData.hidId,
                        hidHost: hidData.hidHost,
                        userName: req.user.userName,
                        userImage: req.user.imageUrl,
                        bio: req.user.bio
                    })
                } else {
                    return res.status(400).json({error: 'you have liked this hid already'})
                }
            })
        .then(() => db.collection('hidLikes').where('hidId', '==', req.params.hidId).get())
        .then(data => {
            if(!data.empty){
                hidData.likeCount = data.docs.length
            } else {
                hidData.likeCount = 1
            }
            return db.doc(`/hids/${req.params.hidId}`).update({likeCount: hidData.likeCount})
        })
        .then(() => res.json(hidData))
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err})
        })
}

exports.unlikeHid = (req, res) => {
    let hidData;
    const likeDoc = db.collection('hidLikes')
        .where('userName', '==', req.user.userName)
        .where('hidId', '==', req.params.hidId)
        .limit(1)
    db.doc(`/hids/${req.params.hidId}`)
        .get()
        .then(doc => {
            if(doc.exists){
                if((!req.user.groups || !req.user.groups.some(each => each.groupId === doc.data().group.groupId)) && !["textStatus", "photoStatus", "avatarChange"].includes(doc.data().type)) return res.status(400).json({error: "you haven't joined this group yet"})
                hidData = {...doc.data(), hidId: doc.id};
                return likeDoc.get()
            } else {
                return res.status(404).json({error: 'hid not found'})
            }
        })
        .then(data => {
            if(data.empty){
                return res.status(400).json({error: "you haven't like this hid yet"})
            } else {
                return db.doc(`/hidLikes/${data.docs[0].id}`).delete()
            }
        })
        .then(() => db.collection('hidLikes').where('hidId', '==', req.params.hidId).get())
        .then(data => {
            if(!data.empty){
                hidData.likeCount = data.docs.length
            } else {
                hidData.likeCount = 0
            }
            return db.doc(`/hids/${req.params.hidId}`).update({likeCount: hidData.likeCount})
        })
        .then(() => res.json(hidData))
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err})
        })
}

exports.commentOnHid = (req, res) => {
    var Filter = require('bad-words');
    var filter = new Filter();
    var hidData = {};
    if(req.body.body.trim() === "") return res.status(400).json({comment: "comment mustn't be empty"});
    let newDate = new Date();
    newDate.setHours(newDate.getHours() + 7)
    var newComment = {
        body: filter.clean(req.body.body),
        createdAt: newDate.toLocaleString('vi-VN'),
        userName: req.user.userName,
        bio: req.user.bio,
        userImage: req.user.imageUrl,
        hidId: req.params.hidId
    }
    db.doc(`/hids/${req.params.hidId}`)
        .get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({error: "hid not found"});
            } else {
                if((!req.user.groups || !req.user.groups.some(each => each.groupId === doc.data().group.groupId)) && !["textStatus", "photoStatus", "avatarChange"].includes(doc.data().type)) return res.status(400).json({error: "you haven't joined this group yet"})
                newComment.hidHost = doc.data().userName;
                hidData = doc.data();
                hidData.hidId = doc.id;
                hidData.commentCount++;
                return doc.ref.update({commentCount: hidData.commentCount})
            }
        })
        .then(() => db.collection('hidComments').add(newComment))
        .then(() => db.collection('hidComments')
                        .where('hidId', '==', req.params.hidId)
                        .orderBy('createdAt', 'desc')
                        .get()
        )
        .then(data => {
            var comments = [];
            if(!data.empty) {
                data.forEach(doc => comments.push({...doc.data(), commentId: doc.id}))
            }
            hidData.comments = comments;
        })
        .then(() => res.json(hidData))
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
}

exports.deleteComment = (req, res) => {
    db.doc(`/hidComments/${req.params.commentId}`).get()
    .then(doc => {
        if(doc.exists) {
            if(req.user.userName !== doc.data().userName) return res.status(400).json({error: "Unorthorize"})
            return db.doc(`/hids/${doc.data().hidId}`).get()
        } else {
            return res.status(404).json({error: "comment not found"})
        }
    })
    .then(doc => {
        if(doc.exists) {
            var commentCount = doc.data().commentCount--;
            doc.ref.update({commentCount})
        } 
        return db.doc(`/hidComments/${req.params.commentId}`).delete()
    })
    .then(() => res.json({message: "Delete comment successfully"}))
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: err})
    })
}

exports.deleteHid = (req, res) => {
    const doc = db.doc(`/hids/${req.params.hidId}`);
    doc.get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({error: 'hid not found'})
            }
            if(doc.data().userName !== req.user.userName){
                return res.status.json({error: 'unauthorized'})
            } else {
                return doc.ref.delete()
            }
        })
        .then(() => res.json({message: 'hid deleted successfully'}))
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err})
        })
}