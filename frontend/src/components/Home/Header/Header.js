import './Header.css';
import logo from '../../../img/Logo.png'
import title from '../../../img/Titel_Weiß.png'

function Header(props) {
    return (
        <div style={{ height: props.height }} id='titleWrapper' className='sticky-top d-flex align-items-center justify-content-center'>
            <img src={logo} alt="Logo" id="logo"></img>
            <img src={title} id="title-grafik" alt="Chat N Play"></img>
        </div>
    );
}

export default Header;