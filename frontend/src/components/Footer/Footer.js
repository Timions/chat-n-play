import { socket } from "../../services/socket";
import {  useEffect, useCallback } from 'react';
import { useHistory } from "react-router-dom";

import './Footer.css'


function Footer(){

    // Router Stuff
    const history = useHistory();

    const handleFooterEvent = useCallback((data) => {

    history.push({
        pathname: data.route,
    });
    
    
    }, [history]);
    
    
    // Socket Events
    useEffect(() => {
    
    socket.on('footer:change', handleFooterEvent);
    
    return () => {
        // Events unmounten
        socket.off('footer:change', handleFooterEvent);
    };
    
    }, [handleFooterEvent]);
    

    const openAboutus = () => {
        socket.emit('footer:aboutus');
    }

    const openFaq = () => {
        socket.emit('footer:faq');
    }

    const openPolicy = () => {
        socket.emit('footer:privacypolicy');
    }

    const openStart = () => {
        socket.emit('footer:start');
    }

    return(
        <footer className="footer">
            <div id="container-footer">
                <input id = "btn-startpage" type='button' value='Startseite' className="text-footer" onClick={ openStart } />
                <input id = "btn-about-us" type='button' value='Über uns' className="text-footer" onClick={ openAboutus } />
                <input id = "btn-faq" type='button' value='FAQ' className="text-footer" onClick={ openFaq } />
                <input id = "btn-privacy-policy" type='button' value='Datenschutzerklärung' className="text-footer" onClick={ openPolicy } />
                <span  id = "mail" className="text-footer">E-Mail: chat-n-play@web.de</span>
            </div>
        </footer>
    )


}

export default Footer;