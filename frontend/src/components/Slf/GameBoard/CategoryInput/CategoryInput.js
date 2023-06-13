import './CategoryInput.css';

function CategoryInput(props) {
    return (
        <div className='slf-category-input-wrapper' style={{ flex: '0 0 ' + props.flexBasis + '%', alignItems: props.alignSelf === undefined ? 'center' : props.alignSelf === 0 ? 'flex-end' : 'flex-start' }}>
            <div className='slf-category-input'>
                <label className='slf-category-lable' htmlFor={ 'category-input-' + props.category } >{ props.category }</label>
                <input type='text'
                    placeholder=''
                    name={ 'category-' + props.category }
                    id={ 'category-input-' + props.category }
                    className='slf-category-input-guess'
                    maxLength={ 128 } 
                    onChange={ (event) => props.onChangeHandler(event, props.id) }
                    disabled={ props.disabled }/>
            </div>
        </div>
    );
}

export default CategoryInput;