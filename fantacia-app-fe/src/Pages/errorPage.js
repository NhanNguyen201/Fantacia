import React from 'react';
import ErrorPaper from '../SubComponent/ErrorPaper/ErrorPaper';

const ErrorPage = () => {
    let message = {
        status: 404,
        data: {
            error: "Page not found"
        }
    }
    return <ErrorPaper error={message}/>
}
export default ErrorPage;