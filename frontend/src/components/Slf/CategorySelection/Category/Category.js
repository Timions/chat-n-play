import './Category.css';

function Category(props) {

    return (
        <div className='selector-category'>
            <div className='input-group'>
                <input id={ 'category-selector-input-' + props.id } className='selector-category-input form-control'
                    type='text'
                    defaultValue={ props.categoryValue }
                    onChange={ (event) => props.changeValue(props.index, event) }
                    placeholder='Kategorie eingeben...'
                    autoFocus={ props.focus }/>
                <div className='input-group-append'>
                    <button className="btn btn-outline-secondary delete-category-btn" type="button" onClick={ () => props.clickDelete(props.index) }>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Category;