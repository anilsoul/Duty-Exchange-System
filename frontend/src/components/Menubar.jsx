import "../Style/Menubar.css"

import Logo from "./Logo"
import Dashboard from "../Icons/Dashboard"
import Arrow from "../Icons/Arrow"
import Calendar from "../Icons/Calendar"
import Eye from "../Icons/Eye"
import SettingIcon from "../Icons/Setting"
import Exchange from "../Icons/Exchange"
import UserIcon from "../Icons/User"

import { memo } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

const menus = [
    {
        name: "Dashboard",
        icon: <Dashboard />,
        link: "/"
    },
    {
        name: "Create DES Form",
        icon: <Exchange />,
        link: "/form",
        title: "Create DES Form"
    },
    {
        name: "View DES form",
        icon: <Eye />,
        link: "/preview",
        title: "View DES form"
    },
    {
        name: "Settings",
        icon: <SettingIcon />,
        link: "/Settings"
    },
    {
        name: "My Profile",
        icon: <UserIcon />,
        link: "/profile"
    }
]

const Menubar = ({ onMenuToggleClick = () => { } }) => {
    const route = useLocation()
    const navigate = useNavigate();
    
    // Retrieve the active logged in role
    const currentRole = localStorage.getItem('userRole') || 'Faculty';

    function toggleMenubar() {
        let activeApp = document.querySelector(".app.active");
        let app = document.querySelector(".app");
        if (activeApp) {
            activeApp.classList.remove("active");
        } else if (app) {
            app.classList.add("active");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        window.dispatchEvent(new Event('roleChange')); // Ensure listeners update
        navigate('/login');
    };

    return (
        <nav className="menubar-container">
            <Arrow arrowIconClickHandler={e => {
                toggleMenubar();
                onMenuToggleClick(e);
            }} className={"toggle-menubar-icon"} />
            <Link to="/" className="title" style={{ textDecoration: "none" }}>
                <Logo className="sidebar-logo" style={{ width: '180px', height: 'auto' }} />
            </Link>
            <ul className="menus-container">
                {menus.map((menu) => (
                    <Link to={menu.link} title={typeof menu.name == "string" ? menu.name : menu.title} className="menu-container" id={route.pathname === menu.link ? "active" : ""} key={menu.link}>
                        {menu.icon}
                        <li>{menu.name}</li>
                    </Link>
                ))}
            </ul>
            
            <div className="user-profile-section" style={{ marginTop: "auto", padding: "15px", display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid var(--border-color)" }}>
                <div style={{ color: "var(--light-color)", fontSize: "0.9rem", textAlign: "center" }}>
                    Logged in as: <strong>{currentRole}</strong>
                </div>
                <button 
                    onClick={handleLogout}
                    style={{
                        padding: "10px",
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "#ef4444",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => {
                        e.target.style.background = "rgba(239, 68, 68, 0.2)";
                    }}
                    onMouseOut={(e) => {
                        e.target.style.background = "rgba(239, 68, 68, 0.1)";
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default memo(Menubar)
