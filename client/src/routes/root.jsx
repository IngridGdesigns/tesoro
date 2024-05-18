import { Outlet, Link} from "react-router-dom";
// import FinancialGoals from "../classes/FinancialGoals";
// import Dashboard from "../pages/Dashboard";
import { useAuth0 } from '@auth0/auth0-react'


// function postToDb(user, getAccessTokenSilently) {
//     let name = user.name;
//     let email = user.email;
//     let username = user.nickname;
//     let user_sub = user.sub;
//     let password = '123456' // should use brcypt, placeholder (wont store secrets here)

//     var options = {
//         method: 'POST',
//         headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${getAccessTokenSilently()}`},
//         body: JSON.stringify({name, email, username, password, user_sub})
//     };

//     fetch(`/api/users`, options) // kept getting errors with axios  -- refactor later --
//         .then(response => response.json())
//         .then(data => console.log(data))
//         .catch((error) => console.error('Logging Error', error))
//     try {
//         const response = await fetch(`/api/users`, options); // kept getting errors with axios  -- refactor later --
//         const data = await response.json();
//         console.log(data);
//     } catch (error) {
//         console.error('Logging Error', error);
//         return;
//     }
// }


function Root() {
    const { isLoading, user } = useAuth0(); // user, getAccessTokenSilently
    // console.log(user, user.profile)
    if (!user) {
        return null;
    }
    
    // postToDb(user, getAccessTokenSilently)
   
    // if (user.assignedRoles !== 'Admin') {
    //     console.log('not admin')
    // }

    if (isLoading) {
        return <div>Loading...</div>;
    } 

    return (
       
        <>
       
            <div id="sidebar">
                
                <h2 style={{color: "#fff"}}>Hola {user.name}!</h2>
                <h4>{user.assignedRoles[0]}</h4>

            <h1>Tesoro</h1>
          
            <nav>
            <ul>
             
             <li>
                <Link to={`/dashboard/budget`}>Budget</Link>
            </li>
        
            <li>
                <Link to={`/dashboard/goals`} >Goals</Link>
            </li>
            <li>
                <Link to={`/dashboard/profile`} >Profile</Link>
            </li>
            <li>
                <Link to={`/dashboard/reports`}>Reports</Link>
            </li>
        </ul>
            </nav>
        </div>
        <div id="detail">
            <Outlet /> 
        {/* outlet helps us render our children in side root */}
            </div>
         
            </>
  );
}

export default Root;