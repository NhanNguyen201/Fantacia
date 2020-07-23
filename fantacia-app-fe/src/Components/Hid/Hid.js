import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { emojify } from 'react-emojione';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// mui
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
//component
import LikeCommentSection from '../LikeAndComment/LikeCommentSection/LikeCommentSection'
import EditAndDeletePopover from '../EditAndDelete/EditAndDeletePopover/EditAndDeletePopover';
import Paper from '@material-ui/core/Paper';
// dayjs
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
// hids dialog
import HidDialog from '../HidDialog/HidDialog';
import StatusDialog from '../StatusDialog/StatusDialog'
import './Hid.scss'
const Hid = ({user, isOpen, hid: {type, userName, bio, userImage, image, hidId, group, body, createdAt, likeCount, commentCount, comments}}) => {
    const locale = {
        name: 'vi',
        relativeTime: {
            future: '%s from now',
            past: '%s ago',
            s: 'few seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'a hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years'
        }
    }
    dayjs.locale(locale, null, true)
    dayjs.extend(relativeTime);
    let location = useLocation();
    let { pathname } = location;
    let isPathIncludeGroup = pathname.split('/').includes('group');
    var resultHid;
    if(type === "textHid"){
        resultHid = (
            <Paper elevation ={4} className="hid">
                <div className="hid-header">
                    <div className="header-info">
                        <img src={userImage} alt="userAvatar" className="userAvatar"/>
                        <div className="header-content">
                            <p className="hid-title"><b><Link to={`/user/${userName}`} className="user-link">{bio}</Link> { !isPathIncludeGroup && (<><ArrowRightIcon style={{transform: "translateY(25%)"}}/>  <Link to={`/group/${group.groupId}`} className="group-link">{group.name}</Link></>)}</b></p>
                            <small><AccessTimeIcon color='primary' className='clock-icon' fontSize='small'/>  {dayjs(createdAt).fromNow()}</small>
                        </div>
                    </div>
                    { user.userName === userName && (<EditAndDeletePopover hidId={hidId} />)}
                </div>
                <div className="hid-body">
                    <p className="body-content">{emojify(body)}</p>
                </div>
                <div className="hid-footer">        
                    <div className="counter">
                        <p>{likeCount > 0 
                            ? <FavoriteIcon color="secondary" style={{transform: "translateY(25%)"}}/> 
                            : <FavoriteBorder color="secondary" style={{transform: "translateY(25%)"}}/>
                        }{likeCount}</p>
                        <p>{commentCount} {commentCount > 1 ? "comments" : "comment"}</p>
                    </div>
                    <hr/>
                    <LikeCommentSection hidId={hidId} comments={comments ? comments : []}/>
                </div>
                {isOpen && (
                    <HidDialog hidId={hidId} groupId={group.groupId} isOpen={isOpen}/>
                )}
            </Paper>
        )
    } else if (type === "photoHid"){
        resultHid = (
            <Paper elevation ={4} className="hid">
                <div className="hid-header">
                    <div className="header-info">
                        <img src={userImage} alt="userAvatar" className="userAvatar"/>
                        <div className="header-content">
                            <p className="hid-title"><b><Link to={`/user/${userName}`} className="user-link">{bio}</Link> { !isPathIncludeGroup && (<><ArrowRightIcon style={{transform: "translateY(25%)"}}/>  <Link to={`/group/${group.groupId}`} className="group-link">{group.name}</Link></>)}</b></p>
                            <small><AccessTimeIcon color='primary' className='clock-icon' fontSize='small'/>  {dayjs(createdAt).fromNow()}</small>
                        </div>
                    </div>
                    { user.userName === userName && (<EditAndDeletePopover hidId={hidId}/>)}
                </div>
                <div className="hid-body">
                    {body && <p className="body-content">{emojify(body)}</p>}
                    <img src={image} alt="hidImage" className="body-content-image"/>
                </div>
                <div className="hid-footer">
                    <div className="counter">
                        <p>{likeCount > 0 
                            ? <FavoriteIcon color="secondary" style={{transform: "translateY(25%)"}}/> 
                            : <FavoriteBorder color="secondary" style={{transform: "translateY(25%)"}}/>
                        }{likeCount}</p>
                        <p>{commentCount} {commentCount > 1 ? "comments" : "comment"}</p>
                    </div>
                    <hr/>
                    <LikeCommentSection hidId={hidId} comments={comments ? comments : []}/>
                </div>
                {isOpen && (
                    <HidDialog hidId={hidId} groupId={group.groupId} isOpen={isOpen}/>
                )}
            </Paper>
        )
    } else if(type === "textStatus"){
        resultHid = (
            <Paper elevation ={4} className="hid"> 
                <div className="hid-header">
                    <div className="header-info">
                        <img src={userImage} alt="userAvatar" className="userAvatar"/>
                        <div className="header-content">
                            <p className="hid-title"><b><Link to={`/user/${userName}`} className="user-link">{bio}</Link></b> has post a status</p>
                            <small><AccessTimeIcon color='primary' className='clock-icon' fontSize='small'/>  {dayjs(createdAt).fromNow()}</small>
                        </div>
                    </div>
                    { user.userName === userName && (<EditAndDeletePopover hidId={hidId} />)}
                </div>
                <div className="hid-body">
                    <p className="body-content">{emojify(body)}</p>
                </div>
                <div className="hid-footer">
                    <div className="counter">
                        <p>{likeCount > 0 
                            ? <FavoriteIcon color="secondary" style={{transform: "translateY(25%)"}}/> 
                            : <FavoriteBorder color="secondary" style={{transform: "translateY(25%)"}}/>
                        }{likeCount}</p>
                        <p>{commentCount} {commentCount > 1 ? "comments" : "comment"}</p>
                    </div>
                    <hr/>
                    <LikeCommentSection hidId={hidId} comments={comments ? comments : []}/>
                </div>
                {isOpen && (
                    <StatusDialog hidId={hidId} isOpen={isOpen}/>
                )}
            </Paper>
        )
    } else if(type === "photoStatus"){
        resultHid = (
            <Paper elevation ={4} className="hid">
                <div className="hid-header">
                    <div className="header-info">
                        <img src={userImage} alt="userAvatar" className="userAvatar"/>
                        <div className="header-content">
                            <p className="hid-title"><b><Link to={`/user/${userName}`} className="user-link">{bio}</Link></b> has posted a photo</p>
                            <small><AccessTimeIcon color='primary' className='clock-icon' fontSize='small'/>  {dayjs(createdAt).fromNow()}</small>
                        </div>
                    </div>
                    { user.userName === userName && (<EditAndDeletePopover hidId={hidId}/>)}
                </div>
                <div className="hid-body">
                    {body && <p className="body-content">{emojify(body)}</p> }
                    <img src={image} alt="hidImage" className="body-content-image"/>
                </div>
                <div className="hid-footer">
                    <div className="counter">
                        <p>{likeCount > 0 
                            ? <FavoriteIcon color="secondary" style={{transform: "translateY(25%)"}}/> 
                            : <FavoriteBorder color="secondary" style={{transform: "translateY(25%)"}}/>
                        }{likeCount}</p>
                        <p>{commentCount} {commentCount > 1 ? "comments" : "comment"}</p>
                    </div>
                    <hr/>
                    <LikeCommentSection hidId={hidId} comments={comments ? comments : []}/>
                </div>
                {isOpen && (
                    <StatusDialog hidId={hidId} isOpen={isOpen}/>
                )}
            </Paper>
        )
    } else if(type === "avatarChange"){
        resultHid = (
            <Paper elevation ={4} className="hid">
                <div className="hid-header">
                    <div className="header-info">
                        <img src={userImage} alt="userAvatar" className="userAvatar"/>
                        <div className="header-content">
                            <p className="hid-title"><b><Link to={`/user/${userName}`} className="user-link">{bio}</Link></b> has changed avatar</p>
                            <small><AccessTimeIcon color='primary' className='clock-icon' fontSize='small'/>  {dayjs(createdAt).fromNow()}</small>

                        </div>
                    </div>
                    { user.userName === userName && (<EditAndDeletePopover hidId={hidId}/>)}
                </div>
                <div className="hid-body">
                    {body && <p className="body-content">{emojify(body)}</p>}
                    <img src={image} alt="hidImage" className="body-content-image avatar"/>
                </div>
                <div className="hid-footer">
                    <div className="counter">
                        <p>
                            {likeCount > 0 
                                ? <FavoriteIcon color="secondary" style={{transform: "translateY(25%)"}}/> 
                                : <FavoriteBorder color="secondary" style={{transform: "translateY(25%)"}}/>
                            }{likeCount}
                        </p>
                        <p>{commentCount} {commentCount > 1 ? "comments" : "comment"}</p>
                    </div>
                    <hr/>
                    <LikeCommentSection hidId={hidId} comments={comments ? comments : []}/>
                </div>
                {isOpen && (
                    <StatusDialog hidId={hidId} isOpen={isOpen}/>
                )}
            </Paper>
        )
    }
    return resultHid;
}
Hid.propTypes = {
    user: PropTypes.object.isRequired,
    hid: PropTypes.object.isRequired,
} 
const mapStateToProps = state => ({
    user: state.user.credentials
})
export default connect(mapStateToProps)(Hid);