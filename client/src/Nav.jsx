import logo from './assets/logo.svg';
import './Nav.css';

const Nav = ({ movie }) => {
    return (
        <nav>
            <div className="content">
                <div className="logo">
                    <img src={logo} alt="logo" />
                </div>
            </div>
        </nav>
    )
}

export default Nav;