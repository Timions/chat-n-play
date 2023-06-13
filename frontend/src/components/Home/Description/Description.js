import { useCallback, useContext, useEffect } from 'react';
import $ from 'jquery';

import './Description.css'
import '../../../fonts/coffee+teademo-Regular.ttf'
import Grafik from '../../../img/GrafikStartseite.png'

import SocketContext from '../../../services/socket';

function Description() {

     // Socket holen
     const socket = useContext(SocketContext);

    // Einen Raum beitreten
    const joinRoom = useCallback(() => {
        let username = $('#join-game-username-input').val();
        let roomId = $('#join-game-roomid-input').val();

        // Raum joinen
        socket.emit('room:join', { roomId: roomId, username }, (error) => {
            if(error) {
                $('#join-game-error-output').text(error);

            }
        });

    }, [socket]);

    useEffect(() => {
        // Autofocus für Nameneingabe
        $(document).on('shown.bs.modal', '#join-game-modal', function () {
            $('#join-game-username-input').focus();
        });

        // Enter input für Submit Button ermöglichen
        $("#join-game-modal").keyup(function(event) {
            if (event.keyCode === 13) {
                document.getElementById("room:join").click();
            }
        });
    });

    return (
        <div id="home-description">
            <div id='home-description-wrapper'>
                <div className="d-sm-none" id="note-smartphone-user">
                    <p> Diese Seite wurde für Tablets und Desktops erstellt und angepasst. Um dieses Seite effektiv nutzen zu können, verwende bitte ein anderes Gerät.</p>
                </div>
                <h2 className='text-center'>Willkommen zu Chat&nbsp;N'&nbsp;Play</h2>
                    <div>
                        <img src={Grafik} id="img-Startseite" alt=''></img>
                    </div>
                <p id='home-description-text' className='text-center'>Hier kannst du mit deinen Freunden*innen auch über Distanz das Spieleabend-Feeling erleben.<br />
                Erstelle einfach einen Raum und lade sie über einen Link ein<br />
                oder lasse ihnen den Zugangscode zukommen.</p>
            </div>
            <div id='home-description-join-game-btn' className='d-flex justify-content-center'>
                <button type="button" className="btn btn-dark btn-lg" data-toggle="modal" data-target="#join-game-modal">Spiel beitreten</button>
            </div>

            {/* Modal */}
            <div className="modal fade" id="join-game-modal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content" id="modal-join-game">
                        <div className="modal-header text-center" id="modal-header">
                            <h5 className="modal-title w-100">Trete einem Spiel bei</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div className="form-group">
                                    <input id='join-game-username-input' type="text" className="form-control" placeholder="Username" />
                                </div>
                                <div className="form-group">
                                    <small htmlFor="exampleInputPassword1">Gebe hier den Code für einen bereits erstellten Raum ein:</small>
                                    <input id='join-game-roomid-input' type="text" className="form-control" placeholder="Code" />
                                </div>
                                <div>
                                    <small id='join-game-error-output' className="text-danger"></small>
                                </div>
                                <div className='text-center'>
                                    <button id="room:join" type="submit" className="btn btn-dark" onClick={ joinRoom }>Raum beitreten</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Description;