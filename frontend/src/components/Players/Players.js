import { useCallback, useContext, useLayoutEffect, useRef } from 'react';
import $ from 'jquery';
import Peer from 'peerjs';

import './Players.css'; 

import Player from './Player/Player';
import SocketContext from "../../services/socket";

function Players(props) {

    const socket = useContext(SocketContext);
    //const useVideos = process.env.NODE_ENV === 'production';
    const useVideos = true;
    //process.env.NODE_ENV === 'production';

    // Positionen der Spieler
    const positions = ['top-left', 'bottom-right', 'top-right', 'bottom-left'];

    // Users Video Stream
    const myStream = useRef();

    const resizePlayerHandler = useCallback(() => {
        $('.player').height($('.player').width()/16 * 9);

    }, []);

    useLayoutEffect(() => {
        // Wenn die Fenstergröße geändert wird -> Größe anpassen
        window.addEventListener('resize', resizePlayerHandler);

        return () => {
            window.removeEventListener('resize', resizePlayerHandler);
        }

    }, [resizePlayerHandler]);

    /**
     * 1. Spieler joint einem Raum
     * 2. a) Spieler akzeptiert Kamera nicht -> aus dem Raum schmeißen
     * 2. b) Spieler akzeptiert Kamera -> Event an Server schicken, dass ein Spieler gejoined ist (webcam:joined)
     * 3. Alle anderen Spieler erhalten ein Event, dass ein Spieler gejoint ist + dessen id (webcam:user-joined)
     * 4. Nur bauen alle schon im Raum bestehenden Sockets eine Verbindung zum neuen Socket auf.
     */

    const clickEvent = () =>{
        document.getElementById("startWebcam").click();
    }

    const ask4Video = useCallback(() => {
        const addVideoStream = (socketId, stream) => {
            let video = document.getElementById('player-video-' + socketId);
            video.srcObject = stream.clone();

            video.onloadedmetadata = function(e) {
                video.play();
            };
        }

        let peerOptions;

        // Production
        if(process.env.NODE_ENV === 'production') {
            peerOptions = {
                undefined,
                path: '/',
                secure: true
            }
            
        // Development
        } else {
            peerOptions = {
                undefined,
                path: '/peerjs',
                host: '/',
                port: '8080'
            }
        }

        let constraints = {
            'audio': true,
            'video': {
                'quality': 5,
            }
        };

        navigator.mediaDevices.getUserMedia(constraints)
        .then(streamWithVideo => {

            myStream.current = streamWithVideo;

            $("#enableWebcam").addClass("d-none");
            $("#disableWebcam").removeClass("d-none");

            // Eigener Peer
            const peer = new Peer(peerOptions);

            // Kamera wird erlaubt
            let video = document.getElementById('player-video-' + socket.id);
            video.muted = true;
            video.srcObject = streamWithVideo;

            // Eigene Kamera abspielen
            video.onloadedmetadata = function(e) {
                video.play();
            };
            
            peer.on('open', id => {
                // Server sagen, dass man nun einen Stream hat zum senden
                socket.emit('webcam:joined', { peerId: id });
            });

            // Wenn ein neuer User connected => mit neuem User verbinden
            socket.on('webcam:user-joined', data => {
                connectToNewUser(data.peerId, data.socketId);
            });

            const connectToNewUser = (peerId, otherSocketId) => {
                const call = peer.call(peerId, streamWithVideo, { metadata: { socketId: socket.id }});

                call.on('stream', userVideoStream => {
                    addVideoStream(otherSocketId, userVideoStream);
                });
            }

            peer.on('call', call => {
                let otherSocketId = call.metadata.socketId;
                call.answer(streamWithVideo, { metadata: { socketId: socket.id }});

                call.on('stream', otherStream => {
                    if(otherStream.getVideoTracks().length === 0) {
                        call.close();
                        connectToNewUser(call.peer, otherSocketId);

                    } else {
                        addVideoStream(otherSocketId, otherStream);

                    }
                });
            });
        
            // Kamera deaktivieren
            socket.on("webcam:disabled",() =>{
                streamWithVideo.getVideoTracks()[0].enabled = false;
            });

            socket.on("webcam:enabled",() =>{
                streamWithVideo.getVideoTracks()[0].enabled = true;
            });

            socket.on("webcam:micMuted", () =>{
                streamWithVideo.getAudioTracks()[0].enabled = false;
            });

            socket.on("webcam:micUnmuted", () =>{
                streamWithVideo.getAudioTracks()[0].enabled = true;
            });

            socket.emit("webcam:enable");
            socket.emit('webcam:unmuteMic');
        })
        .catch((err) => {
            // Nur nach Mikrofon fragen
            let constraintsAudioOnly = {
                'audio': true,
                'video': false
            }

            navigator.mediaDevices.getUserMedia(constraintsAudioOnly)
            .then(streamAudioOnly => {

                myStream.current = streamAudioOnly;

                props.settingAllowCamera(false);

                // Eigener Peer
                const peer = new Peer(peerOptions);
    
                peer.on('open', id => {
                    // Server sagen, dass man nun einen Stream hat zum senden
                    socket.emit('webcam:joined', { peerId: id });
                });
    
                // Wenn ein neuer User connected => mit neuem User verbinden
                socket.on('webcam:user-joined', data => {
                    connectToNewUser(data.peerId, data.socketId);
                });
    
                const connectToNewUser = (peerId, otherSocketId) => {
                    const call = peer.call(peerId, streamAudioOnly, { metadata: { socketId: socket.id }});

                    call.on('stream', otherStream => {
                        addVideoStream(otherSocketId, otherStream);
                    });
                }

                peer.on('call', call => {
                    let otherSocketId = call.metadata.socketId;
                    call.answer(streamAudioOnly, { metadata: { socketId: socket.id }});
    
                    call.on('stream', userVideoStream => {
                        addVideoStream(otherSocketId, userVideoStream);
                    });
                });

                socket.on("webcam:micMuted", () =>{
                    streamAudioOnly.getAudioTracks()[0].enabled = false;
                });

                socket.on("webcam:micUnmuted", () =>{
                    streamAudioOnly.getAudioTracks()[0].enabled = true;
                });

                socket.emit("webcam:disable");
                socket.emit('webcam:unmuteMic');
            })
            .catch(err => {
                window.location.reload();
            });
        });

    }, [socket, props.settingAllowCamera]);

    useLayoutEffect(() => {
        if(useVideos) {
            const captureVideoButton = document.querySelector('#startWebcam');
            captureVideoButton.onclick = () => {
                ask4Video();
            };

            clickEvent();
        }

        // Kamera & Audio stoppen
        return () => {

            if(myStream.current !== undefined) {
                myStream.current.getTracks().forEach((track) => {
                    track.stop();
                });
            }
        }

    }, [socket, useVideos, ask4Video]);

    return (
        <div className='players'>
            {
                props.players.map(player => {
                    let score = props.scores.find(score => score.username === player.username)
                   
                    if(!player.hasVideo) {
                        $('#player-profile-' + player.socketId).css({ opacity: 1 });
                        $('#player-video-' + player.socketId).css({ opacity: 0 });

                    } else {
                        $('#player-profile-' + player.socketId).css({ opacity: 0 });
                        $('#player-video-' + player.socketId).css({ opacity: 1 });
                    }

                    return (
                        <Player key = { player.username  } 

                            // Username des Spielers
                            username = { player.username }

                            // Socket Id des Spielers
                            socketId = { player.socketId }

                            // Farbe des Spielers
                            color = { player.color }

                            // Position des Spielers (oben links: 0, unten rechts: 1, oben rechts: 2, unten links: 3)
                            position = { positions[player.position] }

                            // die Punktzahl des Spielers
                            score = { score === undefined ? undefined : score.score } 

                            // Wenn es in dem Spiel eine Punktzahl gibt, zeigt der Rank die aktuelle Plazierung
                            rank = { score === undefined ? undefined : score.rank }

                            // Welches Spiel zurzeit gespielt wird
                            game = { props.game === undefined ? undefined : props.game }

                            // Breite der Kameras, kann optional gesetzt werden, wenn mehr platz für ein Spiel gebraucht wird
                            width = { props.width }

                            // Zeigt an ob ein Spieler 'bereit' ist. Zum Beispiel einen Button gedrückt hat 
                            ready = { props.readyPlayers.find(entry => entry === player.socketId) === undefined ? false : true }
                            
                            // Ob die Kamera / der Spieler man selbst ist
                            self = { player.socketId === socket.id }

                            // Ob man gemuted ist
                            muted = { player.isMuted }
                        />
                    )
                })
            }
        </div>
    );
}

export default Players;