import { useCallback, useContext, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import $ from "jquery";

import './Home.css'

import '../../img/Titel_Weiß.png'

import SocketContext from '../../services/socket';
import Header from './Header/Header';
import Description from './Description/Description';
import GameCategoriesList from './GameCategoriesList/GameCategoriesList';
import Footer from '../Footer/Footer';

function Home({ match }) {

    // Router Stuff
    const history = useHistory();
    const location = useLocation();

    // Socket.io
    const socket = useContext(SocketContext);

    //Events:
    // Wenn man einem Raum gejoined ist -> Lobby laden
    const handleRoomJoined = useCallback((data) => {
        // Modals schließen
        $('#create-game-modal-' + data.gameTypeId).modal('hide');
        $('#join-game-modal').modal('hide');

        history.push({
            pathname: '/game/lobby/' + data.roomId,
            state: { data: data }
        });

    }, [history]);

    useEffect(() => {
        // Wenn man einem Raum gejoint ist -> Lobby laden
        socket.on("room:joined", handleRoomJoined);

        // Iniviation Link -> Direkt Code Feld Ausfüllen
        let parameters = location.state;

        if(parameters !== undefined) {
            $('#join-game-modal').modal('show');
            $('#join-game-roomid-input').val(parameters.roomId);
        }
        
    }, [socket, location, handleRoomJoined]);


    // Events unmounten
    useEffect(() => {    
        return () => {
            socket.off('room:joined', handleRoomJoined);
        }
    }, [socket, handleRoomJoined])

    return (
        <div className='p-0'>
            <header className="sticky-top">
                <Header/>
            </header>
            <main>
                <div className='container-fluid' id="startseite">
                    <div className='row justify-content-center'>
                        <div className="col">
                            <Description />
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className="col p-0">
                            <GameCategoriesList match={ match } />
                        </div>
                    </div>
                </div>
            </main>
            <Footer></Footer>
        </div>
    );
}

export default Home;