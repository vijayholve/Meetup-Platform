// In the component with your Logout button (e.g., TopNavbar.jsx)

const handleLogout = async () => {
    // This will now correctly find the token saved during login
    const token = localStorage.getItem('accessToken'); 

    console.log("Retrieved token for logout:", token); 
    
    if (!token) {
        console.error("Logout failed: No token found in local storage.");
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/api/auth/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
        });

        if (response.ok) {
            console.log("Logout successful!");
            // Your Redux logout logic here
            // e.g., dispatch(logout());
            localStorage.removeItem('accessToken'); 
            navigate('/login');
        } else {
            console.error('Logout failed on the server:', response.status);
        }
    } catch (error) {
        console.error('An error occurred during the logout fetch request:', error);
    }
};
export default handleLogout;