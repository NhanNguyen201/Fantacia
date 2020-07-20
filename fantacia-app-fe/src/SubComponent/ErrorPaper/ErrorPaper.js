import React from 'react';
import './ErrorPaper.scss'
const ErrorPaper = ({ error }) => {
    return (
        <div className="error-paper">
            {(error && error.status) && <h1 className="error-code">{error.status}</h1>}
            {(error && error.data) && <p className="error-message">{error.data.error}</p>}
        </div>
    )
}

export default ErrorPaper

