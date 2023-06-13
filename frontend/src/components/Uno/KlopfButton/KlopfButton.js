import $ from 'jquery';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

import './KlopfButton.css';

function KlopfButton(props) {

    // Breite und Höhe der Spieler Kamera
    const [playerWidth, setPlayerWidth] = useState();
    const [playerHeight, setPlayerHeight] = useState();

    const klopfBtnResizeHandler = useCallback(() => {
        setPlayerWidth($('.player').width());
        setPlayerHeight($('.player').height());
    }, []);

    const btnPressEventHandler = useCallback(() => {

    }, []);

    // Width setzten bei Windows resize event
    useLayoutEffect(() => {

        // Wenn die Fenstergröße geändert wird -> Größe anpassen
        window.addEventListener('resize', klopfBtnResizeHandler);

        // Button press Event
        document.getElementById("uno-last-card-btn").addEventListener("click", btnPressEventHandler);

        $('#uno-last-card-btn').prop('checked', true);

        // Farbe setzten
        document.styleSheets[0].insertRule('#uno-last-card-label::after { background: ' + props.color + '; }', 0);
        
        return () => {
            window.removeEventListener('resize', klopfBtnResizeHandler);
            document.getElementById("uno-last-card-btn").removeEventListener("click", btnPressEventHandler);

            // Farbe löschen
            document.styleSheets[0].deleteRule(0);
        }

    }, [klopfBtnResizeHandler, btnPressEventHandler, props.color]);

    // Width setzten am Anfang
    useEffect(() => {
        setPlayerWidth($('.player').width());
        setPlayerHeight($('.player').height());
    }, []);

    let btnStyle;

    // oben links
    if(props.position === 0) {
        btnStyle = {
            top: 40 + 'px',
            left: playerWidth + 70 + 'px'
        }

    // unten rechts
    } else if(props.position === 1) {
        btnStyle = {
            bottom: playerHeight + 60 + 'px',
            right: 40 + 'px'
        }

    // oben rechts
    } else if(props.position === 2) {
        btnStyle = {
            top: 40 + 'px',
            right: playerWidth + 60 + 'px'
        }

    // unten links
    } else {
        btnStyle = {
            bottom: playerHeight + 60 + 'px',
            left: 40 + 'px'
        }

    }

    return (
        <div id='uno-last-card-btn-wrapper' style={ btnStyle }>
            <input id='uno-last-card-btn' name='uno-last-card-btn' className='uno-last-card-btn-not-pressed uno-last-card-btn-pressed' type='radio' value='Klopf!' onClick={ props.clickHandler }/>
            <label id='uno-last-card-label' for='uno-last-card-btn'></label>
        </div>
    );
}

export default KlopfButton;