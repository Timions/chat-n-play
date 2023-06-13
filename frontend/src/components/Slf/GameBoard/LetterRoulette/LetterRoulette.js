import { useEffect, useRef, useState } from 'react';
import $ from 'jquery';

import './LetterRoulette.css';

function LetterRoulette(props) {

    const [alphabet, setAlphabet] = useState([]);
    const position = useRef(0);
    const letter = useRef(undefined);
    const animationIsPlaying = useRef(false);

    useEffect(() => {
        setAlphabet([...'abcdefghijklmnopqrstuvwxyza']);

    }, []);

    useEffect(() => {
        let tabInactiveHanlder = function(){};

        if(props.letter !== letter.current && !animationIsPlaying.current) {
            letter.current = props.letter;

            // Laufzeit der Animation
            let duration = 6000;

            // Berechnung der untersten Position des Buchstaben Arrays, die angezeigt werden kann
            let allItemsHeight = $('#slf-roulette-inner').height();
            let itemHeight = $('#slf-roulette').height();
            let maxPosition = allItemsHeight - itemHeight;

            // Position, bei dem das Rad stehen bleiben muss
            let destIndex = alphabet.findIndex((l) => l === props.letter);
            let destPos = destIndex * itemHeight;

            // start Position der Animation
            let startPos = position.current;

            // Gibt die Distanz vom Startpunkt bis zum Endpunkt
            let animationDistance = maxPosition * 4 - ((position.current % maxPosition) - destPos);

            // Position wo die Animation stoppen soll. Jedoch ohne (%)
            let destination = position.current + animationDistance;

            // Startpunkt der Animation
            let startTime = 0;

            // Time the Tab is inactive
            let inactiveStartTime = null;

            // wenn true -> Animation stoppen
            let stoppingAnimation = false;

            // Man muss nur einmal die Zeit messen
            let inactiveBlocker = false;

            // Methode zur Berechnung der zu 'laufenden' Distanz
            const easeOutCirc = (x) => {
                return Math.sqrt(1 - Math.pow(x - 1, 2));
            }

            const initRoll = (timestamp) => {
                startTime += timestamp;

                requestAnimationFrame(roll);
            }

            const roll = (timestamp) => {

                // Animation ist noch am Abspielen
                if(timestamp - startTime < duration && !stoppingAnimation) {
                    let p = (timestamp - startTime) / duration;
                    let val = easeOutCirc(p);
                    let x = startPos + (destination - startPos) * val;
                    $('#slf-roulette-inner').css({ top: - (x % maxPosition) + 'px' });

                    requestAnimationFrame(roll);

                // Animation vorbei
                } else {

                    // Damit die Werte nicht zu groß werden
                    position.current = (position.current % maxPosition);

                    // Placeholder anzeigen lassen bei den Kategorie Inputs
                    $('.slf-category-input-guess').attr('placeholder', props.letter.toUpperCase() + '...');

                    animationIsPlaying.current = false;

                    // zur Sicherheit zum Schluss auf die richtige Position setzen
                    $('#slf-roulette-inner').css({ top: - (destIndex * itemHeight) + 'px' });

                    // Event Hanlder löschen
                    document.removeEventListener('visibilitychange', tabInactiveHanlder);

                    // Submit Button aktiviren
                    props.submitBtnDisbaledChangeHandler(false);

                    // Style vom Roulette setzten
                    $('#slf-roulette-container').css({ border: '2px solid rgb(71, 71, 71)' });

                    return;

                }
            }

            // Wenn die Animation anfangen soll, aber Tab inactive ist
            if(document.hidden) {
                inactiveStartTime = window.performance.now();
            }

            // stratet die Animation
            animationIsPlaying.current = true;
            requestAnimationFrame(initRoll);


            tabInactiveHanlder = () => {

                // Nur einmal ausführen, wenn das erste mal auf den Tab während die Animation schon aktiv ist
                if(inactiveBlocker) {
                    return;
                }

                // Wenn man den Tab verlässt während die Animation läuft
                if(!document.hidden) {
                    if(animationIsPlaying.current) {
                        if(inactiveStartTime !== null) {
                            let inactiveTime = window.performance.now() - inactiveStartTime;

                            // Animation noch nicht vorbei 
                            if(inactiveTime < duration) {
                                startTime -= inactiveTime;

                            // Animation schon vorbei
                            } else {
                                stoppingAnimation = true;

                            }

                            inactiveBlocker = true;
                        }
                    }
                }
            }

            // Event handler initialisieren, falls man den Tab wechelt
            document.addEventListener('visibilitychange', tabInactiveHanlder);
        }

    }, [props, alphabet]);

    const itemStyle = {
        color: props.letter === undefined ? 'rgb(139, 139, 139)' : '#444'
    }

    return (
        <div id='slf-roulette-container'>
            <div id='slf-roulette'>
                <div id='slf-roulette-inner'>
                    {
                        alphabet.map((letter, index) => (
                            <div key={ index } className='slf-roulette-item' style={itemStyle}>{ letter.toUpperCase() }</div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default LetterRoulette;