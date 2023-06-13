import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import $ from 'jquery';

import './GameBoard.css';

import CategoryInput from './CategoryInput/CategoryInput';
import LetterRoulette from './LetterRoulette/LetterRoulette';

import SocketContext from '../../../services/socket';

function GameBoard(props) {

    const [categories, setCategories] = useState([]);
    const [letter, setLetter] = useState();
    const [inputDisabled, setInputDisabled] = useState(true);
    const [inputFlexBasis, setInputFlexBasis] = useState(10);

    const words = useRef([]);

    // Socket.io
    const socket = useContext(SocketContext);

    useEffect(() => {
        words.current = []

        for(let category of props.categories) {
            words.current = [...words.current, { id: category.id, word: '' }];
        }

        setCategories(props.categories);
        setInputFlexBasis((1/props.categories.length) * 100);

    }, [props]);

    // Runde Stoppen
    const stopRound = () => {
        socket.emit('slf:stop-round');
    }

    const changeValue = (event, id) => {
        let index = words.current.findIndex(word => word.id === id);
        words.current[index].word = event.target.value;
    }

    const changeSubmitBtnDisabledState = (state) => {
        setInputDisabled(state);
    }

    const handleStartRoundEvent = useCallback((data) => {
        if(data.letter !== undefined) {
            setLetter(data.letter);
        }
    }, []);

    const handleRoundEndedEvent = useCallback(() => {
        let result = [];

        for(let entry of words.current) {
            result.push(entry.word);
        }

        socket.emit('slf:submit-words', { words: result });

    }, [socket]);
    
    // Socket Events
    useEffect(() => { 
        socket.on('slf:start-round', handleStartRoundEvent);
        socket.on('slf:round-stopped', handleRoundEndedEvent);
        
        return() => {
            socket.off('slf:start-round');
            socket.off('slf:round-stopped');
        }

    }, [socket, handleStartRoundEvent, handleRoundEndedEvent]);

    // Richtige Aufteilung der Input Zellen
    useEffect(() => {
        let inputHeight = 67;
        let padding = 50;

        // Mehr oder gleich 4 Kategorien => 2 Spalten
        if(categories.length >= 4) {
            setInputFlexBasis(50);
            $('#slf-categories-input-wrapper').css({ flexDirection: 'row', flexWrap: 'wrap' });
            $('#slf-categories-input-wrapper').css({ maxHeight: (categories.length / 2) * (inputHeight + padding + 18) });

        // Weniger wie 4 Kategorien
        } else {
            setInputFlexBasis((1 / categories.length) * 100);
            $('#slf-categories-input-wrapper').css({ flexDirection: 'column', flexWrap: 'nowrap' });
            $('#slf-categories-input-wrapper').css({ maxHeight: categories.length * (inputHeight + padding) });
        }

    }, [categories]);


    if(categories === undefined) {
        return (
            <div style={{ height: '100%' }}>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                    <div className="spinner-border" style={{ width: '4rem', height: '4rem' }} role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div id='slf-game-board'>
                <div id='slf-letter-roulette-wrapper'>
                    <LetterRoulette letter={ letter } submitBtnDisbaledChangeHandler={ changeSubmitBtnDisabledState } />
                    <p style={{ textAlign: 'center' }}>{ 'Runde ' + props.currentRound + '/' + props.totalRounds }</p>
                </div>
                <div id='slf-categories-input-wrapper'>
                    {
                        categories.map((entry, index) => (
                            <CategoryInput key={ entry.id }
                                id={ entry.id }
                                category={ entry.category }
                                onChangeHandler={ changeValue } 
                                disabled={ inputDisabled }
                                flexBasis={ inputFlexBasis }
                                alignSelf={ categories.length >= 6 ? index % 2 : undefined }/>
                        ))
                    }
                </div>
                <div id='slf-submit-btn-wrapper'>
                    <input id='slf-submit-words-btn' className='btn-lg btn-dark' type='button' value='Fertig!' onClick={ stopRound } disabled={ inputDisabled } />
                </div>
            </div>
        );
    }
}

export default GameBoard;