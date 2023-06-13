import './ChatBubble.css'

function ChatBubble(props) {
    if(props.position === 'right') {
        return (
            <div className='chat-bubble right'>
                <div className='chat-bubble-text-wrapper' style={{ backgroundColor: props.color ? props.color : 'rgb(122, 123, 123)' }}>
                    <p className='chat-bubble-text'>{ props.text }</p>
                </div>
                <div className='chat-bubble-username username-right'>
                    { props.username }
                </div>
            </div>
        );

    } else {
        return (
            <div className='chat-bubble left'>
                <div className='chat-bubble-text-wrapper' style={{ backgroundColor: props.color ? props.color : 'rgb(122, 123, 123)' }}>
                    <p className='chat-bubble-text'>{ props.text }</p>
                </div>
                <div className='chat-bubble-username username-left'>
                    { props.username }
                </div>
            </div>
        );
    }
}

export default ChatBubble;
