import { useState, useCallback, useEffect, useContext } from 'react';
import $ from 'jquery';

import './Game.css';

import SocketContext from '../../../../../services/socket';

function Game(props) {
    // Socket holen
    const socket = useContext(SocketContext);

    // Obdie beschreibung ausgefahren ist
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Spiel abspeichern
    const [gameId, setgameId] = useState();

    useEffect(() => {
        setgameId(props.gameId)

        // Autofocus für Nameneingabe
        $(document).on('shown.bs.modal', '#create-game-modal-' + props.gameId, function () {
            $('#create-game-username-input-' + props.gameId).focus();
        });

    }, [props.gameId]);

    // Icon change
    $('#buttonCollapse').on('click',function(event) {
        event.preventDefault();
        $('.bi bi-chevron-right').toggle();
        $('.bi bi-chevron-down').toggle();
     });

    // Einen Raum erstellen
    const createRoom = useCallback(() => {
        socket.emit('room:create', { gameTypeId: gameId }, (error) => {
            if(error) {
                $('#create-game-error-output-' + gameId).text(error);

            }
        });
    }, [socket, gameId]);

    const setCollapse = () => {
        setIsCollapsed((state) => !state);
    }

    useEffect(() => {
        if(isCollapsed) {
            $('#desciption-collapse-btn-' + props.gameId).css({ transform: 'rotateZ(90deg)' });
        } else {
            $('#desciption-collapse-btn-' + props.gameId).css({ transform: 'rotateZ(0deg)' });
        }

    }, [isCollapsed, props.gameId]);

    useEffect(()=>{
        // Enter input für Submit Button ermöglichen
        $(".create-game-modal").keyup(function(event) {
            if (event.keyCode === 13) {
                document.getElementById("room:create").click();
            }
        });
    }, []);

    return (
        <div className='m-5' id="content-local-navigation">
            <div className="d-flex align-items-center justify-content-center" id="collapse-top">
                <button id={ "desciption-collapse-btn-" + props.gameId } className='home-collapse-button' type="button" data-toggle="collapse" data-target={ "#desciption-collapse-" + props.gameId } aria-expanded="false" aria-controls="collapseExample" onClick={ setCollapse }>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>
                <h4 id="nameGame">{ props.name }</h4>
                <button type="button" className="btn btn-dark btn-lg" data-toggle="modal" data-target={ "#create-game-modal-" + gameId }>Raum erstellen</button>
            </div>
            <div className="collapse" id={ "desciption-collapse-" + props.gameId }>
                    { props.description }           
            </div>
            <br/>
            <br/>


            {/* Modal */}
            <div className="modal fade create-game-modal" id={ "create-game-modal-" + gameId } role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content" id="modal-create-game">
                        <div className="modal-header text-center" id="modal-header">
                            <h5 className="modal-title w-100">Erstelle ein "{ props.name }" Spiel</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div className="form-group">
                                    <input id={ 'create-game-username-input-' + gameId } type="text" className="form-control" placeholder="Username"/>
                                </div>
                                <div>
                                    <small id={ 'create-game-error-output-' + gameId } className="text-danger"></small>
                                </div>
                                <div className='text-center'>
                                    <button id="room:create" type="submit" className="btn btn-dark" onClick={ createRoom }>Raum erstellen</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Game;