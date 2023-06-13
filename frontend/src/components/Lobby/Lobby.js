import { useContext, useEffect, useCallback, useLayoutEffect } from 'react';
import { useHistory } from "react-router-dom";
import $ from 'jquery';

import StartGame from './StartGame/StartGame';
import InvitationCopyBoards from './InvitationCopyBoards/InvitationCopyBoards';
import ColorSelector from './ColorSelector/ColorSelector';

import lobbybluetop from '../../img/background_lobby_blue_top.png';
import lobbybluebottom from '../../img/background_lobby_blue_bottom.png';
import lobbyredtop from '../../img/background_lobby_top.png';
import lobbyredbottom from '../../img/background_lobby_bottom.png';
import lobbygreentop from '../../img/background_lobby_green_top.png';
import lobbygreenbottom from '../../img/background_lobby_green_bottom.png';

import './Lobby.css'

import SocketContext from '../../services/socket';

function Lobby(props) {

    // Router Stuff
    const history = useHistory();

    // Socket.io
    const socket = useContext(SocketContext);

    // Wenn das Spiel gestarted wurde
    const handleGameStartedEvent = useCallback((data) => {

        document.getElementById("game-content-wrapper").style.backgroundImage = "none";


        history.push({
            pathname: '/game' + data.route,
            state: {
                gameId: props.gameId
            }
        });


    }, [history, props.gameId]);

    // Sets the background image
    useLayoutEffect(() => {
    
        if (props.gameId === 0) {
            $("#game-content-wrapper").css({background: "url("+lobbyredtop+") top left, url("+lobbyredbottom+") bottom right"});
            $("#game-content-wrapper").css({"background-repeat" : "no-repeat"})
            $("#game-content-wrapper").css({"background-size" : "200px, 450px"})
        } else if (props.gameId === 1) {
            $("#game-content-wrapper").css({background: "url("+lobbygreentop+") top left, url("+lobbygreenbottom+") bottom right"});
            $("#game-content-wrapper").css({"background-repeat" : "no-repeat"})
            $("#game-content-wrapper").css({"background-size" : "200px, 450px"})
        } else {
            $("#game-content-wrapper").css({background: "url("+lobbybluetop+") top left, url("+lobbybluebottom+") bottom right"});
            $("#game-content-wrapper").css({"background-repeat" : "no-repeat"})  
            $("#game-content-wrapper").css({"background-size" : "200px, 450px"}) 
        }
    },[props]);


    // Socket Events
    useEffect(() => {
        $('.invitation-button').height($('.invitation-button').width());

        socket.on('room:game-started', handleGameStartedEvent);

        return () => {
            // Events unmounten
            socket.off('room:game-started', handleGameStartedEvent);
            

        };

    }, [socket, handleGameStartedEvent]);

    return (
        <div id='game-content'>
            <ColorSelector />
            <StartGame hostId={ props.hostId } />
            <InvitationCopyBoards roomId={ props.roomId } />
        </div>
    );
}

export default Lobby;