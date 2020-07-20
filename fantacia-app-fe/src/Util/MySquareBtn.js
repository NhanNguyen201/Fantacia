import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
export default ({children, onClick, tip, btnClassName, tipClassName, placement}) => (
    <Tooltip title={tip} className={tipClassName} placement={placement}  arrow>
        <Button className={btnClassName} onClick={onClick} style={{textTransform: "none"}}>
            {children}
        </Button>
    </Tooltip>
)