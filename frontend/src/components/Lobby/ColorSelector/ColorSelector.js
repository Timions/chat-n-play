import { useContext, useState, useEffect } from 'react';
import $ from 'jquery';

import './ColorSelector.css'

import ColorDot from './ColorDot/ColorDot';
import SocketContext from '../../../services/socket';

function ColorSelector() {

    const [colors, setColors] = useState([]);

    // Socket.io
    const socket = useContext(SocketContext);
    // Socket Events
    useEffect(() => { 
        socket.emit('room:get-color-selector');
        socket.on('room:update-color-selector', (data) => {
            setColors(data.colors)
        });
        
    }, [socket]);

    // Events unmounten
    useEffect(() => {    
        return () => {
            socket.off('room:update-color-selector');
        }
    }, [socket]);

    // Farbe setzten
    const setColor = (color) => {
        socket.emit('room:set-color', { color }, (error) => {
            if(error) {
                console.log(error);
            }
        })
    }


    // Einmal ganz am Anfang resize Event setzten
    useEffect(() => {

        $('.color-dot-wrapper').height($('.color-dot-wrapper').width());

        const handleWindowResizeEvent = () => {
            $('.color-dot-wrapper').height($('.color-dot-wrapper').width());
        }

        window.addEventListener('resize', handleWindowResizeEvent);

        return() => {
            window.removeEventListener('resize', handleWindowResizeEvent);
        }

    });

    return (
        <div className='color-selector'>
            <p>Farbauswahl</p>
            <div className='colors'>
                {
                    colors.map(colorObj => (
                        <ColorDot key={ colorObj.color } color={ colorObj.color } owner={ colorObj.socketId } socketId={ socket.id } setColorMethod={ setColor }/>
                    ))
                }
            </div>
        </div>
    );
}

export default ColorSelector;