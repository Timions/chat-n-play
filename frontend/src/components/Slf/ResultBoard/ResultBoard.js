import { useState, useContext, useEffect, useCallback } from 'react';

import './ResultBoard.css';

import SocketContext from '../../../services/socket';

function ResultBoard(props) {

    // Socket.io
    const socket = useContext(SocketContext);

    const [sortedPlayerScores, setSortedPlayerScores] = useState([]);

    // Wie viele User auf weiter geklickt haben
    const [readyUsers, setReadyUsers] = useState(0);

    const handleStartNewRoundVoteEvent = useCallback((data) => {
        setReadyUsers(data.playersReady.length);

    }, []);

    useEffect(() => {
        socket.on('slf:players-ready-count', handleStartNewRoundVoteEvent);

        return() => {
            socket.off('slf:players-ready-count', handleStartNewRoundVoteEvent);
        }

    }, [socket, handleStartNewRoundVoteEvent]);


    // Spilernamen und scores zusammenfügen und sortieren
    useEffect(() => {
        if(props.scores !== 0) {
            let result = [];

            for(let score of props.scores) {
                for(let player of props.players) {
                    if(player !== undefined) {
                        if(score.socketId === player.socketId) {
                            result.push({ username: player.username, score: score.score });
                        }
                    }
                }
            }

            let sortedScores = result.sort((a, b) => {
                return b.score - a.score

            })

            setSortedPlayerScores(sortedScores);
        }

    }, [props]);


    const voteNewRound = () => {
        socket.emit('slf:vote-new-round');
        document.getElementById('slf-scores-continue').disabled = true;
    }

    if(sortedPlayerScores.length === 0 || props.players === undefined || props.letter === undefined) {
        return (
            <div style={{ height: '100%' }}>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                    <div className="spinner-border" style={{ width: '4rem', height: '4rem' }} role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id='slf-scores-wrapper'>
            <div id='slf-scores-header'>
                <p className='slf-evaluate-letter'>{ 'Buchstabe: ' + props.letter.toUpperCase() }</p>
            </div>
            <div id='slf-scores-main'>
                <p id='slf-scores-main-title'>Punkteübersicht der aktuellen Runde:</p>
                <div id='slf-scores-main-scores-wrapper'>
                    {
                        sortedPlayerScores.map((entry, index) => (
                            <div key={ index } className='slf-player-score-wrapper'> 
                                <p key={ index + '-1' } style={{ textAlign: 'right' }} className='slf-player-score-item'>{  entry.username + ':' }</p>
                                <p key={ index + '-2' } className='slf-player-score-item'>{ entry.score + ' Punkte' }</p>
                            </div>
                            
                        ))  
                    }
                </div>
            </div>
            <div id='slf-scores-footer'>
                <p id="slf-scores-show-players-ready">{ 'Bereit: ' + readyUsers + ' von ' + props.players.length + ' Spielenden' }</p>
                <input id='slf-scores-continue' className='btn-lg btn-dark' type='button' value='Nächste Runde' onClick={ voteNewRound } />
            </div>
        </div>
    );
}

export default ResultBoard;