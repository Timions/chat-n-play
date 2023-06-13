import Header from "../../Home/Header/Header";
import Footer from "../Footer";

import imagePrivacyPolicy from '../../../img/PrivacyPolicy.png'

import './PrivacyPolicy.css'


function PrivacyPolicy (){

    return(
        <div id='privacy-policy'>
            <header id='privacy-policy-header'>
                <Header/>
            </header>
            <div id="content-privacy-policy">
                <div id="main-privacy-policy">
                    <img src={imagePrivacyPolicy} alt="Datenschutzerklärung" className="title-image-footer"/>
                    <div id = 'privacy-policy-hdm'>
                        <p className="text-privacy-policy">Es werden langfristig keine personenbezogenen Daten abgespeichert. </p>
                        <h2 id="headline-privacy-policy">Audio, Video und Textdateien</h2>
                        <p className="text-privacy-policy">Um die Video- und Chatfunktion während eines Spiels bereitzustellen, werden entsprechend der Dauer des Spiels die Daten vom Mikrofon und der Webcam Ihres Endgerät verarbeitet. Sie können das Mikrofon und/ oder die Kamera jederzeit selbst über die Buttons in der Sidebar (links) abschalten. Im Chat werden Ihre Eingaben verarbeitet und mit Ihrem selbst gewählten Namen angezeigt.</p>  
                        <p className="text-privacy-policy">Da dieser Server von der HdM gehostet wird, entnehmen Sie bitte weiteres der <a id="link-privacy-policy" href ='https://www.hdm-stuttgart.de/datenschutz'>Datenschutzerklärung der Hochschule der Medien</a>.</p>
                    </div>
                </div>
            </div>
            <footer className = "footer">
                <Footer/>
            </footer>   
        </div>
    )
}

export default PrivacyPolicy;