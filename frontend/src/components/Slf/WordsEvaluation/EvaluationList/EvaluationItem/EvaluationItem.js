import { useLayoutEffect } from 'react';
import $ from 'jquery';

import './EvaluationItem.css'; 

function EvaluationItem(props) {

    // Höhe der Item setzten
    useLayoutEffect(() => {
        $('.slf-evaluation-item').height(props.content.answers.length * 27 + 86 + 'px');

    }, [props]);

    return (
        <div className='slf-evaluation-item'>
            <p className='slf-evaluation-item-category slf-evaluation-wrapper'>{ props.content.category }</p>
            <div className='slf-evaluation-usernames-wrapper slf-evaluation-wrapper'>
                <p className='slf-evaluation-username'>{ 'Du:' }</p>
                {
                    props.content.answers.map(entry => (
                        <p key={ entry.socketId } className='slf-evaluation-username'>{ entry.username + ':' }</p>
                    ))
                }
            </div>
            <div className='slf-evaluation-words-wrapper slf-evaluation-wrapper'>
                {
                    props.ownAnswer.word === '' ? (
                        <p className='slf-evaluation-words noAnswer'>-</p>
                    ) : (
                        <p className='slf-evaluation-words'>{ props.ownAnswer.word }</p>
                    )
                }
                {
                    props.content.answers.map(entry => (
                        entry.word === '' ? (
                            <p key={ entry.socketId } className='slf-evaluation-words noAnswer'>-</p>
                        ) : (
                            <p key={ entry.socketId } className='slf-evaluation-words'>{ entry.word } </p>
                        )
                    ))
                }
            </div>
            <div className='slf-evaluation-input-wrapper slf-evaluation-wrapper'>
                <div className='slf-evaluation-own-input'></div>
                {
                    props.content.answers.map((entry) => (
                            entry.word.length > 0 ? (
                                <input key={ entry.socketId } id={ 'slf-evaulation-input-' +  entry.socketId + '-' +  props.index } type='checkbox'  className='slf-evaluation-input' defaultChecked
                                    onClick={ () => props.setRatingHandler(props.index, entry.socketId, 'slf-evaulation-input-' +  entry.socketId + '-' +  props.index) } />
                            ):(
                                <input key={ entry.socketId } id={ 'slf-evaulation-input-' +  entry.socketId + '-' +  props.index } type='checkbox'  className='slf-evaluation-input-disabled' disabled 
                                    onClick={ () => props.setRatingHandler(props.index, entry.socketId, 'slf-evaulation-input-' +  entry.socketId + '-' +  props.index) }/>
                            )
                    ))
                }
            </div>
        </div>
    );
}

export default EvaluationItem;