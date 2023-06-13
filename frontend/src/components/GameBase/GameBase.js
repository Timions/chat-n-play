import { useContext, useState, useEffect, useCallback, useRef, useLayoutEffect  } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { Switch, Route } from 'react-router';
import $ from 'jquery';

import SocketContext from "../../services/socket";

import './GameBase.css';

import Title from '../Home/Title/Title';
import SideBar from '../SideBar/SideBar';
import Lobby from '../Lobby/Lobby';
import PageNotFound from '../PageNotFound/PageNotFound';
import Ludo from '../Ludo/Ludo';
import Slf from '../Slf/Slf';
import Players from '../Players/Players';
import Home from '../Home/Home';
import EndGameModal from '../EndGameModal/EndGameModal';
import Uno from '../Uno/Uno';

function GameBase({ match }) {

    // Design Stuff
    const isResponsive = useRef();

    // Router Stuff
    const history = useHistory();
    const location = useLocation();

    // Ob Kamera erlaubt wird
    const [allowCamera, setAllowCamera] = useState(true);

    // Game Data (roomid, gameid, players, ...)
    const [gameId, setGameId] = useState();
    const [roomId, setRoomId] = useState();
    const [hostId, setHostId] = useState();
    const [players, setPlayers] = useState();

    // Wenn man ein Spiel neustarten will
    const playersCount = useRef(0);

    const [winners, setWinners] = useState();

    // Bei SLF die Spieler die 'weiter' geklickt haben
    const [playersReady, setPlayersReady] = useState([]);

    // Um bei Ludo die Häuser anzuzeigen / um bei uno die Handkarten anzuzeigen
    const [gameNameStarted, setGameNameStarted] = useState();

    const [scores, setScores] = useState([]);

    // vom api call
    const [gameName, setGameName] = useState('');
    const [rules, setRules] = useState();

    // Socket.io
    const socket = useContext(SocketContext);

    const settingAllowCamera = useCallback((value) => {
        setAllowCamera(value);
    }, []);

    // Schauen, ob man sich überhaupt in einem Raum befindet
    const handleInRoomCallback = useCallback((isInRoom) => {
        
        // Spieler befindet sich nicht im Raum
        if(!isInRoom) {
            history.push('/');

        // Spieler befindet sich im Raum
        } else {
            let gameData = location.state.data;

            // Wenn sich 'location.state' ändert (wenn das Spiel geladen ist)
            try {
                setRoomId(gameData.roomId);
                setHostId(gameData.hostId);
                setGameId(gameData.gameTypeId);

                if(playersCount.current === 0) {
                    setPlayers(gameData.players);
                }

                // restlichen Werte resetten
                setWinners(undefined);
                setScores([]);
                setPlayersReady([]);
                setGameNameStarted('-');

            } catch {}
        }

    }, [history, location]);

    // Ob man sich überhaupt in einem Raum befindet, wenn man einem Spiel joint
    useEffect(() => {
        socket.emit('room:is-in-room', handleInRoomCallback);
    }, [socket, handleInRoomCallback]);

    // Event wenn ein Spieler joint oder jemand das Spiel verlässt
    const handleRoomUpdateEvent = useCallback((data) => {
        playersCount.current = data.players.length;
        setPlayers(data.players);
    }, []);

    // Schauen ob man selbst der neue Host ist
    const handleHostChanged = useCallback((data) => {
        setHostId(data.hostId);
    }, []);

    // Event wenn sich die Scores Updaten
    const handleScoreUpdateEvent = useCallback((data) => {
        setScores(data.scores);
    }, []);

    const handleGameEndEvent = useCallback((data) => {
        setWinners(data.winners.map(p => p.username));

        $('#endgame-modal').modal({ backdrop: 'static', keyboard: false })  
        $('#endgame-modal').modal('show');
    }, []);

    // Wenn ein neues Spiel erstellt wird die aktuellen Spieler löschen
    const handleRoomCreatedEvent = useCallback(() => {
        setPlayers([]);
        playersCount.current = 0;
    }, []);

    // Wenn neue Spieler in den Raum kommen oder aus dem Raum austreten
    useEffect(() => { 
        socket.on('room:update', handleRoomUpdateEvent);
        socket.on('room:hostChanged', handleHostChanged);
        socket.on('room:score-update', handleScoreUpdateEvent);
        socket.on('room:end-game', handleGameEndEvent);
        socket.on('room:created-new', handleRoomCreatedEvent);

        return () => {
            // Events unmounten
            socket.off('room:update', handleRoomUpdateEvent);
            socket.off('room:hostChanged', handleHostChanged);
            socket.off('room:score-update', handleScoreUpdateEvent);
            socket.off('room:end-game', handleGameEndEvent);
            socket.off('room:created-new', handleRoomCreatedEvent);
        };

    }, [socket, handleRoomUpdateEvent, handleHostChanged, handleScoreUpdateEvent, handleGameEndEvent, handleRoomCreatedEvent]);


    const handlePlayersReadyEvent = useCallback((data) => {

        if(data.playersReady.length === players.length) {
            setPlayersReady([]);

        } else {
            setPlayersReady(data.playersReady);

        }
    }, [players]);

    // Um die Häckchen bei den Kameras anzuzeigen
    useEffect(() => {
        socket.on('slf:players-ready-count', handlePlayersReadyEvent);

        return() => {
            socket.off('slf:players-ready-count', handlePlayersReadyEvent);

        }
    }, [socket, handlePlayersReadyEvent]);

    // API Calls
    useEffect(() => {   
        if(gameId !== undefined) {
            fetchGameData(gameId);
            fetchRulesData(gameId);

        }
    }, [gameId]);

    // API Call: Den Namen vom Spiel bekommen
    const fetchGameData = async(gameId) => {
        const data = await fetch("/api/name?id=" + gameId);
        const nameData = await data.json();

        setGameName(nameData.name);
    };

    // API Call: Die Regeln von dem Spiel bekommen
    const fetchRulesData = async(gameId) => {
        const data = await fetch("/api/rules?id=" + gameId);
        const rulesData = await data.json();

        setRules(rulesData.rules);
    };

    const isGame = useCallback((data) => {
        let game = data.route.split('/')[1];

        if(game === 'ludo') {
            setGameNameStarted('ludo');

        } else if(game === 'uno') {
            setGameNameStarted('uno');

        } else {
            setGameNameStarted('-');

        }
    }, []);

    useEffect(() => {
        socket.on('room:game-started', isGame);

        return () => {
            socket.off('room:game-started', isGame);
        }
    }, [socket, isGame]);


    useEffect(() => { 
        return () => {
            if(history.action !== 'PUSH') {
                socket.emit('room:leave-room');

            } else {
                socket.emit('room:is-in-room', (isInRoom) => {

                    // Wenn man sich in keinem Raum befindet
                    if(!isInRoom) {
                        history.push('/');
    
                    }
                });
            }
        }
    }, [socket, location, history])


    // Wenn die Sidebar aufgeklappt wird und die Anordnung geändert werden muss, wegen zu wenig Platz
    // Am Anfang richtige werte setzetn für bessere performance
    useLayoutEffect(() => {
        if($('#game-content').width() < 800) {
            isResponsive.current = false;

        } else {
            isResponsive.current = true;
        }

        const heightObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                if(entry.contentRect.width < 800 && isResponsive.current === false) {
                    $('#game-content').css({ justifyContent: 'center' });
                    $('.start-game').css({ width: '80% !important;' });
                    $('.start-game-text').css({ fontSize: '2vw' });

                    isResponsive.current = true;

                } else {
                    if(entry.contentRect.width >= 800 && isResponsive.current === true) {
                        $('#game-content').css({ justifyContent: 'space-around' });
                        $('.start-game').css({ width: '55% !important;' });
                        $('.start-game-text').css({ fontSize: '3vw' });

                        isResponsive.current = false;
                    }
                }
                });
        });

        const lobbyDivWrapper = document.getElementById('game-content');

        if (lobbyDivWrapper instanceof Element) {
            heightObserver.observe(lobbyDivWrapper);
        }

        return () => {
            heightObserver.disconnect();
        };
    });

    if(players === undefined || roomId === undefined || gameId === undefined || hostId === undefined || rules === undefined || gameName === undefined) {
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
        <div id='game-wrapper p-0'>
            <header id='game-header'>
                <Title text={ gameName } height="10vh" fontSize="4vw"/>
            </header>
            <main id='game-body-wrapper'>
                <div className='container-fluid p-0'>
                    <div id='game-body' className='row m-0'>
                        <div id='sidebar-wrapper' className='p-0'>
                            <SideBar position='left' contentId='#game-content-wrapper' sideBarWidth={ 40 } sideBarWindowWidth={ 350 } rules={ rules } allowCamera={ allowCamera } />
                        </div>
                        <div id='game-content-wrapper' className='col p-0'>
                            <Switch>
                                <Route path={`${ match.path }/`} exact render={ () => <Home /> } />
                                <Route path={`${ match.path }/lobby/:roomid`} render={ () => <Lobby hostId={ hostId } roomId={ roomId } gameId={ gameId }/> } />
                                <Route path={`${ match.path }/ludo/:roomid`} render={ () => <Ludo players={ players }/> }/>
                                <Route path={`${ match.path }/uno/:roomid`} render={ () => <Uno isHost={ hostId === socket.id ? true : false } players={ players } /> }/>
                                <Route path={`${ match.path }/slf/:roomid`} render={ () => <Slf isHost={ hostId === socket.id ? true : false } players={ players }/> } />
                                <Route component={ PageNotFound } />
                            </Switch>
                            <EndGameModal winners={ winners } isHost={ hostId === socket.id }/>
                            <Players players={ players } scores={ scores } game={ gameNameStarted } readyPlayers={ playersReady } settingAllowCamera={ settingAllowCamera }/>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default GameBase;
