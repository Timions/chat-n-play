import UnoGameBoard from './UnoGameBoard/UnoGameBoard';

function Uno(props) {
    return (
        <div>
            <div id='game-content'>
                <UnoGameBoard isHost={ props.isHost } players={ props.players } />
            </div>
        </div>
    );
}

export default Uno;