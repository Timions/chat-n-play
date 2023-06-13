import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import './UnoGameBoard.css';

import { BsArrowRight } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { IconContext } from "react-icons";

import $ from 'jquery';

import SocketContext from "../../../services/socket";
import UnoCard from '../UnoCard/UnoCard';

import { animateCard } from '../Animations/CardAnimation';
import UnoHand from '../UnoHand/UnoHand';
import { animateArrow } from '../Animations/ArrowAnimation';
import KlopfButton from '../KlopfButton/KlopfButton';

function UnoGameBoard(props) {

    // Die zuletzt gespielten karten (welche auf dem Kartenstapel liegen)
    const [lastCards, setLastCards] = useState([]);
    const lastCardsRef = useRef([]);

    const lastCard = useRef(0);

    // Karten für die animationen
    const activeCardsRef = useRef([]);
    const [activeCards, setActiveCards] = useState([]);

    // Die Hand Karten für jeden Spieler
    const handCardsRef = useRef([[], [], [], []]);
    const [handCards, setHandCards] = useState([[], [], [], []]);

    const activeCardsCounterRef = useRef(0);

    // Welche Spieler gerade dran ist
    const [activePlayerId, setActivePlayerId] = useState(0);

    // Die SpielerId von dem Spieler der das Spiel anfängt
    const startPlayerIdRef = useRef(0);

    // Klopf Value
    const [klopfValue, setKlopfValue] = useState(0);
    const klopfValueRef = useRef(0);

    // Socket.io
    const socket = useContext(SocketContext);

    const dealCardAnimationTime = 400;

    // Wenn Spiel anfängt
    const [gameHasStarted, setGameHasStarted] = useState(false);

    const handleDealCardEvent = useCallback((data) => {

        data.card.socketId = data.socketId;

        // Karte kommt vom Kartenstapel und wird abgelegt
        if(data.socketId === 0) {

            // Zufällige Rotation zwischen -15 und + 15 Grad
            let rotation = Math.floor(Math.random() * 40) - 20; 
            data.card.rotation = rotation;
            
            // Animations Karte hinzufügen
            let card = <UnoCard key={ data.card.id + '-animation' } card={ data.card } hidden={ true } animate={ true } />

            // Die zuletzt gespieleten Karten speichern
            if(lastCardsRef.current.length === 8) {
                lastCardsRef.current.slice(1, lastCardsRef.current.length);
                lastCardsRef.current.push(data.card);

            } else {
                lastCardsRef.current.push(data.card);

            }

            lastCard.current = data.card;

            activeCardsRef.current.push(card);
            setActiveCards([...activeCardsRef.current]);

            activeCardsCounterRef.current += 1;

            // Animation abspielen
            animateCard('uno-deal-deck-img', 'uno-discard-deck-ref', data.card, dealCardAnimationTime, 0, false, undefined, () => {
                
                // Zuletzt gespielte Karten updaten
                setLastCards(JSON.parse(JSON.stringify(lastCardsRef.current)));

                // Wenn keine Spezial Karte => Hover effekt aktivieren für Abhebedeck
                if(data.card.color !== 4 && data.card.value < 10 && startPlayerIdRef.current === socket.id) {
                    $('#uno-deal-deck-img').addClass('unoDeckHover');
                }

                // Flackern der Karten verhindern
                setTimeout(() => {
                    let index = activeCardsRef.current.findIndex(c => c.props.card.id === data.card.id);
                    activeCardsRef.current.splice(index, 1);
                    setActiveCards([...activeCardsRef.current]);

                    activeCardsCounterRef.current -= 1;

                    // Wenn nur noch eine Karte übrig ist
                    if(activeCardsCounterRef.current === 0) {
                        activeCardsRef.current = [];
                        setActiveCards([...activeCardsRef.current]);
                    }
                }, 200);
            });
            
        // Ein Spieler bekommt eine Karte
        } else {

            // Der eigene Spieler bekommt eine Karte
            if(data.socketId === socket.id) {

                // Nur einmal eine Karte ziehen
                $('#uno-deal-deck-img').removeClass('unoDeckHover');
                $('#uno-deal-deck-img').addClass('unoDeckNoHover');

                // Damit man den Zug beenden kann (nicht anzigen bei +2 / +4 zieh Karten)
                if(data.normalTurn === true) {
                    $('#unoEndTurnBtn').css({ visibility: 'visible' });
                    $('#unoEndTurnBtn').css({ opacity: '1' });
                }

                // Animations Karte hinzufügen
                let card = <UnoCard key={ data.card.id + '-animation' } card={ data.card } hidden={ true } animate={ true } />

                activeCardsRef.current.push(card);
                setActiveCards([...activeCardsRef.current]);

                activeCardsCounterRef.current += 1;

                // Karte der Hand hinzufügen
                let playerIndex = props.players.findIndex(p => p.socketId === data.socketId);
                let playerPosition = props.players[playerIndex].position;

                handCardsRef.current[playerPosition].push(data.card);

                // Deep Copy
                let newCards = JSON.parse(JSON.stringify(handCardsRef.current));

                // Animation abspielen
                animateCard('uno-deal-deck-img', 'uno-deck-ref-' + data.card.id, data.card, dealCardAnimationTime, 0, false, 'uno-deck-ref-scaling-' + data.card.id, () => {

                    // Updated DOM
                    setHandCards(newCards);

                    // Flackern der Karten verhindern
                    setTimeout(() => {
                        // Animationskarte löschen
                        let index = activeCardsRef.current.findIndex(c => c.props.card.id === data.card.id);
                        activeCardsRef.current.splice(index, 1);

                        setActiveCards([...activeCardsRef.current]);

                        activeCardsCounterRef.current -= 1;

                        // Wenn nur noch eine Karte übrig ist
                        if(activeCardsCounterRef.current === 0) {
                            activeCardsRef.current = [];
                            setActiveCards([...activeCardsRef.current]);
                    }
                }, 200);
                });

            // Ein Gegenspieler bekommt eine Karte
            } else {

                // Animations Karte hinzufügen
                let card = <UnoCard key={ data.card.id + '-animation' } card={ data.card } hidden={ true } animate={ true } />

                activeCardsRef.current.push(card);
                setActiveCards([...activeCardsRef.current]);

                activeCardsCounterRef.current += 1;

                // Karte der Hand hinzufügen
                let playerIndex = props.players.findIndex(p => p.socketId === data.socketId);
                let playerPosition = props.players[playerIndex].position;

                handCardsRef.current[playerPosition].push(data.card);

                // Deep Copy
                let newCards = JSON.parse(JSON.stringify(handCardsRef.current));

                // Animation abspielen
                animateCard('uno-deal-deck-img', 'uno-deck-ref-' + data.card.id, data.card, dealCardAnimationTime, undefined, true, 'uno-deck-ref-scaling-' + data.card.id, () => {
                    
                    // Updated DOM
                    setHandCards(newCards);

                    setTimeout(() => {
                        // Animationskarte löschen
                        let index = activeCardsRef.current.findIndex(c => c.props.card.id === data.card.id);
                        activeCardsRef.current.splice(index, 1);

                        setActiveCards([...activeCardsRef.current]);

                        activeCardsCounterRef.current -= 1;

                        // Wenn nur noch eine Karte übrig ist
                        if(activeCardsCounterRef.current === 0) {
                            activeCardsRef.current = [];
                            setActiveCards([...activeCardsRef.current]);
                        }
                    }, 200);
                });
            }
        }
    }, [socket, props.players]);

    // Setzt am Anfang den Spieler
    const handleSetFirstPlayerEvent = useCallback((data) => {

        startPlayerIdRef.current = data.socketId;

        // Spieler Position bekommen
        let playerIndex = props.players.findIndex(p => p.socketId === data.socketId);
        let playerPosition = props.players[playerIndex].position;

        $('#uno-player-arrow').css({ visibility: 'visible' });
        $('#uno-player-arrow').css({ opacity: '1' });

        setTimeout(() => {
            animateArrow(3000, true, playerPosition, false,  () => {
                setGameHasStarted(true);
                setActivePlayerId(data.socketId);

                if(data.socketId === socket.id) {
                    $('#uno-last-card-btn').prop('checked', false);
    
                } else {
                    $('#uno-last-card-btn').prop('checked', true);
    
                }
            });
        }, [700]);

    }, [props, socket.id]);

    const handleNextPlayerEvent = useCallback((data) => {
        animateArrow(500, false, data.position, data.isReverse, () => {

            // Wenn man selbst dran ist hover Effekt beim Kartenstapel aktivieren
            if(data.socketId === socket.id) {
                $('#uno-deal-deck-img').removeClass('unoDeckHover');
                $('#uno-deal-deck-img').addClass('unoDeckHover');

                $('#uno-last-card-btn').prop('checked', false);

            // Wenn man nicht dran ist => hover Effekt beim Kartenstapel deaktivieren
            } else {
                $('#uno-deal-deck-img').removeClass('unoDeckHover');
                $('#uno-deal-deck-img').addClass('unoDeckNoHover');

                $('#uno-last-card-btn').prop('checked', true);

            }

            setActivePlayerId(data.socketId);
        });

    }, [socket.id]);

    const handleCardPlayedEvent = useCallback((data) => {
        let flip = 0;
        let scale = true;
        
        if(data.socketId === socket.id) {
            flip = -180;
            scale = false;

            if($('#unoEndTurnBtn').is(":visible")) {
                $('#unoEndTurnBtn').css({ visibility: 'hidden' });
                $('#unoEndTurnBtn').css({ opacity: '0' });
            }
        }

        // Zufällige Rotation zwischen -15 und + 15 Grad
        let rotation = Math.floor(Math.random() * 40) - 20; 
        data.card.rotation = rotation;
        
        // Animations Karte hinzufügen
        let card = <UnoCard key={ data.card.id + '-animation-discard' } card={ data.card } hidden={ true } animate={ true } />

        // Die zuletzt gespieleten Karten speichern
        if(lastCardsRef.current.length === 8) {
            lastCardsRef.current.slice(1, lastCardsRef.current.length);
            lastCardsRef.current.push(data.card);

        } else {
            lastCardsRef.current.push(data.card);

        }

        lastCard.current = data.card;

        activeCardsRef.current.push(card);
        setActiveCards([...activeCardsRef.current]);

        activeCardsCounterRef.current += 1;

        // Animation abspielen
        animateCard(data.card.id + '-uno-card', 'uno-discard-deck-ref', data.card, dealCardAnimationTime, flip, scale, 'uno-my-card-wrapper-' + data.card.id, () => {
            
            // Zuletzt gespielte Karten updaten
            setLastCards(JSON.parse(JSON.stringify(lastCardsRef.current)));

            // Karte aus dem Deck entfernen
            let playerIndex = props.players.findIndex(p => p.socketId === data.socketId);
            let playerPosition = props.players[playerIndex].position;
            let cardIndex = handCardsRef.current[playerPosition].findIndex(c => c.id === data.card.id);

            handCardsRef.current[playerPosition].splice(cardIndex, 1);
            setHandCards(JSON.parse(JSON.stringify(handCardsRef.current)));

            // Animationskarten entfernen
            let index = activeCardsRef.current.findIndex(c => c.props.card.id === data.card.id);
            activeCardsRef.current.splice(index, 1);
            setActiveCards([...activeCardsRef.current]);

            activeCardsCounterRef.current -= 1;

            // Wenn nur noch eine Karte übrig ist
            if(activeCardsCounterRef.current === 0) {
                activeCardsRef.current = [];
                setActiveCards([...activeCardsRef.current]);
            }
        });
    }, [socket.id, props.players]);

    const handleGetColorEvent = useCallback(() => {
        $('#uno-color-selection').css({ visibility: 'visible', height: '230px', width: '230px' });
        $('.uno-color-selection-item').css({ height: '85px', width: '85px' });
    }, []);

    const handleSelctedColorEvent = useCallback((data) => {
        let path;

        // +4
        if(data.mode === 5) {
            if(data.color === 0) {
                path = '60.png';

            } else if(data.color === 1) {
                path = '61.png';

            } else if(data.color === 2) {
                path = '62.png';

            } else if(data.color === 3) {
                path = '63.png';

            }

        // +2
        } else if(data.mode === 6) {
            if(data.color === 0) {
                path = '70.png';

            } else if(data.color === 1) {
                path = '71.png';

            } else if(data.color === 2) {
                path = '72.png';

            } else if(data.color === 3) {
                path = '73.png';

            }
        }

        // Die letzte Karte abspeichern
        let newCard = lastCardsRef.current[lastCardsRef.current.length - 1];

        // Die Karte anpassen
        newCard.path = path;

        // Die Karte aus dem Array löschen
        lastCardsRef.current.pop();

        // Die neue Karte wieder hinzufügen
        lastCardsRef.current.push(newCard);

        // DOM Update
        setLastCards(JSON.parse(JSON.stringify(lastCardsRef.current)));

    }, []);

    // Wenn man einen Klopf Wert abgeben muss
    const handleGetKlopfEvent = useCallback(() => {
        $('#uno-klopf-wrapper').css({ visibility: 'visible', height: '120px', width: '120px', opacity: '1' });
        $('#uno-klopf-text').css({ visibility: 'visible', height: '40px', width: '40px', opacity: '1' });

    }, []);

    const setHasLastCard = useCallback((data) => {
        // Klopf anzeigen
        // Nicht die eigene Karte
        if(data.socketId !== socket.id) {
            $('#' + data.socketId + '-uno-bubble').css({ visibility: 'visible', opacity: 1 });

            setTimeout(() => {
                $('#' + data.socketId + '-uno-bubble').css({ visibility: 'hidden', opacity: 0 });
            }, 2000);
        }

        // Karten Border animieren
    }, [socket.id]);

    useEffect(() => {

        // Wenn jemand eine Karte zieht
        socket.on('uno:deal-card', handleDealCardEvent);

        // Wenn am Anfang der erste Spieler bestimmt wird
        socket.on('uno:set-first-player', handleSetFirstPlayerEvent);

        // Wenn ein neuer Spieler bestimmt wird
        socket.on('uno:set-next-player', handleNextPlayerEvent);

        // Wenn eine Karte gespielt wurde
        socket.on('uno:card-played', handleCardPlayedEvent);

        // Wenn man eine Farbeaussuchen Karte spielt => Farbauswahl anzeigen
        socket.on('uno:get-color', handleGetColorEvent);

        // Die ausgewählte Farbe anzeigen
        socket.on('uno:color-selected', handleSelctedColorEvent);

        // Auf Input warten von Klopf Karte
        socket.on('uno:get-klopf', handleGetKlopfEvent);

        // Wenn jemand nur noch eine Karte hat
        socket.on('uno:has-last-card', setHasLastCard);

        return () => {
            socket.off('uno:deal-card', handleDealCardEvent);
            socket.off('uno:set-first-player', handleSetFirstPlayerEvent);
            socket.off('uno:set-next-player', handleNextPlayerEvent);
            socket.off('uno:card-played', handleCardPlayedEvent);
            socket.off('uno:get-color', handleGetColorEvent);
            socket.off('uno:color-selected', handleSelctedColorEvent);
            socket.off('uno:get-klopf', handleGetKlopfEvent);
            socket.off('uno:has-last-card', setHasLastCard);
           // socket.off('uno:show-klopf-result', handleShowKlopfResult);
        }
    }, [socket, handleDealCardEvent, handleSetFirstPlayerEvent, handleNextPlayerEvent, handleCardPlayedEvent,
        handleGetColorEvent, handleSelctedColorEvent, handleGetKlopfEvent, setHasLastCard]);

    // Übergibt die Karte dem Server
    const submitCard = (index) => {

        let playerIndex = props.players.findIndex(p => p.socketId === socket.id);
        let playerPosition = props.players[playerIndex].position;
        let playerHandCards = handCardsRef.current[playerPosition];

        let card = playerHandCards[index];

        socket.emit('uno:submit-card', { card: card });
    }

    // Eine Karte ziehen
    const drawCard = () => {
        
        // Nur eine Karte submitten, wenn man auch an der Reihe ist
        socket.emit('uno:draw-card');
    }

    const endTurn = () => {
        socket.emit('uno:end-turn');

        $('#unoEndTurnBtn').css({ visibility: 'hidden' });
        $('#unoEndTurnBtn').css({ opacity: '0' });
    }

    const setColor = (color) => {
        socket.emit('uno:set-color', { color: color });

        $('#uno-color-selection').css({ visibility: 'hidden', height: '0px', width: '0px' });
        $('.uno-color-selection-item').css({ height: '0px', width: '0px' });
    }

    const addKopfValue = () => {

        if(klopfValueRef.current >= 3) {
            klopfValueRef.current = 0;
        }

        $('#uno-klopf-btn').addClass('klopfRotationAnimation');

        setTimeout(() => {
            klopfValueRef.current += 1;
            setKlopfValue(klopfValueRef.current);

        }, 200);


        setTimeout(() => {
            $('#uno-klopf-btn').removeClass('klopfRotationAnimation');

        }, 400);
    }

    const submitKlopfValue = () => {
        if(klopfValueRef.current > 0 && klopfValueRef.current < 4) {
            $('#uno-klopf-wrapper').css({ visibility: 'hidden', height: '0px', width: '0px', opacity: '0' });
            $('#uno-klopf-text').css({ visibility: 'hidden', height: '0px', width: '0px', opacity: '0'  });

            socket.emit('uno:set-klopf', { value: klopfValueRef.current });

            setKlopfValue(0);
            klopfValueRef.current = 0;
        }
    }

    const setLastCard = () => {
        socket.emit('uno:klopf-klopf');
        $('#uno-last-card-btn').prop('checked', true);

    }

    return (
        <div id='uno-gameboard' >
            <div id='unoBtnContainer'>
                <input id='unoEndTurnBtn' type='button' value='Zug Beenden' onClick={ endTurn } />
            </div>
            <div id='uno-deck-wrapper'>
                <div id='uno-deal-deck'>
                    <img id='uno-deal-deck-img' className='uno-card' src={ '/UnoCardsImages/-1.png' } alt={ 'Rückseite einer Karte' } draggable="false" onClick={ drawCard }/>
                </div>
                <div id='uno-player-arrow'>
                    <IconContext.Provider value={{ size : '80px' }}>
                        <BsArrowRight style={{ position: 'absolute', left: '-10px' }} />
                    </IconContext.Provider>
                    <GoPrimitiveDot style={{ position: 'absolute' }} size = '22px' />
                </div>
                <div id='uno-discard-deck'>
                    <img id='uno-discard-deck-ref' className='uno-card invisible' src={ '/UnoCardsImages/-1.png' } alt='Referenz Bild' />
                    {
                        lastCards.map((card, index) => {

                            // Oberste Karte
                            if(card.id === lastCard.current.id) {

                                // Sicher gehen, dass diese oben angezeigt wird
                                return <UnoCard key={ card.id + '-' + card.path + '-discard' } card={ card } zIndex={ index + 2 } />
                            }

                            return <UnoCard key={ card.id + '-' + card.path + '-discard' } card={ card } zIndex={ index + 2 } />
                        })
                    }
                    <div id='uno-color-selection'>
                        <input className='uno-color-selection-item' type='button' onClick={ () => setColor(0) } />
                        <input className='uno-color-selection-item' type='button' onClick={ () => setColor(1) } />
                        <input className='uno-color-selection-item' type='button' onClick={ () => setColor(2) } />
                        <input className='uno-color-selection-item' type='button' onClick={ () => setColor(3) } />
                    </div>
                    <div id='uno-klopf-wrapper'>
                        <input id='uno-klopf-btn' type='button' onClick={ addKopfValue }/>
                        <p id='uno-klopf-text'>{ klopfValue + 'x' }</p>
                        <input id='unoSubmitKlopfValue' type='button' value='Fertig' onClick={ submitKlopfValue } />
                    </div>
                </div>
            </div>
            {
                props.players.map(p => {
                    let activeCardsList = [];

                    for(let card of activeCards) {
                        if(card.props.card.socketId === p.socketId) {
                            activeCardsList.push(card);
                        }
                    }

                    return <UnoHand key={ p.socketId }
                                    socketId={ p.socketId }
                                    self={ p.socketId === socket.id ? true : false }
                                    top={ p.position === 0 || p.position === 2 ? true : false } 
                                    left={ p.position === 0 || p.position === 3 ? true : false }
                                    cards={ handCards[p.position] }
                                    activeCards={ activeCardsList }
                                    submitCard={ p.socketId === socket.id ? submitCard : undefined } 
                                    hasStarted={ gameHasStarted }
                                    klopfHandler={ setLastCard } />
                })
            }
            {
                activeCards.map(card => {
                    return card;
                })
            }
            {
                props.players.length === 0 ? (
                    <div></div>
                ) : (
                    <KlopfButton position={ props.players.find(p => p.socketId === socket.id).position }
                        color={ props.players.find(p => p.socketId === socket.id).color }
                        clickHandler={ setLastCard }
                        turn={ activePlayerId === socket.id ? true : false } />
                )
            }
        </div>
    );
}

export default UnoGameBoard;