import { NavLink } from 'react-router-dom';
import './Menu.css';

function Menu() {
    return (
        <nav className="MenuLinks-Container">
            <ul
                style={{
                    listStyle: 'none',
                    margin: 'auto',
                    padding: '0',
                }}
            >
                <li
                    style={{
                        margin: '10px',
                        display: 'inline-block',
                    }}
                >
                    <NavLink to="/jobs">Job Trends</NavLink>
                </li>
                <li
                    style={{
                        margin: '10px',
                        display: 'inline-block',
                    }}
                >
                    <NavLink to="/skills">Product Mentions</NavLink>
                </li>
                <li
                    style={{
                        margin: '10px',
                        display: 'inline-block',
                    }}
                >
                    <NavLink to="/saas">SaaS Subscriptions</NavLink>
                </li>
                <li
                    style={{
                        margin: '10px',
                        display: 'inline-block',
                    }}
                >
                    <NavLink to="/docs">Docs</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Menu;
