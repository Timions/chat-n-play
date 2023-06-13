import { useRef } from 'react';
import $ from 'jquery';

import Header from "../../Home/Header/Header";
import Footer from "../Footer";

import imgMail from '../../../img/Mail.png'
import imageFAQ from '../../../img/FAQ.png'

import '../Footer.css'
import './FAQ.css'

function FAQ () {

    const collapsedItemsRef = useRef([]);

    const setCollapse = (index) => {
        let collapseIndex = collapsedItemsRef.current.findIndex(c => c === index);

        // Wird ausgeklappt
        if(collapseIndex === undefined || collapseIndex === -1) {
            $('#button-question' + (index + 1)).css({ transform: 'rotateZ(90deg)' });

            collapsedItemsRef.current.push(index);

        // Wird eingeklappt
        } else {
            $('#button-question' + (index + 1)).css({ transform: 'rotateZ(0deg)' });

            collapsedItemsRef.current.splice(collapseIndex, 1);
        }
    }

    return(
        <div id='faq'>
            <header id='faq-header' className="sticky-top">
                <Header/>
            </header>
            <img src={imageFAQ} alt="FAQ" className="title-image-footer"/>
            <div id = 'faq-questions'>
                <div className="d-flex question-faq">
                    <button type="button" className ="button-faq" id="button-question1" data-toggle="collapse" data-target="#answer1" aria-expanded="false" aria-controls="collapseExample" onClick={ () => setCollapse(0) }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                    </button>
                    <p className="faq-question-text">Wie kann ich im Browser in den Vollbildmodus wechseln?</p>
                </div>
                <p className="answer collapse" id="answer1" >Über F11 kannnst du in den Browsern Chrome, Firefox und Microsoft Edge in den Vollbildmodus wechseln.
                <br/>
                <br/>
                </p>

                <div className="d-flex question-faq">
                    <button type="button" className ="button-faq" id="button-question2" data-toggle="collapse" data-target="#answer2" aria-expanded="false" aria-controls="collapseExample" onClick={ () => setCollapse(1) }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                    </button>
                <p className="faq-question-text">Wie kann ich mein Mikrofon in Chrome wechseln?</p>
                </div>
                <p className="answer collapse" id="answer2">Wechsle in Chrome in die Browsereinstellungen (3 Punkte oben rechts). Unter "Datenschutz und Sicherheit" &gt;  "Website-Einstelllungen" &gt;  "Berechtigungen" &gt;  "Mikrofon" kannst du im Menü das Mikrofon wechseln. Anschließend muss der Browser neu gestartet werden.
                <br/>
                <br/>
                </p>

                <div className="d-flex question-faq">
                    <button type="button" className ="button-faq" id="button-question3" data-toggle="collapse" data-target="#answer3" aria-expanded="false" aria-controls="collapseExample" onClick={ () => setCollapse(2) }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                    </button>
                <p className="faq-question-text">Zu wievielt kann ein Spiel gespielt werden?</p>
                </div>
                <p className="answer collapse" id="answer3">Jedes Spiel kann von mindestens zwei und maximal vier Spielenden gespielt werden.
                <br/>
                <br/>
                </p>

                <div className="d-flex question-faq">
                    <button type="button" className ="button-faq" id="button-question4" data-toggle="collapse" data-target="#answer4" aria-expanded="false" aria-controls="collapseExample" onClick={ () => setCollapse(3) }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                    </button>
                <p className="faq-question-text">Wie kann ich einen Raum erstellen?</p>
                </div>
                <p className="answer collapse" id="answer4">Ganz unten auf der Startseite findest unter den Kategorien "Brett-, Karten- und Pausenspiele" eine Auswahl von Spielen. Nachdem du ein Spiel ausgewählt hast, kannst du über den Button "Raum erstellen" einen Raum für das jeweilige Spiel erstellen. Du musst nur noch deinen Namen eintragen und schon wurde dein Raum erstellt und du kannst den Link/ Code mit deinen Freunden*innen teilen.
                <br/>
                <br/>
                </p>

                <div className="d-flex question-faq">
                    <button type="button" className ="button-faq" id="button-question5" data-toggle="collapse" data-target="#answer5" aria-expanded="false" aria-controls="collapseExample" onClick={ () => setCollapse(4) }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                    </button>
                <p className="faq-question-text">Wie kann ich einem Raum beitreten?</p>
                </div>
                <p className="answer collapse" id="answer5">Zuerst muss eine Person einen Raum erstellt haben. Nun kannst du dem Spiel direkt über den geteilten Link beitreten oder indem du die Seite "https://chat-n-play.vm.mi.hdm-stuttgart.de" aufrufst und über "Raum beitreten" deinen Namen und den Code einträgst.
                <br/>
                <br/>
                </p>

                <div className="d-flex question-faq">
                    <button type="button" className ="button-faq" id="button-question6" data-toggle="collapse" data-target="#answer6" aria-expanded="false" aria-controls="collapseExample" onClick={ () => setCollapse(5) }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                    </button>
                <p className="faq-question-text">Werde ich aufgezeichnet? Sind die Aufnahmen dauerhaft im Internet zu finden?</p>
                </div>
                <p className="answer collapse" id="answer6">Nein, du musst dir keine Sorgen machen. Wir verarbeiten lediglich während des Spiels deine Video- und Audiodaten, um euch einen Videochat zur Verfügung zu stellen. Das Material wird weder aufgezeichnet, noch gespeichert oder an Dritte weitergegeben. Sobald du einem Raum beigetreten bist, kannst du jederzeit dein Mikrofon stummschalten oder deine Kamera ausschalten.
                <br/>
                <br/>
                </p>

            <img src={imgMail} id="image-mail" alt=""/>
            </div>
            <div className="d-flex justify-content-center" id='faq-email'>
                <p id="paragraph-faq">Deine Frage wurde nicht beantwortet? Dann schreib uns einfach eine E-Mail an: chat-n-play@web.de</p>
            </div>
            <footer className = "footer">
                <Footer/>
            </footer>   
        </div>
    )
}

export default FAQ;