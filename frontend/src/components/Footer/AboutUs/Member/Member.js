function Member (props){

    return(
        <div id='member'>
            <p id="member-name">{props.name}</p>
            <p>{props.role}</p>
            <img src={props.scr} alt=""></img>
        </div>
    )
}

export default Member;