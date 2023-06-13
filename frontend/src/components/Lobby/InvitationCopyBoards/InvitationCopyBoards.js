import $ from 'jquery';

import { MdContentCopy } from 'react-icons/md';
import { IconContext } from "react-icons";

import './InvitationCopyBoards.css'

function InvitationCopyBoards(props) {

    const copyToClipboard = (elementId, tooltipId) => {
        /* Get the text field */
        const copyText = document.getElementById(elementId);

        /* Select the text field */
        copyText.select(); 

        /* For mobile devices */
        copyText.setSelectionRange(0, 99999);

        /* Copy the text inside the text field */
        document.execCommand("copy");

        // Text wieder deselektieren
        setTimeout(function(){
            if (window.getSelection) { // All browsers, except IE <=8
                window.getSelection().removeAllRanges();

            } else if (document.selection) { // IE <=8
                document.selection.empty();

            }
        }, 500);

        // Tooltip anzeigen
        $('#' + tooltipId).tooltip('show')

        // Tooltip nicht mehr anzeigen
        setTimeout(function(){
            $('#' + tooltipId).tooltip( 'hide' );

        }, 500); 
    }

    // Tooltip nicht bei Hover anzeigen
    $(document).ready(function() {
        $('.invitation-button').tooltip({
            trigger: 'manual',
            position: 'center right+25'
        });   
    });

    // Wenn die Fenstergröße geändert wird
    // Am Anfang richtige breite setzten
    $('.invitation-button').width($('.invitation-button').height());
    window.addEventListener('resize', () => {
        $('.invitation-button').width($('.invitation-button').height());
    });

    return (
        <div className='invitation-copy-clipboards'>
            <div className='invitation-wrapper'>
                <p className='invitation-text'>Link</p>
                <input id='invitation-input-link' type='text' className='invitation-input' value={ (window.location.href).replace('lobby', 'invitation').replace('/game', '') || '' } readOnly />
                <button id='copy-link-tooltip' title='Kopiert' className='invitation-button btn-dark' data-toggle="tooltip" data-placement="right" onClick={ () => copyToClipboard('invitation-input-link', 'copy-link-tooltip') }>
                    <IconContext.Provider value={{ size: '24px', color: 'white' }}>
                        <MdContentCopy />
                    </IconContext.Provider>
                </button>
            </div>
            <div className='invitation-wrapper'>
                <p className='invitation-text'>Code</p>
                <input id='invitation-input-code' type='text' className='invitation-input' value={ props.roomId || '' } readOnly />
                <button id='copy-code-tooltip' title='Kopiert' className='invitation-button btn-dark' data-toggle="tooltip" data-placement="right" onClick={ () => copyToClipboard('invitation-input-code', 'copy-code-tooltip') }>
                    <IconContext.Provider value={{ size: '24px', color: 'white' }}>
                        <MdContentCopy />
                    </IconContext.Provider>
                </button>
            </div>
        </div>
    );
}

export default InvitationCopyBoards;
