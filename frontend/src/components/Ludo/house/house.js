import React from 'react';
import '../Ludo.css';

function House(props){

    let first;
    let second;
    let third;
    let fourth; 

    let posStyle;

    // Spieler unten
    if(!props.top) {

        // Spieler links
        if(props.left) {
            posStyle = {
                left: '0',
                top: '-55px'
            }

        // Spieler rechts
        } else {
            posStyle = {
                right: '0',
                top: '-55px'
            }
        }
    } else {
        // Spieler links
        if(props.left) {
            posStyle = {
                left: '0'
            }

        // Spieler rechts
        } else {
            posStyle = {
                right: '0'
            }
        }
    }

    switch (props.position) {
        case "top-right": 
            first = 101;
            second = 102;
            third = 103;
            fourth = 104;
            break;
        case "top-left": 
            first = 113;
            second = 114;
            third = 115;
            fourth = 116;
            break;
        case "bottom-right": 
            first = 105;
            second = 106;
            third = 107;
            fourth = 108;
            break;
        case "bottom-left": 
            first = 109;
            second = 110;
            third = 111;
            fourth = 112;
            break;
        default:
            first = -1;
            second = -1;
            third = -1;
            fourth = -1;
      }

    return(
        <div className='house-wrapper' style={ posStyle }> 
            <button id = {first} disabled style = {{'backgroundColor': props.color}} className= "house"></button>
            <button id = {second} disabled style = {{'backgroundColor': props.color}} className = "house"></button>
            <button id = {third} disabled style = {{'backgroundColor': props.color}} className = "house"></button>
            <button id = {fourth} disabled style = {{'backgroundColor': props.color}} className = "house"></button>
        </div>
    )
}

export default House;

