import $ from 'jquery';
import { useLayoutEffect, useState } from 'react';
import House from '../../Ludo/house/house';

import './Player.css';

function Player(props) {

    const [parentElementWidth, setParentElementWidth] = useState();

    const x_res = 16;
    const y_res = 9;

    useLayoutEffect(() => {
        setParentElementWidth($(".players").width());

    }, []);

    let color;

    if(props.color === '#0B97F0') {
        color = 'blue';

    } else if(props.color === '#00BF02') {
        color = 'green';

    } else if(props.color === '#FCA701') {
        color = 'orange';

    } else if(props.color === '#FF3030') {
        color = 'red';

    }

    // Falls div Struktur falsch aufgebaut ist
    if(parentElementWidth === undefined) {
        return (
            <div></div>
        );
    }

    const width = props.width === undefined ? 24 : props.width;
    const playerStyle = {
        width: width + '%',
        height: (parentElementWidth / 100 * width) / x_res * y_res,
        minWidth: '200px',
        minHeight: (200 / x_res * y_res) + 'px'
    };

    // true => auf der linken Seite | false => auf der rechten Seite
    let leftSide = false;

    if(props.position === 'top-left' || props.position === 'bottom-left') {
        leftSide = true;
    }

    // true => oben | false => unten
    let onTop = false;

    if(props.position === 'top-left' || props.position === 'top-right') {
        onTop = true;
    }

    let textAlignStyle = {
        textAlign: leftSide === true ? 'left' : 'right'
    }

    if(props.color === undefined) {
        return (
            <div className={ props.position + ' player'} style={ playerStyle }>
                <div style={{ border: '3px solid #474747' }} className='camera'>
                    <video id={ 'player-video-' + props.socketId } autoPlay playsInline />
                    <img id={ 'player-profile-' + props.socketId } className='player-profile' alt="Spielerplatzhalter" src='/PlayerProfiles/profile-no-color.png' />
                </div>
                <div className='player-name'>
                    <p style={ textAlignStyle }>{ props.username }</p>
                </div>
            </div>
        );

    } else if(props.game === "ludo") {

        if(onTop) {
            return (
                <div className={ props.position + ' player'} style={ playerStyle }>
                    <div style={{ border: '3px solid ' + props.color }} className='camera'>
                        <video id={ 'player-video-' + props.socketId } autoPlay playsInline />
                        <img id={ 'player-profile-' + props.socketId } className='player-profile' alt="Spielerplatzhalter" src={ '/PlayerProfiles/profile-' + color + '.png'} />
                    </div>
                    <div className='player-name'>
                        <p style={ textAlignStyle }>{ props.username }</p>
                        <House color={ props.color } position={ props.position } top={ onTop } left={ leftSide }/>
                    </div>
                </div>
            );
        }
    
        return (
            <div className={ props.position + ' player'} style={ playerStyle }>
                <div style={{ border: '3px solid ' + props.color }} className='camera'>
                    <video id={ 'player-video-' + props.socketId } autoPlay playsInline />
                        <img id={ 'player-profile-' + props.socketId } className='player-profile' alt="Spielerplatzhalter" src={ '/PlayerProfiles/profile-' + color + '.png'} />
                </div>
                <House color={ props.color } position={ props.position } top={ onTop } left={ leftSide } />
                <div className='player-name'>
                    <p style={ textAlignStyle }>{ props.username }</p>
                </div>
            </div>
        );

    } else if(props.game === "uno") {
        return(
            <div className={ props.position + ' player'} style={ playerStyle }>
                <div style={{ border: '3px solid ' + props.color }} className='camera'>
                    <video id={ 'player-video-' + props.socketId } autoPlay playsInline />
                        <img id={ 'player-profile-' + props.socketId } className='player-profile' alt="Spielerplatzhalter" src={ '/PlayerProfiles/profile-' + color + '.png'} />
                </div>
                <div className='player-name'>
                    <p style={ textAlignStyle }>{ props.username }</p>
                </div>
            </div>
        );

    } else if(props.score === undefined) {
        return (
            <div className={ props.position + ' player'} style={ playerStyle }>
                <div style={{ border: '3px solid ' + props.color }} className='camera'>
                    <video id={ 'player-video-' + props.socketId } autoPlay playsInline />
                        <img id={ 'player-profile-' + props.socketId } className='player-profile' src={ '/PlayerProfiles/profile-' + color + '.png'} alt='Spielerprofil Bild'/>
                </div>
                <div className='player-name'>
                    <p style={ textAlignStyle }>{ props.username }</p>
                </div>
            </div>
        );

    } else {
        let rank;

        switch(props.rank) {
            case 1:
                rank = '\u2460 ';
                break;
            case 2:
                rank = '\u2461 ';
                break;
            case 3:
                rank = '\u2462 ';
                break;
            case 4:
                rank = '\u2463 ';
                break;
            default:
                rank = '';
          }

        return (
            <div className={ props.position + ' player'} style={ playerStyle }>
                <div style={{ border: '3px solid ' + props.color }} className='camera'>
                    <video id={ 'player-video-' + props.socketId } autoPlay playsInline />
                        <img id={ 'player-profile-' + props.socketId } className='player-profile' src={ '/PlayerProfiles/profile-' + color + '.png'}  alt='Spielerprofil Bild'/>
                </div>
                <div className='player-name-score' style={{ flexDirection: leftSide === true ? 'row' : 'row-reverse' }}>
                    <p>{ rank + props.username + (props.ready === true ? ` \u2713`: '') }</p>
                    <p>{ 'Score: ' + props.score }</p>
                </div>
            </div>
        );
    }
}

export default Player;