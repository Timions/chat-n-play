import { useEffect, useState } from 'react';
import $ from 'jquery';

import './GameCategoryButton.css'

function GameCategoryButton(props) {

    const [showUnderline, setShowUnderline] = useState(false);

    const [textDecorationStyle, setTextDecorationStyle] = useState({});

    useEffect(() => {

        // Underline Farbe setzen
        if(props.activeCategory.gameCategoryId === props.category.gameCategoryId) {
            setShowUnderline(true);
    
        } else {
            setShowUnderline(false);
    
        }

        $('#' + props.category.gameCategoryId + '-game-title').hover(() => {
            setShowUnderline(true);

        }, () => {

            // nur deaktiviren, wenn nicht aktiv
            if(props.activeCategory.gameCategoryId !== props.category.gameCategoryId) {
                setShowUnderline(false);
                
            } else {
                setShowUnderline(true);

            }
        })
    }, [props]);

    useEffect(() => {
        if(showUnderline) {
            setTextDecorationStyle({
                textDecorationColor: props.category.color
            });

        } else {
            setTextDecorationStyle({
                color: 'black'
            });

        }

    }, [props, showUnderline]);

    return (
        <button id={ props.category.gameCategoryId + '-game-title' }
                className='game-category-nav-item'
                style={ textDecorationStyle } 
                onClick={ () => props.onClickHandler(props.category ) }>
                        { props.category.gameCategoryName }                            
        </button>
    );
}

export default GameCategoryButton;