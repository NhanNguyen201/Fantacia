import React, { useState } from 'react';
import MyRoundBtn from '../../../Util/MyRoundBtn';
//mui
import Popover from '@material-ui/core/Popover';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import EditHid from '../EditHid/EditHid';
import DeleteHid from '../DeleteHid/DeleteHid';
export default function EditAndDeletePopover({hidId}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <MyRoundBtn onClick={handleClick} tip={open ? "Close" : "Edit this hid"}>
        {open ? <CloseIcon color="primary" fontSize="large"/> : <ExpandMoreIcon color="primary" fontSize="large"/>}
      </MyRoundBtn>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div>
            <EditHid hidId={hidId}/>
            <DeleteHid hidId={hidId}/>
        </div>
      </Popover>
    </div>
  );
}