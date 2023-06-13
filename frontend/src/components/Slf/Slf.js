import { useContext, useState, useEffect, useCallback } from 'react';

import CategorySelection from './CategorySelection/CategorySelection';
import GameBoard from './GameBoard/GameBoard';
import WordsEvaluation from './WordsEvaluation/WordsEvaluation';
import ResultBoard from './ResultBoard/ResultBoard';

import SocketContext from '../../services/socket';

function Slf(props) {

    // Game Data
    const [categories, setCategories] = useState([]);
    const [totalRounds, setTotalTounds] = useState();
    const [currentRound, setCurrentRound] = useState(1);
    const [words, setWords] = useState([]);
    const [letter, setLetter] = useState('');
    const [scores, setScores] = useState(0);

    // 0: Kategorien auswählen | 1: Wörter überlegen zum Buchstaben | 2: Wörter bewerten | 3: Spiel vorbei
    const [gameStatus, setGameStatus] = useState();

    // Socket.io
    const socket = useContext(SocketContext);
    
    useEffect(() => {
        // Spiel ID bekommen
        setGameStatus(0);

    }, [socket]);

    // Wenn der Servert die ausgewählten kategorien übermittelt
    const handleCategoriesSubmitEvent = useCallback((data) => {
        setCategories(data.categories);
        setTotalTounds(data.rounds);
        setGameStatus(1);
    }, []);

    // Wenn die Wörter abgegeben wurden und nun bewertet werden müssen
    const handleEvaluatingResultsEvent = useCallback((data)=> {
        setWords(data.words);
        setLetter(data.letter);
        setGameStatus(2);
    }, []);

    // Wenn ein Spieler das Spiel verlässt, während die Wörter evaluiert werden
    const handleUpdateWordsEvent = useCallback((data) => {
        setWords(data.words);
    }, []);

    // Wenn die Bewertung vorbei ist und nur noch die Ergebnisse angezeigt werden sollen
    const handleRoundOverEvent = useCallback(() => {
        setGameStatus(3);
    }, []);

    // Wenn die Bewertung vorbei ist und nur noch die Ergebnisse angezeigt werden sollen
    const handleRoundScoresEvent = useCallback((data) => {
        setScores(data.scores);
    }, []);

    // Wenn eine neue Runde gestartet werden soll
    const handleNewRoundEvent = useCallback((data) => {
        setCurrentRound(data.currentRound);
        setGameStatus(1);
    }, []);

    // Socket Events
    useEffect(() => { 
        socket.on('slf:submit-game-infos', handleCategoriesSubmitEvent);
        socket.on('slf:evaluating-results', handleEvaluatingResultsEvent);
        socket.on('slf:update-words', handleUpdateWordsEvent);
        socket.on('slf:round-over', handleRoundOverEvent);
        socket.on('slf:round-scores', handleRoundScoresEvent);
        socket.on('slf:new-round', handleNewRoundEvent);

        return() => {
            // Events unmounten
            socket.off('slf:submit-game-infos');
            socket.off('slf:evaluating-results');
            socket.off('slf:update-words');
            socket.off('slf:round-over');
            socket.off('slf:round-scores');
            socket.off('slf:new-round');
        }
        
    }, [socket, handleCategoriesSubmitEvent, handleEvaluatingResultsEvent, handleUpdateWordsEvent, handleRoundOverEvent, handleRoundScoresEvent, handleNewRoundEvent]);
        

    // Richtigen Content je nach Spielsatus anzeigen
    let gameContent;

    // Kategorien auswahl
    if(gameStatus === 0) {
        gameContent = <CategorySelection isHost={ props.isHost } />

    // Spielfeld
    } else if(gameStatus === 1) {
        gameContent = <GameBoard categories={ categories } totalRounds={ totalRounds } currentRound={ currentRound } />
        
    } else if(gameStatus === 2) {
        gameContent = <WordsEvaluation categories={ categories } words={ words } letter={ letter } players={ props.players } />

    } else if(gameStatus === 3) {
        gameContent = <ResultBoard scores={ scores } players={ props.players } letter={ letter } />
    }

    return (
        <div id='game-content'>
            { gameContent }
        </div>
    )
}

export default Slf;