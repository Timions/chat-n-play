import { useCallback, useContext, useEffect, useState } from 'react';
import $ from 'jquery';

import './ChooseGame.css';

import SocketContext from "../../../services/socket";
import { useHistory } from 'react-router';

function ChooseGame(props) {

    // Socket 
    const socket = useContext(SocketContext);

    // Router Stuff
    const history = useHistory();

    // Spiele bekommen
    const [games, setGames] = useState([]);

    // Spiele vom Server holen
    useEffect(() => {
        fetchGames();
        
    }, [socket]);

    const fetchGames = async() => {
        const data = await fetch("/api/games");
        const games = await data.json();

        setGames(games);
    };

    // Spiel verlassen
    const leaveRoom = () => {
        $('#endgame-modal').modal('hide');

        socket.emit('room:leave-room');
        history.push('/');

    }

    const changeGame = (gameId) => {
        socket.emit('room:changing-game', { gameTypeId: gameId });
    }

    // Wenn man einem Spiel gejoint ist -> Lobby laden
    const handleHameChangedEvent = useCallback((data) => {
        $('#endgame-modal').modal('hide');

        props.resetModal();
        
        history.push({
            pathname: '/game/lobby/' + data.roomId,
            state: { data: data }
        });

    }, [history, props]);

    useEffect(() => {
        socket.on('room:game-changed', handleHameChangedEvent);

        return () => {
            socket.off('room:game-changed', handleHameChangedEvent);
        }

    }, [socket, handleHameChangedEvent]);

    // Spieler ist host
    if(props.isHost) {
        if(games.length !== 0) {
            return (
                <div id='endgame-modal-content' className="modal-content">
                    <div id='endgame-modal-header' className="modal-header text-center">
                        <p id='endgame-modal-title' className="modal-title w-100">Wähle ein neues Spiel aus</p>
                    </div>
                    <div id='endgame-modal-body' className="modal-body text-center">
                        <div id='endgame-modal-games-list'>
                            {
                                games.map((game) => {
                                    return (
                                        <div key={ game.id } className='endgame-modal-game' onClick={ () => changeGame(game.id) } >
                                            <img key={ game.id  + '-img'} src={ game.endModalImgPath } alt="Bild Spiel" className="endgame-modal-game-img" />
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <small id='endgame-modal-error-output' className="text-danger" />
                    </div>
                </div>
            );
        }

        // Ladesymbol wenn Spiel noch nicht geladen
        return (
            <div id='endgame-modal-content' className="modal-content">
                <div id='endgame-modal-header' className="modal-header text-center">
                    <p id='endgame-modal-title' className="modal-title w-100">Wähle ein neues Spiel aus</p>
                </div>
                <div id='endgame-modal-body' className="modal-body text-center">
                    <div className='endgame-modal-games-list'>
                        <div style={{ height: '100%' }}>
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                                <div className="spinner-border" style={{ width: '4rem', height: '4rem' }} role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <small id='endgame-modal-error-output' className="text-danger" />
                </div>
            </div>
        );
    }

    // Spieler ist kein Host
    return (
        <div id='endgame-modal-content' className="modal-content">
            <div id='endgame-modal-header' className="modal-header text-center">
                <p id='endgame-modal-title' className="modal-title w-100">Neues Spiel</p>
            </div>
            <div id='endgame-modal-body' className="modal-body  text-center">
                <p className='endgame-modal-body-text'>Es wird ein neues Spiel ausgewählt.</p>
            </div>
            <div id='endgame-modal-footer' className="modal-footer">
                <small id='endgame-modal-error-output' className="text-danger" />
                <button type="button" className="btn btn-dark" onClick={ leaveRoom }>Raum verlassen</button>
            </div>
            <small id='endgame-modal-error-output' className="text-danger" />
        </div>
    );
}

export default ChooseGame;