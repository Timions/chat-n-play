import Header from '../../Home/Header/Header';
import Footer from '../Footer';
import Member from './Member/Member';

import './AboutUs.css'

import imageAboutUs from '../../../img/AboutUs.png'

function AboutUs (){

    return(
        <div id='aboutus'>
            <header id='aboutus-header'>
                <Header/>
            </header>
            <div id="content-aboutus">
            <img src={imageAboutUs} alt="Über Uns" className="title-image-footer"/>
            <div className="container container-about-us">
                <div className="row about-us-main">
                    <div id = "aboutus-team" className = "col-sm aboutus-content">
                            <h2 className="aboutus-headline">Unser Team</h2>
                            <Member name = 'Timothy Geiger' role = 'Developer/ Design'></Member>
                            <Member name = 'Alexander Kraus' role = 'Developer/ Design'></Member>
                            <Member name = 'Susanne Weiß' role = 'Developer/ Design'></Member>
                            <Member name = 'Kira Frankenfeld' role = 'UI/ UX Design'></Member>
                    </div>
                    <div id="aboutus-project" className = " col-sm aboutus-content">
                            <h2 className="aboutus-headline">Unser Projekt</h2>
                            <p>Die virtuelle Spielesammlung "Chat N' Play" entstand im Rahmen unseres Softwareprojekts. </p>
                            <p>In den letzten Monaten war es besonders schwer, über weite Distanzen Freundschaften aufrecht zu erhalten. Deshalb kam uns die Idee, die Plattform "Chat N' Play" zu entwickeln. Egal ob ihr euch aufgrund der Coronapandemie nicht treffen könnt, eure Freunde*innen tausende Kilometer entfernt wohnen oder ihr einfach keine Lust habt, abends aus dem Haus zu gehen - mit "Chat N' Play" hat man trotzdem die Möglichkeit, zu quatschen und spielen.
                            </p>
                    </div>
                </div>
            </div>
            </div>
            <footer className = "footer">
                <Footer/>
            </footer>    
        </div>
    )
}

export default AboutUs;