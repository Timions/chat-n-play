import { useEffect } from 'react';
import { useHistory } from "react-router-dom";

function Invitation({ match }) {

    // Router Stuff
    const history = useHistory();

    useEffect(() => {
        let id = match.params.roomid;
        
        history.push({
            pathname: '/',
            state: { roomId: id }
          });

    }, [history, match]);

  return (
    <div>

    </div>
  );
}

export default Invitation;
