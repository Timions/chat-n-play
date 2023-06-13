import { useContext, useEffect, useState, useCallback } from 'react';
import $ from 'jquery';

import { IoMdClose } from 'react-icons/io';
import { IconContext } from "react-icons";

import './Chat.css'

import SocketContext from '../../../services/socket';
import ChatBubble from './ChatBubble/ChatBubble';

function Chat(props) {

  const [messages, setMessages] = useState([]);

  // Socket.io
  const socket = useContext(SocketContext);

  //Events:
  // Wenn man eine Nachricht empfangen will
  const handleMessageEvent = useCallback((data) => {
    let scroll = false;

    // Wenn Chat nicht offen, Roten Punk anzeigen, dass eine ungelesene Nachricht da ist
    if($('#sidebar-chat').css('margin-left') !== props.sideBarWidth + 'px') {
      
      // Schauen, ob der Punkt schon da ist. Dann nicht setzten
      if($('#chat-unread-btn-icon').css('visibility') === 'hidden') {

        // Roten Punkt setzten
        $('#chat-unread-btn-icon').css({ 'visibility': 'visible' });

      }
    
    // Wenn Sidebar offen, schauen ob man nach unten scrollen muss wenn eine Nachricht kommt. Nur scrollen, wenn schon gabz unten
    } else {
      let divHeight = document.getElementById('chat-text').scrollHeight;
      let visableDivHeight = document.getElementById('chat-text').offsetHeight;
      let currentHeight = $('#chat-text').scrollTop();

      // Man befinded sich ganz unten wenn eine Nachricht kommt -> nach unten scrollen
      if(divHeight === (visableDivHeight + currentHeight)) {
        scroll = true;
      }

    }

    // Eigene Nachricht
    if(data.socketId === socket.id) {
      // Nachricht anzeigen
      setMessages([...messages, <ChatBubble key={ messages.length } username="Du" text={ data.text } color={ data.color } position='right'/>])

    // Nachricht von wem anders
    } else {
      // Nachricht anzeigen
      setMessages([...messages, <ChatBubble key={ messages.length } username={ data.username } text={ data.text } color={ data.color } position='left'/>])

    }

    // Zur Nachricht scrollen
    if(scroll) {
      let divHeight = document.getElementById('chat-text').scrollHeight;
      let visableDivHeight = document.getElementById('chat-text').offsetHeight;
      
      $('#chat-text').scrollTop(divHeight - visableDivHeight);
    }

  }, [socket, messages, props.sideBarWidth]);

  useEffect(() => {
    // Wenn man einem Raum gejoint ist -> Lobby laden
    socket.on("chat:message", handleMessageEvent);

  }, [socket, handleMessageEvent]);

  // Schauen wann eine Nachricht gesendet werden soll
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }

  // Nachricht senden
  const sendMessage = () => {
    let msg = $('#chat-input').val();

    if(msg.length > 0) {

      // Textbox leeren
      $('#chat-input').val('');
      
      // Nachricht senden
      socket.emit('chat:sendMessage', { text: msg });
    }
  }

  // Events unmounten
  useEffect(() => {    
    return () => {
        socket.off('chat:message', handleMessageEvent);
    }
  }, [socket, handleMessageEvent])


  return (
    <div id='chat-wrapper'>
      <div id='sidebar-chat-heading-wrapper'>
        <h4 id='sidebar-chat-heading'>Chat</h4>
        <button className='close-rules-btn' onClick={ () => props.closeFunction('#sidebar-chat') }>
          <IconContext.Provider value={{ size: '24px', className: 'close-rules-btn-icon' }}>
            <IoMdClose />
          </IconContext.Provider>
        </button>
      </div>
      <div id='chat'>
        <div id='chat-text'>
          { messages }
        </div>
        <div id='chat-input-wrapper'>
          <input id='chat-input' type="text" placeholder="Tippe deine Nachricht..." onKeyDown={ handleKeyDown }/>
        </div>
      </div>
    </div>
  );
}

export default Chat;
