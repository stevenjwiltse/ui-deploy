import React from 'react';
import { useKeycloak } from './hooks/useKeycloak';
import { Navigate } from 'react-router';

interface PrivateRouteProps{
    roles: string[];
    children: React.ReactNode;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles, children }) => {
    const { keycloak, authenticated } = useKeycloak();
    if (!keycloak) {
        // Keycloak is not initialized yet, return null or a loading spinner
        return <div>Loading...</div>;
    }

    if (!authenticated) {
        // Redirect to the login page if not authenticated
        keycloak.login({
            redirectUri: window.location.href,
        });
        return null; // Prevent rendering while redirecting
    }

    // Render the children if authorized
    return <>{children}</>;
}

export default PrivateRoute;