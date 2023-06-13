const $ = require('jquery');

const animateCard = (fromId, toId, card, animationDuration, startRotationParam, scaling, handWidthId, callback) => {

    // Man muss nur einmal die Zeit messen
    let inactiveBlocker = false;

    // Time the Tab is inactive
    let inactiveStartTime = null;

    // wenn true -> Animation stoppen
    let stoppingAnimation = false;

    const tabInactiveCardHanlder = () => {

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
    document.addEventListener('visibilitychange', tabInactiveCardHanlder);

    const stopAnimation = () => {
        // Event Hanlder löschen
        document.removeEventListener('visibilitychange', tabInactiveCardHanlder);

        if(handWidthId !== undefined) {
            $('#' + handWidthId).css({ width: '0px' });
        }

        callback();
    }

    // Laufzeit
    let duration = animationDuration;

    // Startzeitpunkt der Animation
    let startTime;

    // Sidebar abziehen
    let sidebarWidth = $('#sidebar-wrapper').width();

    let chatWindowMargin = parseInt($('#sidebar-chat').css('marginLeft'));
    let rulesWindowMargin = parseInt($('#sidebar-rules').css('marginLeft'));

    let windowWidth = parseInt($('#sidebar-rules').css('width'));

    let widthDiff;

    // Wenn Chat und Rules nicht angzeigt werden
    if(chatWindowMargin === rulesWindowMargin) {
        widthDiff = sidebarWidth;

    // Wenn Chat ausgefahren
    } else if(chatWindowMargin > rulesWindowMargin) {
        widthDiff = chatWindowMargin + windowWidth;

    // Wenn Rules ausgefahren
    } else {
        widthDiff = rulesWindowMargin + windowWidth;

    }
    
    // Titel Höhe abziehen
    let titleHeight = $('#titleWrapper').height();

    let fromElement = $('#' + fromId).offset();
    let toElement = $('#' + toId).offset();

    // Spieler ist disconnected
    if(toElement === undefined || fromElement === undefined) {
        stopAnimation();
        return;
    }

    // X Position
    let startPosAbsX = fromElement.left - widthDiff;
    let endPosAbsX = toElement.left - widthDiff;

    // Y Position
    let startPosAbsY = fromElement.top - titleHeight;
    let endPosAbsY = toElement.top - titleHeight;

    // Z Rotation
    let startRotationZ = 0;
    let endRotationZ = card.rotation;

    // Y Rotation
    let startRotationY = startRotationParam;
    let endRotationY = -180;

    // X Scaling
    let startScaleX = $('#' + fromId).width();
    let endScaleX = $('#' + toId).width();

    // Y Scaling
    let startScaleY = $('#' + fromId).height();
    let endScaleY = $('#' + toId).height();

    // Spieler ist disconnected
    if(toElement === undefined) {
        stopAnimation();
        return;
    }

    // Animationsfunktion
    const easeOutCirc = (x) => {
        return 1 - (1 - x) * (1 - x);
    }

    const initAnimation = (timestamp) => {
        startTime = timestamp;

        $('#' + card.id + '-animate-wrapper').css({ left: startPosAbsX + 'px' });
        $('#' + card.id + '-animate-wrapper').css({ top: startPosAbsY + 'px' });

        if(card.rotation !== undefined) {
            $('#' + card.id + '-animate-wrapper').css({ transform: 'rotateZ(' + startRotationZ + 'deg)' });
        }

        if(startRotationParam !== undefined) {
            $('#' + card.id + '-animate').css({ transform: 'rotateY(' + startRotationY + 'deg)' });
        }

        if(handWidthId === 'uno-my-card-wrapper-' + card.id) {
            $('#' + handWidthId ).addClass('invisible');
        }

        // Scaling
        $('#' + card.id + '-animate').css({ width: startScaleX + 'px' });
        $('#' + card.id + '-animate').css({ height: startScaleY + 'px' });

        $('#' + card.id + '-animate-wrapper').css({ width: startScaleX + 'px' });
        $('#' + card.id + '-animate-wrapper').css({ height: startScaleY + 'px' });

        $('#' + card.id + '-animate-wrapper').removeClass('invisible');

        requestAnimationFrame(animate);
    }

    const animate = (timestamp) => {
        if(timestamp - startTime < duration && !stoppingAnimation) {
            let p = (timestamp - startTime) / duration;
            let val = easeOutCirc(p);

            // Für das verschieben in X Richtung
            let posX = startPosAbsX + (endPosAbsX - startPosAbsX) * val;

            // Für das verschieben in Y Richtung
            let posY = startPosAbsY + (endPosAbsY - startPosAbsY) * val;

            // Für die Z Rotation
            let rotZ = startRotationZ + (endRotationZ - startRotationZ) * val;

            // Für die Y Rotation
            let rotY = startRotationY + (endRotationY - startRotationY) * val;

            // Für die X Scaling
            let scalX = startScaleX + (endScaleX - startScaleX) * val;

            // Für die Y Scaling
            let scalY = startScaleY + (endScaleY - startScaleY) * val;

            // Wenn die Karte rotiert werden soll
            if(card.rotation !== undefined) {
                $('#' + card.id + '-animate-wrapper').css({ transform: 'rotateZ(' + rotZ + 'deg)' });
            }

            // Wenn die Karte geflippt werden soll
            if(startRotationParam !== undefined) {
                $('#' + card.id + '-animate').css({ transform: 'rotateY(' + rotY + 'deg)' });
            }

            // Wenn die Karte skaliert wird
            if(scaling) {
                $('#' + card.id + '-animate-wrapper').css({ width: scalX + 'px' });
                $('#' + card.id + '-animate-wrapper').css({ height: scalY + 'px' });

                $('#' + card.id + '-animate').css({ width: scalX + 'px' });
                $('#' + card.id + '-animate').css({ height: scalY + 'px' });

            }

            // Wenn zur hand oder aus der Hand
            if(handWidthId !== undefined) {

                // Aus der Hand
                if(handWidthId === 'uno-my-card-wrapper-' + card.id) {
                    let handWidthX = startScaleX + (0 - startScaleX) * val;
                    $('#' + handWidthId).css({ width: handWidthX + 'px' });

                // In die Hand
                } else {
                    let handWidthX = 0 + (endScaleX - 0) * val;

                    $('#' + handWidthId).css({ width: handWidthX + 'px' });

                    let toElement = $('#' + toId).offset();

                    // Spieler ist disconnected
                    if(toElement === undefined) {
                        stopAnimation();
                        return;
                    }

                    endPosAbsX = toElement.left - widthDiff;
                }
            }

            $('#' + card.id + '-animate-wrapper').css({ left: posX + 'px' });
            $('#' + card.id + '-animate-wrapper').css({ top: posY + 'px' });

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

module.exports = { animateCard }