
import { useAuth0 } from '@auth0/auth0-react';


const Reports = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    if (!user) {
        return null;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    } 

    return (
        isAuthenticated && (
            <div>
                <h1>Here are your reports</h1>
                <h2>{user.name} | {user.assignedRoles[0]}</h2>
                
                
            </div>
        )
    )
}

export default Reports;

