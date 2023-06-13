import { useContext } from 'react';
import $ from 'jquery';

import './WinnerDisplay.css';

import SocketContext from "../../../services/socket";
import { useHistory } from 'react-router';

function WinnerDisplay(props) {

    // Socket 
    const socket = useContext(SocketContext);

    // Router Stuff
    const history = useHistory();

    let winnersArr = [];

    // Rang berechnen
    if(props.winners !== undefined) {
        let winners = props.winners.length;

        if(winners === 1) {
            winnersArr.push(props.winners[0])
            winnersArr.push(' hat gewonnen!');

        } else {
            for(let player of props.winners) {
                winnersArr.push(player);
                winnersArr.push(', ');
            }

            winnersArr.pop(winners - 1);
            winnersArr[winners - 1] = ' und '

            winnersArr.push(' haben gewonnen!');
        }
    }

    const newGame = () => {
        socket.emit('room:change-game');
    }


    const closeRoom = () => {
        $('#endgame-modal').modal('hide');

        socket.emit('room:close-room');

    }


    // Spiel verlassen
    const leaveRoom = () => {
        socket.emit('room:leave-room');
        history.push('/');

    }

    // Spieler ist host
    if(props.isHost) {
        return (
            <div id='endgame-modal-content' className="modal-content">
                <div id='endgame-modal-header' className="modal-header text-center">
                    <p id='endgame-modal-title' className="modal-title w-100">
                        {
                            winnersArr.map((player, index) => {
                                if(index % 2 === 0) {
                                    return <span key={ index } className='endgame-modal-playername'>{ player }</span>

                                } else {
                                    return <span key={ index }>{ player }</span>;

                                }
                            })
                        }
                    </p>
                </div>
                <div id='endgame-modal-body' className="modal-body text-center">
                    <p className='endgame-modal-body-text w-100'>Möchtest du noch ein Spiel starten oder den Raum beenden?</p>
                </div>
                <div id='endgame-modal-footer' className="modal-footer">
                    <button type="button" className="btn btn-dark" onClick={ newGame }>Neues Spiel</button>
                    <button type="button" className="btn btn-dark" onClick={ closeRoom }>Raum beenden</button>
                </div>
            </div>
        );
    }

    // Spieler ist kein Host
    return (
        <div id='endgame-modal-content' className="modal-content">
            <div id='endgame-modal-header' className="modal-header text-center">
                <p id='endgame-modal-title' className="modal-title w-100">
                    {
                        winnersArr.map((player, index) => {
                            if(index % 2 === 0) {
                                return <span key={ index } className='endgame-modal-playername'>{ player }</span>

                            } else {
                                return <span key={ index }>{ player }</span>;

                            }
                        })
                    }
                </p>
            </div>
            <div id='endgame-modal-body' className="modal-body  text-center">
                <p className='endgame-modal-body-text'>Warte bis ein neues Spiel gestart oder der Raum beendet wurde.</p>
            </div>
            <div id='endgame-modal-footer' className="modal-footer">
                <button type="button" className="btn btn-dark" onClick={ leaveRoom }>Raum verlassen</button>
            </div>
        </div>
    );
}

export default WinnerDisplay;