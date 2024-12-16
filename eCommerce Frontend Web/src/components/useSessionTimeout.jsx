import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useSessionTimeout = (setCurrentUser) => {
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserDetails = JSON.parse(localStorage.getItem('currentUser'));
        const sessionStart = localStorage.getItem('sessionStart');

        if (!storedUserDetails) {
            alert('You must be logged in to view this page.');
            navigate('/');
            return;
        }

        if (sessionStart) {
            const sessionDuration = 30 * 60 * 1000; // 30 minutes
            const sessionStartTime = parseInt(sessionStart, 10);

            const updateTimer = () => {
                const currentTime = new Date().getTime();
                const elapsedTime = currentTime - sessionStartTime;
                const timeRemaining = sessionDuration - elapsedTime;

                if (timeRemaining <= 0) {
                    // Time has expired, log the user out
                    handleTimeOut(setCurrentUser, navigate);
                }
            };

            const timerInterval = setInterval(updateTimer, 1000);

            return () => clearInterval(timerInterval); // Cleanup on component unmount
        }
    }, [navigate, setCurrentUser]);

    const handleTimeOut = (setCurrentUser, navigate) => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserEmail');
        localStorage.removeItem('sessionStart');
        setCurrentUser(null);
        alert("Your session has expired. You are being logged out!");
        navigate('/cart');
        setTimeout(() => {
            navigate('/');
            window.location.reload();
        }, 50);
    };
};

export default useSessionTimeout;