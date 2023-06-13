import { useEffect, useState, useContext, useCallback } from 'react';

import './WordsEvaluation.css';

import SocketContext from '../../../services/socket';

import EvaluationList from './EvaluationList/EvaluationList';

function WordsEvaluation(props) {

    // Socket.io
    const socket = useContext(SocketContext);

    const [isReady, setIsReady] = useState(false);
    const [readyUsers, setReadyUsers] = useState(0);

    /**
     * id, category, 
     */
     const [answers, setAnswers] = useState([]);
     const [ownAnswers, setOwnAnswers] = useState();

     const handlePlayerSubmittedEvent = useCallback((data) => {
        setReadyUsers(data.playersReady.length);

     }, []);

    useEffect(() => {
        socket.on('slf:players-ready-count', handlePlayerSubmittedEvent);

        return() => {
            socket.off('slf:players-ready-count', handlePlayerSubmittedEvent);
        }

    }, [socket, handlePlayerSubmittedEvent]);

    useEffect(() => {
        let result = [];
        
        if(props.players.length === props.words.length) {
            for(let catIndex in props.categories) {
                let resultJson = { category: props.categories[catIndex].category, answers: [] }
    
                for(let p of props.players) {
                    if(p.socketId !== socket.id) {
                        let playerAnswerJson = { socketId: p.socketId, username: p.username }
    
                        let playerAnswer = props.words.find(entry => entry.socketId === p.socketId);
                        playerAnswerJson['word'] = playerAnswer.words[catIndex].word;

                        // Vote gleich auf 1 setzten
                        if(playerAnswer.words[catIndex].word.length > 0) {
                            playerAnswerJson['votes'] = 1;

                        // Vote auf 0 setzten
                        } else {
                            playerAnswerJson['votes'] = 0;

                        }
        
                        resultJson.answers.push(playerAnswerJson);
                    }
                }
    
                result.push(resultJson);
            }

            // Eigene Wörter
            let tmpOwnAnswers = props.words.find(entry => entry.socketId === socket.id);
            setOwnAnswers(tmpOwnAnswers.words);
        }

        setAnswers(result);
 
     }, [socket.id, props.players, props.words, props.categories]);

    const setRating = (categoryIndex, socketId, inputId) => {
        let rating = 0

        if(document.getElementById(inputId).checked) {
            rating = 1;
        }

        let socketIndex = answers[categoryIndex].answers.findIndex(entry => entry.socketId === socketId);

        let answersTemp = [...answers];
        answersTemp[categoryIndex].answers[socketIndex].votes = rating;

        setAnswers(answersTemp);
    }

    const submitVotes = (results) => {
        socket.emit('slf:submit-votes', { results: results });
        setIsReady(true);
        
        document.getElementById('slf-submit-evaluated-words-btn').disabled = true;

    }
 

    if(props.words === undefined || props.categories === undefined) {
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
            <div id='slf-words-evaluation-wrapper'>
                <div id='slf-words-evaluation-additional-informations-wrapper'>
                    <div className='slf-evaluate-letter-wrapper'>
                        <p className='slf-evaluate-letter'>{ 'Buchstabe: ' + props.letter.toUpperCase() }</p>
                    </div>
                    <div className='slf-state-describtion-wrapper'>
                        <p className='slf-state-describtion'>Setzte bei jeder korrekten Antwort ein Kreuz.</p>
                    </div>
                </div>
                <div id='slf-evaluation-wrapper'>
                    <EvaluationList answers={ answers } ownAnswers={ ownAnswers } setRatingHandler={ setRating } isReady={ isReady } />
                </div>
                <div id='slf-submit-evaluated-words-btn-wrapper'>
                    <p id="slf-show-count-players-ready">{ 'Abgegeben: ' + readyUsers + ' von ' + props.players.length + ' Spielenden' }</p>
                    <input id='slf-submit-evaluated-words-btn' className='btn-lg btn-dark' type='button' value='Fertig' onClick={ () => submitVotes(answers) } />
                </div>
            </div>
        );
    }
}

export default WordsEvaluation;