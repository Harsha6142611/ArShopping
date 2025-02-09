import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        googleLogout();
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="dashboard">
            {user && (
                <div className="user-profile-dashboard">
                    <img 
                        src={user.picture}
                        alt="User profile"
                        className="user-avatar"
                    />
                    <span className="user-name">{user.name}</span>
                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        Logout
                    </button>
                </div>
            )}
            
            <video autoPlay loop muted className="background-video">
                <source src="./video2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            
            <div className="button-container">
                <button 
                    className="enter-shop-btn"
                    onClick={() => navigate('/shop')}
                    role="button"
                >
                    Enter into Shop
                </button>
            </div>
        </div>
    );
}

export default Dashboard; 