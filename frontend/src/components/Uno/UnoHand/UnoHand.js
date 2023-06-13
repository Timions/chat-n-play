import { useState, useCallback, useLayoutEffect, useEffect } from 'react';
import $ from 'jquery';

import './UnoHand.css';

import UnoCard from '../UnoCard/UnoCard';

function UnoHand(props) {

    // Breite und Höhe der Spieler Kamera
    const [playerWidth, setPlayerWidth] = useState();
    const [playerHeight, setPlayerHeight] = useState()

    const [hoverCardIndex, setHoverCardIndex] = useState(-1);

    const resizeHandHandler = useCallback(() => {
        if(props.self) {
            setPlayerWidth($('.player').width());

        } else {
            setPlayerWidth($('.player').width());
            setPlayerHeight($('.player').height());
        }

    }, [props.self]);

    // Width setzten bei Windows resize event
    useLayoutEffect(() => {

        // Wenn die Fenstergröße geändert wird -> Größe anpassen
        window.addEventListener('resize', resizeHandHandler);

        return () => {
            window.removeEventListener('resize', resizeHandHandler);
        }

    }, [resizeHandHandler]);

    // Width setzten am Anfang
    useEffect(() => {
        if(props.self) {
            setPlayerWidth($('.player').width());

        } else {
            setPlayerWidth($('.player').width());
            setPlayerHeight($('.player').height());
        }
    }, [props.top, props.self]);

    // Styling setzten
    let posStyle;

    // Eigene Hand
    if(props.self) {

        // Card height & width
        let cardHeight = $('.uno-card').height();
        let cardWidth = $('.uno-card').width();

        posStyle = {
            left: playerWidth + 100 + 'px',
            right: playerWidth + 60 + cardWidth / 2 + 'px',
            height: cardHeight + 'px'
        }

        // on Click Handler
        const onClickHandler = (index) => {
            props.submitCard(index);
        }

        const setHoverEffect = (index) => {

            if(index < hoverCardIndex - 2 || index > hoverCardIndex + 2) {
                setHoverCardIndex(index);
            }
        }

        const removeHoverEffect = () => {
            setHoverCardIndex(-1);
        }

        
        return(
            <div id='uno-own-hand' className='uno-my-hand-wrapper' style={ posStyle }>
                <div id={ props.socketId + '-uno-player' } className='uno-my-hand' onMouseLeave={ removeHoverEffect }>
                    {
                        props.cards.map((card, index) => {

                            // letzte Karte
                            if(props.cards.length === 1 && props.hasStarted) {
                                return (
                                    <div key={ card.id } id={ 'uno-my-card-wrapper-' + card.id } className='uno-my-card-wrapper uno-small-deck-hover' onClick={ () => onClickHandler(index) } >
                                        <div className='uno-rainbow-wrapper'>
                                            <div className='uno-rainbow'></div>
                                        </div>
                                        <UnoCard card={ card } />
                                    </div>
                                );
                            }

                            // Großes Deck
                            if(props.cards.length > 15) {

                                // Breitere Karten
                                if(index < hoverCardIndex + 6 && index > hoverCardIndex - 6 && hoverCardIndex !== -1) {
                                    return (
                                        <div style={{ width: '250px' }}
                                            key={ card.id }
                                            id={ 'uno-my-card-wrapper-' + card.id }
                                            className={ 'uno-my-card-wrapper uno-big-deck-hover' }
                                            onClick={ () => onClickHandler(index) }
                                            onMouseEnter={ () => setHoverEffect(index) } >
                                            <UnoCard card={ card } />
                                        </div>
                                    );
                                }

                                // Normale Karten
                                return (
                                    <div style={{ width: '90px' }}
                                        key={ card.id }
                                        id={ 'uno-my-card-wrapper-' + card.id }
                                        className={ 'uno-my-card-wrapper uno-big-deck-hover' }
                                        onClick={ () => onClickHandler(index) }
                                        onMouseEnter={ () => setHoverEffect(index) }>
                                        <UnoCard card={ card } />
                                    </div>
                                );
                            }

                            // Kleines Deck
                            return (
                                <div key={ card.id } id={ 'uno-my-card-wrapper-' + card.id }
                                    className={ 'uno-my-card-wrapper uno-small-deck-hover' }
                                    onClick={ () => onClickHandler(index) } >
                                    <UnoCard card={ card } />
                                </div>
                            )
                        })
                    }
                    {
                        props.activeCards.map((card, index) => {

                            if(props.cards.length + props.activeCards.length > 15 && hoverCardIndex !== -1 && hoverCardIndex + 6 > props.cards.length + index + 1) {
                                return(
                                    <div key={ card.props.card.id + '-' + card.props.card.path } id={ 'uno-deck-ref-scaling-' + card.props.card.id } className='uno-my-card-wrapper-wide uno-card-ref-wrapper'>
                                        <img id={ 'uno-deck-ref-' + card.props.card.id } className='uno-card-wide invisible' src={ '/UnoCardsImages/-1.png' } alt='' />
                                    </div>
                                )
                            }

                            return(
                                <div key={ card.props.card.id + '-' + card.props.card.path } id={ 'uno-deck-ref-scaling-' + card.props.card.id } className='uno-my-card-wrapper uno-card-ref-wrapper'>
                                    <img id={ 'uno-deck-ref-' + card.props.card.id } className='uno-card invisible' src={ '/UnoCardsImages/-1.png' } alt='' />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    // Card width
    let cardWidth = $('.uno-card').width();
    let bubble;

    if(props.top) {

        // oben + links
        if(props.left) {
            posStyle = {
                top: 40 + 'px',
                left: playerWidth + cardWidth / 2 + 40 + 'px',
                flexDirection: 'row'
            }

            let bubbleStyle = {
                top: playerHeight + 25 + 'px',
                left: - 100 + 'px',
            }

            bubble = <div id={ props.socketId + '-uno-bubble' } style={ bubbleStyle } className='uno-bubble-top-left'>Klopf!</div>

        // oben + rechts
        } else {
            posStyle = {
                top: '40px',
                right: playerWidth + cardWidth / 2 + 40 + 'px',
                flexDirection: 'row-reverse'
            }

            let bubbleStyle = {
                top: playerHeight + 25 + 'px',
                right: - 100 + 'px',
            }

            bubble = <div id={ props.socketId + '-uno-bubble' } style={ bubbleStyle } className='uno-bubble-top-right'>Klopf!</div>

        }
    } else {
        // unten + links
        if(props.left) {
            posStyle = {
                bottom: playerHeight + 60 + 'px',
                left: '60px',
                flexDirection: 'row'
            }
            
            let bubbleStyle = {
                left: (playerWidth - 100) + 'px',
                bottom: '0px'
            }

            bubble = <div id={ props.socketId + '-uno-bubble' } style={ bubbleStyle } className='uno-bubble-bottom-left'>Klopf!</div>

        // unten + rechts
        } else {
            posStyle = {
                bottom: playerHeight + 60 + 'px',
                right: 20 + cardWidth / 2 + 'px',
                flexDirection: 'row-reverse'
            }

            let bubbleStyle = {
                right: (playerWidth - 100) + 'px',
                bottom: '0px'
            }

            bubble = <div id={ props.socketId + '-uno-bubble' } style={ bubbleStyle } className='uno-bubble-bottom-right'>Klopf!</div>

        }
    }


    return (
        <div id={ props.socketId + '-uno-player' } className='uno-other-hand' style={ posStyle }>
            {
                bubble
            }
            {
                props.cards.map((card) => {

                    // letzte Karte
                    if(props.cards.length === 1 && props.hasStarted) {
                        return (
                            <div key={ card.id } id={ 'uno-my-card-wrapper-' + card.id } className='uno-other-card-wrapper'>
                                <div className='uno-rainbow-wrapper-small'>
                                    <div className='uno-rainbow'></div>
                                </div>
                                <UnoCard card={ card } />
                            </div>
                        );
                    }

                    return (
                        <div key={ card.id } id={ 'uno-my-card-wrapper-' + card.id } className='uno-other-card-wrapper'>
                            <UnoCard card={ card } />
                        </div>
                    )
                })
            }
            {
                props.activeCards.map((card) => {
                    return (
                        <div key={ card.props.card.id + '-' + card.props.card.path } id={ 'uno-deck-ref-scaling-' + card.props.card.id } className='uno-other-card-wrapper uno-card-ref-wrapper'>
                            <img id={ 'uno-deck-ref-' + card.props.card.id } className='uno-card-small invisible' src={ '/UnoCardsImages/-1.png' } alt='' />
                        </div>
                    )
                })
            }
        </div>
    );
}

export default UnoHand;