import React, { useContext, useLayoutEffect, useCallback, useEffect, useState } from 'react';
import $ from 'jquery';

import '../Ludo.css';
import SocketContext from '../../../services/socket';

function Matchfield(props) {

    // State, um Felder auf dem Spielbrett zu entsperren
    const [disable1, setDisable1] = useState(true);
    const [disable2, setDisable2] = useState(true);
    const [disable3, setDisable3] = useState(true);
    const [disable4, setDisable4] = useState(true);
    const [disable5, setDisable5] = useState(true);
    const [disable6, setDisable6] = useState(true);
    const [disable7, setDisable7] = useState(true);
    const [disable8, setDisable8] = useState(true);
    const [disable9, setDisable9] = useState(true);
    const [disable10, setDisable10] = useState(true);
    const [disable11, setDisable11] = useState(true);
    const [disable12, setDisable12] = useState(true);
    const [disable13, setDisable13] = useState(true);
    const [disable14, setDisable14] = useState(true);
    const [disable15, setDisable15] = useState(true);
    const [disable16, setDisable16] = useState(true);
    const [disable17, setDisable17] = useState(true);
    const [disable18, setDisable18] = useState(true);
    const [disable19, setDisable19] = useState(true);
    const [disable20, setDisable20] = useState(true);
    const [disable21, setDisable21] = useState(true);
    const [disable22, setDisable22] = useState(true);
    const [disable23, setDisable23] = useState(true);
    const [disable24, setDisable24] = useState(true);
    const [disable25, setDisable25] = useState(true);
    const [disable26, setDisable26] = useState(true);
    const [disable27, setDisable27] = useState(true);
    const [disable28, setDisable28] = useState(true);
    const [disable29, setDisable29] = useState(true);
    const [disable30, setDisable30] = useState(true);
    const [disable31, setDisable31] = useState(true);
    const [disable32, setDisable32] = useState(true);
    const [disable33, setDisable33] = useState(true);
    const [disable34, setDisable34] = useState(true);
    const [disable35, setDisable35] = useState(true);
    const [disable36, setDisable36] = useState(true);
    const [disable37, setDisable37] = useState(true);
    const [disable38, setDisable38] = useState(true);
    const [disable39, setDisable39] = useState(true);
    const [disable40, setDisable40] = useState(true);
    
    const [disable201, setDisable201] = useState(true);
    const [disable202, setDisable202] = useState(true);
    const [disable203, setDisable203] = useState(true);
    const [disable205, setDisable205] = useState(true);
    const [disable206, setDisable206] = useState(true);
    const [disable207, setDisable207] = useState(true);
    const [disable209, setDisable209] = useState(true);
    const [disable210, setDisable210] = useState(true);
    const [disable211, setDisable211] = useState(true);
    const [disable213, setDisable213] = useState(true);
    const [disable214, setDisable214] = useState(true);
    const [disable215, setDisable215] = useState(true);

    const [enableFields, setEnableFields] = useState([]);

    // Socket.io
    const socket = useContext(SocketContext);

    let disableButton = {
        1: function(param){setDisable1(param)},
        2: function(param){setDisable2(param)},
        3: function(param){setDisable3(param)},
        4: function(param){setDisable4(param)},
        5: function(param){setDisable5(param)},
        6: function(param){setDisable6(param)},
        7: function(param){setDisable7(param)},
        8: function(param){setDisable8(param)},
        9: function(param){setDisable9(param)},
        10: function(param){setDisable10(param)},
        11: function(param){setDisable11(param)},
        12: function(param){setDisable12(param)},
        13: function(param){setDisable13(param)},
        14: function(param){setDisable14(param)},
        15: function(param){setDisable15(param)},
        16: function(param){setDisable16(param)},
        17: function(param){setDisable17(param)},
        18: function(param){setDisable18(param)},
        19: function(param){setDisable19(param)},
        20: function(param){setDisable20(param)},
        21: function(param){setDisable21(param)},
        22: function(param){setDisable22(param)},
        23: function(param){setDisable23(param)},
        24: function(param){setDisable24(param)},
        25: function(param){setDisable25(param)},
        26: function(param){setDisable26(param)},
        27: function(param){setDisable27(param)},
        28: function(param){setDisable28(param)},
        29: function(param){setDisable29(param)},
        30: function(param){setDisable30(param)},
        31: function(param){setDisable31(param)},
        32: function(param){setDisable32(param)},
        33: function(param){setDisable33(param)},
        34: function(param){setDisable34(param)},
        35: function(param){setDisable35(param)},
        36: function(param){setDisable36(param)},
        37: function(param){setDisable37(param)},
        38: function(param){setDisable38(param)},
        39: function(param){setDisable39(param)},
        40: function(param){setDisable40(param)},
        201: function(param){setDisable201(param)},
        202: function(param){setDisable202(param)},
        203: function(param){setDisable203(param)},
        205: function(param){setDisable205(param)},
        206: function(param){setDisable206(param)},
        207: function(param){setDisable207(param)},
        209: function(param){setDisable209(param)},
        210: function(param){setDisable210(param)},
        211: function(param){setDisable211(param)},
        213: function(param){setDisable213(param)},
        214: function(param){setDisable214(param)},
        215: function(param){setDisable215(param)},
      };
      

    useLayoutEffect(() => {

        // Alle möglichen Spielerpositionen
        const positions = ['top-left', 'bottom-right', 'top-right', 'bottom-left'];

        // Alle möglichen Spielerfarben
        const colors = [{ hex: '#FCA701', color: 'yellow' },
            { hex: '#00BF02', color: 'green'},
            { hex: '#FF3030', color: 'red' },
            { hex: '#0B97F0', color: 'blue' }];

        // Durch Spieler iterieren und deren Positionen bekommen um die Spielfelder farbig zu machen
        for(let player of props.players) {
            let position = player.position;
            let colorindex = colors.findIndex(c => c.hex === player.color);

           $('.mf-' + positions[position]).addClass(colors[colorindex].color + '-light');
        }

    }, [props]);

    //Funktionsaufruf bei onClick auf die Spielfigur um zu ziehen wird ein emit ausgeführt
    const moveFigure = (event) => {
        const id = event.target.id;

        socket.emit("ludo:clickFigure", id);

        $(".matchfield").find(":button").css("animation", "");
        enableFields.forEach(element => {
            disableButton[element](true);
        });
    }

    //Spielfiguren werden für den Zug freigeschaltet
    const handleUnlockMoveFieldsEvent = useCallback((figures) => {
        setEnableFields(figures);

        figures.forEach(element =>{
            disableButton[element](false);
            $("#"+element).css("animation", "pulse 2s infinite");
        });
    }, []);


    //Socket Events
    useEffect(() => {
        socket.on('ludo:unlockMoveFields', handleUnlockMoveFieldsEvent);

        //Events umounten
        return () => {
            socket.off('ludo:unlockMoveFields');
        }

    }, [socket, handleUnlockMoveFieldsEvent]);


    return(
        <div className = "matchfield">
                <div>
                    <button id = "39"  onClick = {moveFigure} className = "white" disabled ={disable39}></button>
                    <button id = "40"  onClick = {moveFigure} className = "white middle" disabled ={disable40}></button>
                    <button id = "1"   onClick = {moveFigure} className = "mf-top-right start img" disabled ={disable1}></button>
                </div>
                <div>
                    <button id = "38"  onClick = {moveFigure} className = "white" disabled ={disable38}></button>
                    <button id = "201" onClick = {moveFigure} className = "mf-top-right" disabled ={disable201}></button>
                    <button id = "2"   onClick = {moveFigure} className = "white arrow1" disabled ={disable2}></button>
                </div>
                <div>
                    <button id = "37"  onClick = {moveFigure} className = "white" disabled ={disable37}></button>
                    <button id = "202" onClick = {moveFigure} className = "mf-top-right" disabled ={disable202}></button>
                    <button id = "3"   onClick = {moveFigure} className = "white" disabled ={disable3}></button>
                </div>
                <div>
                    <button id = "36"  onClick = {moveFigure} className = "white" disabled ={disable36}></button>
                    <button id = "203" onClick = {moveFigure} className = "mf-top-right" disabled ={disable203}></button>
                    <button id = "4"   onClick = {moveFigure} className = "white" disabled ={disable4}></button>
                </div>
                <div>
                    <button id = "31"  onClick = {moveFigure} className = "mf-top-left start img" disabled ={disable31}></button>
                    <button id = "32"  onClick = {moveFigure} className = "white arrow2" disabled ={disable32}></button>
                    <button id = "33"  onClick = {moveFigure} className = "white" disabled ={disable33}></button>
                    <button id = "34"  onClick = {moveFigure} className = "white" disabled ={disable34}></button>
                    <button id = "35"  onClick = {moveFigure} className = "white" disabled ={disable35}></button>
                    <button id = "204" onClick = {moveFigure} className = "mf-top-right" disabled></button>
                    <button id = "5"   onClick = {moveFigure} className = "white" disabled ={disable5}></button>
                    <button id = "6"   onClick = {moveFigure} className = "white" disabled ={disable6}></button>
                    <button id = "7"   onClick = {moveFigure} className = "white" disabled ={disable7}></button>
                    <button id = "8"   onClick = {moveFigure} className = "white" disabled ={disable8}></button>
                    <button id = "9"   onClick = {moveFigure} className = "white" disabled ={disable9}></button>
                </div>
                <div>
                    <button id = "30"  onClick = {moveFigure} className = "white" disabled ={disable30}></button>
                    <button id = "213" onClick = {moveFigure} className = "mf-top-left" disabled ={disable213}></button>
                    <button id = "214" onClick = {moveFigure} className = "mf-top-left" disabled ={disable214}></button>
                    <button id = "215" onClick = {moveFigure} className = "mf-top-left" disabled ={disable215}></button>
                    <button id = "216" onClick = {moveFigure} className = "mf-top-left" disabled></button>
                    <button id="buffer" disabled></button>
                    <button id = "208" onClick = {moveFigure} className = "mf-bottom-right" disabled></button>
                    <button id = "207" onClick = {moveFigure} className = "mf-bottom-right" disabled ={disable207}></button>
                    <button id = "206" onClick = {moveFigure} className = "mf-bottom-right" disabled ={disable206}></button>
                    <button id = "205" onClick = {moveFigure} className = "mf-bottom-right" disabled ={disable205}></button>
                    <button id = "10"  onClick = {moveFigure} className = "white" disabled ={disable10}></button>
                </div>
                <div>
                    <button id = "29"  onClick = {moveFigure} className = "white" disabled ={disable29}></button>
                    <button id = "28"  onClick = {moveFigure} className = "white" disabled ={disable28}></button>
                    <button id = "27"  onClick = {moveFigure} className = "white" disabled ={disable27}></button>
                    <button id = "26"  onClick = {moveFigure} className = "white" disabled ={disable26}></button>
                    <button id = "25"  onClick = {moveFigure} className = "white" disabled ={disable25}></button>
                    <button id = "212" onClick = {moveFigure} className = "mf-bottom-left" disabled></button>
                    <button id = "15"  onClick = {moveFigure} className = "white" disabled ={disable15}></button>
                    <button id = "14"  onClick = {moveFigure} className = "white" disabled ={disable14}></button>
                    <button id = "13"  onClick = {moveFigure} className = "white" disabled ={disable13}></button>
                    <button id = "12"  onClick = {moveFigure} className = "white arrow3" disabled ={disable12}></button>
                    <button id = "11"  onClick = {moveFigure} className = "mf-bottom-right start img" disabled ={disable11}></button>
                </div>
                <div>
                    <button id = "24"  onClick = {moveFigure} className = "white" disabled ={disable24}></button>
                    <button id = "211" onClick = {moveFigure} className = "mf-bottom-left" disabled ={disable211}></button>
                    <button id = "16"  onClick = {moveFigure} className = "white" disabled ={disable16}></button>
                </div>
                <div>
                    <button id = "23"  onClick = {moveFigure} className = "white" disabled ={disable23}></button>
                    <button id = "210" onClick = {moveFigure} className = "mf-bottom-left" disabled ={disable210}></button>
                    <button id = "17"  onClick = {moveFigure} className = "white" disabled ={disable17}></button>
                </div>
                <div>
                    <button id = "22"  onClick = {moveFigure} className = "white arrow4" disabled ={disable22}></button>
                    <button id = "209" onClick = {moveFigure} className = "mf-bottom-left" disabled ={disable209}></button>
                    <button id = "18"  onClick = {moveFigure} className = "white" disabled ={disable18}></button>
                </div>
                <div>
                    <button id = "21"  onClick = {moveFigure} className = "mf-bottom-left start img" disabled ={disable21}></button>
                    <button id = "20"  onClick = {moveFigure} className = "white middle" disabled ={disable20}></button>
                    <button id = "19"  onClick = {moveFigure} className = "white" disabled ={disable19}></button>
                </div>
            </div>
    )
}

export default Matchfield;
