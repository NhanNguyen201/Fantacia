import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
export default ({children, onClick, tip, btnClassName, tipClassName, placement}) => (
    <Tooltip title={tip} className={tipClassName} placement={placement} onClick={onClick}>
        <IconButton className={btnClassName}>
            {children}
        </IconButton>
    </Tooltip>
)