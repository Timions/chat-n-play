import { IoMdClose } from 'react-icons/io';
import { IconContext } from "react-icons";

import './Rules.css';

function Rules(props) {
  return (
    <div id='rules-wrapper'>
      <div id='sidebar-rules-heading-wrapper'>
        <h4 id='sidebar-rules-heading'>Regeln</h4>
        <button className='close-rules-btn' onClick={ () => props.closeFunction('#sidebar-rules') }>
          <IconContext.Provider value={{ size: '24px', className: 'close-rules-btn-icon' }}>
            <IoMdClose />
          </IconContext.Provider>
        </button>
      </div>
      <div id='sidebar-rules-content-wrapper'>
        { props.text }
      </div>
    </div>
  );
}

export default Rules;
