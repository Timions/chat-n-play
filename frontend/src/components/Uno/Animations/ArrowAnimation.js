const $ = require('jquery');

let lastDegrees = 0;

const animateArrow = (duration, isPlayerSelection, toPlayerPosition, isReverse, callback) => {

    // Startzeitpunkt der Animation
    let startTime = 0;

    // Man muss nur einmal die Zeit messen
    let inactiveBlocker = false;

    // Time the Tab is inactive
    let inactiveStartTime = null;

    // wenn true -> Animation stoppen
    let stoppingAnimation = false;

    const tabInactiveCardHandler = () => {

        // Nur einmal ausführen, wenn das erste mal auf den Tab während die Animation schon aktiv ist
        if(inactiveBlocker) {
            return;
        }

        // Wenn man den Tab verlässt während die Animation läuft
        if(!document.hidden) {
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

    // Event handler initialisieren, falls man den Tab wechelt
    document.addEventListener('visibilitychange', tabInactiveCardHandler);

    let endRotation;
    let sumRotation;

    if(toPlayerPosition === 0) {
        endRotation = 225;

    } else if(toPlayerPosition === 2) {
        endRotation = 315;

    } else if(toPlayerPosition === 1) {
        endRotation = 45;

    } else {
        endRotation = 135;

    }

    const stopAnimation = () => {
        // Event Hanlder löschen
        document.removeEventListener('visibilitychange', tabInactiveCardHandler);

        // Pfeil auf exakte Posiiton bringen
        $('#uno-player-arrow').css({ transform: 'rotate(' + endRotation + 'deg)' });

        lastDegrees = endRotation;

        callback();
    }


    if(isPlayerSelection) {
        sumRotation = 360 * 5 + endRotation;

    } else {
        sumRotation = endRotation;
    }

    // Animationsfunktion
    const easeInOutQuad = (x) => {
        return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }

    const initAnimation = (timestamp) => {
        startTime += timestamp;

        $('#uno-player-arrow').css({ transform: 'rotate(' + lastDegrees + 'deg)' });

        requestAnimationFrame(animate);
    }

    const animate = (timestamp) => {
        if(timestamp - startTime < duration && !stoppingAnimation) {
            
            let p = (timestamp - startTime) / duration;
            let val = easeInOutQuad(p);

            // Für das verschieben in X Richtung
            let rot;

            if(isReverse) {
                let diff = sumRotation - lastDegrees;

                if(diff >= 0) {
                    diff -= 360;
                }

                rot = lastDegrees + diff * val;

            } else {
                let diff = sumRotation - lastDegrees;

                if(diff <= 0) {
                    diff += 360;
                }

                rot = lastDegrees + diff * val;

            }

            $('#uno-player-arrow').css({ transform: 'rotate(' + rot + 'deg)' });

            requestAnimationFrame(animate);

        } else {
            stopAnimation();

        }
    }

    // Wenn die Animation anfangen soll, aber Tab inactive ist
    if(document.hidden) {
        inactiveStartTime = window.performance.now();
    }

    requestAnimationFrame(initAnimation);

}

module.exports = { animateArrow }