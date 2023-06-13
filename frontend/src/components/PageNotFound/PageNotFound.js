import React from 'react';
import Header from '../Home/Header/Header';
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';

import './PageNotFound.css'

const NotFound = () => (
  <div className="background">
    <header className="sticky-top">
      <Header/>
    </header>
    <h2 id="error-message">404 - Seite nicht gefunden!</h2>
    <Link to="/">
      <div className='d-flex justify-content-center'>
        <button type="button" className="btn btn-dark btn-lg"> Zur Startseite</button>
      </div>
    </Link>
    <div className = "footer" style={{position: "fixed", bottom: 0, width: "100%"}}>
      <Footer/>
    </div>
  </div>
);

export default NotFound;