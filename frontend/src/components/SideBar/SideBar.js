import React, { useEffect, useContext, useLayoutEffect } from 'react';
import { useHistory } from "react-router-dom";
import $ from 'jquery';

import { BsFillChatDotsFill, BsFillMicFill, BsFillMicMuteFill, BsBoxArrowLeft, BsDot } from 'react-icons/bs';
import { ImBook } from 'react-icons/im';
import { IconContext } from "react-icons";
import { RiCameraFill, RiCameraOffFill} from "react-icons/ri";

import './SideBar.css';

import Chat from './Chat/Chat';
import Rules from './Rules/Rules';
import SocketContext from '../../services/socket';


function SideBar(props) {

  // Router Stuff
  const history = useHistory();

  // Socket.io
  const socket = useContext(SocketContext);

  function toggleSideBar(sidebarId) {
    // Wenn die Sidebar links plaziert ist
    if(props.position === 'left') {

      // Sidebar öffnen
      if($(sidebarId).css('marginLeft') === (props.sideBarWidth - props.sideBarWindowWidth) + 'px') {
        $('.sidebar-window').not(sidebarId).animate({ 'left': '0', 'margin-left': (props.sideBarWidth - props.sideBarWindowWidth) + 'px' }, { duration: 200, queue: false });
        $(sidebarId).animate({ 'left': '0', 'margin-left': (props.sideBarWidth) + 'px' });

        // content zur Seite pushen
        $(props.contentId).animate({ 'margin-left': props.sideBarWindowWidth + 'px' }, { duration: 200, queue: false, step: () => window.dispatchEvent(new Event('resize')) });

        // Roten Punkt unsichtbar machen, falls eine nachricht kam
        $('#chat-unread-btn-icon').css({ 'visibility': 'hidden' });

      // Sidebar schließen
      } else {
        $(sidebarId).animate({ 'left': '0', 'margin-left': (props.sideBarWidth - props.sideBarWindowWidth) + 'px' }, { duration: 200, queue: false });

        // conent wieder richtig stellen
        $(props.contentId).animate({ 'margin-left': '0px' }, { duration: 200, queue: false, step: () => window.dispatchEvent(new Event('resize')) });

      }

    // Wenn die Sidebar rechts plaziert ist
    } else {
      // Sidebar öffnen
      if($(sidebarId).css('marginRight') === (props.sideBarWidth - props.sideBarWindowWidth) + 'px') {
        $('.sidebar-window').not(sidebarId).animate({ 'right': '0', 'margin-right': (props.sideBarWidth - props.sideBarWindowWidth) + 'px' }, { duration: 200, queue: false });
        $(sidebarId).animate({ 'right': '0', 'margin-right': (props.sideBarWidth) + 'px' });

        // content zur Seite pushen
        $(props.contentId).animate({ 'margin-right': props.sideBarWindowWidth + 'px' }, { duration: 200, queue: false, step: () => window.dispatchEvent(new Event('resize')) });

        // Roten Punkt unsichtbar machen, falls eine nachricht kam
        $('#chat-unread-btn-icon').css({ 'visibility': 'hidden' });

      // Sidebar schließen
      } else {
        $(sidebarId).animate({ 'right': '0', 'margin-right': (props.sideBarWidth - props.sideBarWindowWidth) + 'px' }, { duration: 200, queue: false });
        
        // conent wieder richtig stellen
        $(props.contentId).animate({ 'margin-right': '0px' }, { duration: 200, queue: false, step: () => window.dispatchEvent(new Event('resize')) });
      }
    }

    // Chat Input fokusen, wenn Chat aufgemacht wird
    if(sidebarId === '#sidebar-chat') {
      $('#chat-input').focus();
    }
  }


  useEffect(() => {
    // SideBar Fenster nach Links oder Rechts setzten
    if(props.position === 'left') {
      $('.sidebar-window').css({ 'left': '0', 'margin-left': (props.sideBarWidth - props.sideBarWindowWidth) + 'px' });
      
    } else {
      $('.sidebar-window').css({ 'right': '0', 'margin-right': (props.sideBarWidth - props.sideBarWindowWidth) + 'px' });
  
    }

    // Höhe der SideBars auf richtige Höhe setzten
    $('.sidebar-window').height($('#sidebar-wrapper').height());

    // Sidebar width setzten
    $('.sidebar-window').css('width', props.sideBarWindowWidth + 'px');

  }, [props.position, props.sideBarWidth, props.sideBarWindowWidth]);

  // Raum verlassen
  const leaveRoom = () => {

    // Modal wieder schließen
    $('#leaveModal').modal('hide');
    
    // Serverseitig event auslösen um zu löschen und 'aufzuräumen'
    socket.emit('room:leave-room');

    // Zur Startseite weiterleiten
    //history.push('/');
    history.go();

  }

  //Bereich Sidebar Button Handling
  const startWebcam = () =>{
    socket.emit("webcam:start");
  }

  const muteMic = () => {
    $('.sidebar-btn-tooltip').tooltip('dispose')

    socket.emit("webcam:unmuteMic");

    $("#unmuteMic").removeClass("d-none");
    $("#unmuteMic").addClass("sidebar-btn-tooltip");

    $("#muteMic").addClass("d-none");
    $("#muteMic").removeClass("sidebar-btn-tooltip");

    $('.sidebar-btn-tooltip').tooltip({
      delay: { show: 1000, hide: 300 }
  }); 
  }

  const unmuteMic = () => {
    $('.sidebar-btn-tooltip').tooltip('dispose')
    
    socket.emit("webcam:muteMic");

    $("#muteMic").removeClass("d-none");
    $("#muteMic").addClass("sidebar-btn-tooltip");

    $("#unmuteMic").addClass("d-none");
    $("#unmuteMic").removeClass("sidebar-btn-tooltip");
  }

  // Wenn die Fenster größe verändert wird, muss auch die Sidebar größe angepasst werden, da position: fixed
  useEffect(() => {
    function handleResize() {
      $('.sidebar-window').height($('#sidebar-wrapper').height());
    }
    
    window.addEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    let buttonEn = document.querySelector('#enableWebcam');
    let buttonDis = document.querySelector('#disableWebcam');

    const disableWebcam = () => {
      $('.sidebar-btn-tooltip').tooltip('dispose')
  
      socket.emit("webcam:disable");
  
      $("#enableWebcam").removeClass("d-none");
      $("#enableWebcam").addClass("sidebar-btn-tooltip");
  
      $("#disableWebcam").addClass("d-none");
      $("#disableWebcam").removeClass("sidebar-btn-tooltip");
  
      $('.sidebar-btn-tooltip').tooltip({
        delay: { show: 1000, hide: 300 }
      }); 
    }
  
    const enableWebcam = () => {
      $('.sidebar-btn-tooltip').tooltip('dispose')
  
      socket.emit("webcam:enable");
  
      $("#enableWebcam").addClass("d-none");
      $("#enableWebcam").removeClass("sidebar-btn-tooltip");
  
      $("#disableWebcam").removeClass("d-none");
      $("#disableWebcam").addClass("sidebar-btn-tooltip");
  
      $('.sidebar-btn-tooltip').tooltip({
        delay: { show: 1000, hide: 300 }
      }); 
    }

    // Wenn die Kamera nicht erlaubt ist => button deaktivieren
    if(!props.allowCamera) {
      buttonEn.disabled = true;
      buttonDis.disabled = true;

    } else {
      buttonEn.addEventListener("click", enableWebcam)
      buttonDis.addEventListener("click", disableWebcam)
    }

    return () => {
      buttonEn.removeEventListener("click", enableWebcam)
      buttonDis.removeEventListener("click", disableWebcam)
    }

  }, [socket, props.allowCamera]);

  // Bootstrap Tooltips anzeigen
  $(document).ready(function() {
    $('.sidebar-btn-tooltip').tooltip({
        delay: { show: 1000, hide: 300 }
    });   
  });

  //UnmuteMic Mikrofon symbol
  //MuteMic Mikrofon durchgestrichen Symbol

  return (
    <div className='sidebar' style={{ width: props.sideBarWidth + 'px'}}>
      <div className='sidebar-bar-wrapper' style={{ width: props.sideBarWidth + 'px'}} >
        <button id= "enableWebcam" title='Kamera aktivieren' data-toggle="tooltip" data-placement="right" className="sidebar-btn sidebar-btn-tooltip">
          <RiCameraOffFill size={ 28 } />
        </button>
        <button id = "disableWebcam" title='Kamera deaktivieren' data-toggle="tooltip" data-placement="right" className="sidebar-btn d-none">
          <RiCameraFill size={28}/>
        </button>
        <button id = "unmuteMic" title='Mikrofon deaktivieren' data-toggle="tooltip" data-placement="right" className="sidebar-btn sidebar-btn-tooltip bi bi-camera-video" onClick={ unmuteMic }>
          <BsFillMicFill size={ 28 } />
        </button>
        <button id = "muteMic" title='Mikrofon aktivieren' data-toggle="tooltip" data-placement="right" className="sidebar-btn d-none" onClick={ muteMic }>
          <BsFillMicMuteFill size={ 28 } />
        </button>
        <button title='Chat' data-toggle="tooltip" data-placement="right" className="sidebar-btn sidebar-btn-tooltip" onClick={ () => toggleSideBar("#sidebar-chat") }>
          <span style={{ display: 'inline-block', position: 'relative' }}>
            <BsFillChatDotsFill textAnchor="middle" alignmentBaseline="middle" size={ 28 } />
            <IconContext.Provider value={{ size: '50px', color: 'red' }}>
              <BsDot
                id='chat-unread-btn-icon'
                textAnchor="middle"
                alignmentBaseline="middle"
                style={{ fontSize: '.5em', position: 'absolute', left: '0em', bottom: '0em' }} />
            </IconContext.Provider>
          </span>
        </button>
        <button title='Regeln' data-toggle="tooltip" data-placement="right" className="sidebar-btn sidebar-btn-tooltip" onClick={ () => toggleSideBar("#sidebar-rules") }>
          <ImBook size={ 28 } />
        </button>
        <span className='sidebar-btn-tooltip' title='Verlassen' data-toggle="tooltip" data-placement="right">
          <button id='leave-room-btn' className="sidebar-btn" data-toggle="modal" data-target="#leaveModal">
            <BsBoxArrowLeft size={ 28} />
          </button>
        </span>
        <button id= "startWebcam" className="sidebar-btn sidebar-btn-tooltip" onClick={ startWebcam }>
        </button>
      </div>
      <div id="sidebar-chat" className='sidebar-window'>
        <Chat closeFunction={ toggleSideBar } sideBarWidth={ props.sideBarWidth }/>
      </div>
      <div id="sidebar-rules" className='sidebar-window'>
        <Rules closeFunction={ toggleSideBar } text={ props.rules }/>
      </div>

      <div className="modal fade" id="leaveModal" data-backdrop="true">
        <div className="modal-dialog  modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-body"> 
                  <p id='leave-modal-text'>Willst du den Raum wirklich verlassen?</p>
                  <div id='leave-modal-btns'>
                    <button type="button" className="leave-modal-btn btn btn-dark" data-dismiss="modal">Nein</button>
                    <button type="button" className="leave-modal-btn btn btn-secondary" onClick={ leaveRoom }>Ja</button>
                  </div>
                </div>
            </div>
        </div>
      </div>


    </div>
  );
}

export default SideBar;
