import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useState } from 'react';

function Login() {
    const [user, setUser] = useState(null);

    const login = useGoogleLogin({
        onSuccess: credentialResponse => {
            // Get user info using the access token
            fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    "Authorization": `Bearer ${credentialResponse.access_token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                setUser(data);
                console.log(data);
            });
        },
        onError: () => {
            console.log('Login Failed');
        }
    });

    const handleLogout = () => {
        googleLogout();
        setUser(null);
    };

    return (
        <div className="login-container">
            {!user ? (
                <button 
                    onClick={() => login()}
                    className="google-btn"
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '24px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#444',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                    }}
                >
                    <img 
                        src="data:image/png;base64,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"
                        alt="Google logo"
                        style={{ width: '24px', height: '24px' }}
                    />
                    Sign in with Google
                </button>
            ) : (
                <div className="user-profile">
                    <div 
                        className="user-info"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '24px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        <img 
                            src={user.picture}
                            alt="User profile"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '20%',
                                objectFit: 'cover'
                            }}
                        />
                        <span style={{ 
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#333'
                        }}>
                            {user.name}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            marginTop: '10px',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '20px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#d32f2f';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#f44336';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default Login;