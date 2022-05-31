import { NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo-white.png';
import Menu from '../../components/Menu/Menu'
import './Docs.css';

function Docs() {
    return (
        <div className="h-100">
            <div className="row header-nav">
                <div className="col-lg-12 nav-wrapper">
                    <div className="nav-left">
                        <div className="logo">
                            <NavLink to="/home">
                                <img src={logo} />
                            </NavLink>
                        </div>
                        <Menu />
                    </div>
                </div>
            </div>
            <div className="container docs-content">
                <h1 style={{textAlign: 'center'}}>No document!</h1>
            </div>
        </div>
    );
}

export default Docs;