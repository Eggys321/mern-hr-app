import React from 'react';
import errorImg from "../assets/errorImg.svg"
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <>
    <main className='container text-center pt-5'>
        <img src={errorImg} alt="error-image" className='' style={{width:"50%"}}/>
        <h1>Page Not Found</h1>
        <p className="text-muted">The page you're looking for doesn't exist or may have been moved.</p>
        <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
    </main>
    </>
  )
}

export default Error
