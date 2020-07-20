const { db } = require('../Util/admin');
const config = require('../Util/config');

exports.exploreGroups = (req, res) => {
    db.collection('groups')
        .get()
        .then(data => {
            var allGroups = [];
            if(!data.empty){
                data.forEach(doc => {
                    allGroups.push({
                        avatarIcon: doc.data().avatarIcon,
                        name: doc.data().name,
                        member: doc.data().member,
                        groupId: doc.id
                    })
                })
            }
            return res.json(allGroups)
        })
        .catch(err => {
            console.error({error: err})
        })
}
// create group
exports.createGroup = (req, res) => {
    if(req.body.name.replace(/\s+/g, '').toLowerCase() == "none") return res.status(400).json({error: "Unable to create group with that name"})
    const defaultlGroupIcon = 'group.png';
    let newDate = new Date();
    newDate.setHours(newDate.getHours() + 7)
    const newGroup = {
        createdBy: req.user.userName,
        createdAt: newDate.toLocaleString('vi-VN'),
        name: String(req.body.name).trim(),
        member: 1,
        avatarIcon: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultlGroupIcon}?alt=media`
    }
    db.collection('groups')
        .add(newGroup)
        .then(doc => {
            req.user.groups.push({
                name: newGroup.name,
                groupId: doc.id
            })
            return db.doc(`/users/${req.user.userName}`).update({groups: req.user.groups})
        })
        .then(() => {
            return res.json({message: "Create and join group successfully"})
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: err})
        })
}

// join group
exports.joinGroup = (req, res) => {
    const groupId = req.params.groupId;
    var groupData;
    db.doc(`/groups/${groupId}`)
        .get()
        .then(doc => {
            if(!doc.exists) return res.status(404).json({error: "This group doesn't exist"})
            groupData = {...doc.data(), groupId};
            return db.doc(`/users/${req.user.userName}`).get()
        })
        .then(doc => {
            if(doc.exists) {
                var groups = doc.data().groups;
                if(groups){
                    if(groups.some(group => group.groupId === groupId)) {
                        return res.status(400).json({error: "You have joined this group already"})
                    }
                } else {
                    groups = [];
                }
                groups.push({
                    name: groupData.name,
                    groupId: groupId
                })
                return db.doc(`/users/${req.user.userName}`).update({groups})
            } else {
                return res.status(404).json({error: 'User not found'})
            }
        })
        .then(() => {
            if(groupData.member) {
                groupData.member++;
            } else {
                groupData.member = 1
            }
            return db.doc(`/groups/${groupId}`).update({member: groupData.member})
        })
        .then(() => res.json(groupData))
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err})
        })
}
// leave group
exports.leaveGroup = (req, res) => {
    const groupId = req.params.groupId;
    db.doc(`/groups/${groupId}`)
        .get()
        .then(doc => {
            if(!doc.exists) return res.status(404).json({error: "This group doesn't exist"})
            return db.doc(`/users/${req.user.userName}`).get()
        })
        .then(doc => {
            if(doc.exists) {
                var groups = doc.data().groups;
                if(groups){
                    if(groups.some(group => group.groupId === groupId)) {
                        groups.splice(groups.find(group => group.groupId === groupId), 1)
                        return db.doc(`/users/${req.user.userName}`).update({groups})
                    } else {
                        return res.status(400).json({error: "You haven't joined this group yet"})
                    }
                } else {
                    return res.status(400).json({error: "You haven't joined any group yet"})
                }
            } else {
                return res.status(404).json({error: 'User not found'})
            }
        })
        .then(() => {
            return db.doc(`/groups/${groupId}`).get()
        })
        .then(doc => {
            var member = doc.data().member;
            if(member) {
                member--;
            } else {
                member = 0
            }
            return db.doc(`/groups/${groupId}`).update({member})
        })
        .then(() => {
            return res.json({message: "Leave group successfully"})
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err})
        })
}