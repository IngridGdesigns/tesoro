import { Outlet, Link} from "react-router-dom";
import FinancialGoals from "../classes/FinancialGoals";
import Dashboard from "../pages/Dashboard";
import { useAuth0 } from "@auth0/auth0-react";


function postToDb(user, getAccessTokenSilently) {
    let name = user.name;
    let email = user.email;
    let username = user.nickname;
    let user_sub = user.sub;
    let password = '123456'

    var options = {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${getAccessTokenSilently()}`},
        body: JSON.stringify({name, email, username, password, user_sub})
    };

    fetch(`/api/users`, options) // kept getting errors with axios  -- refactor later --
        .then(response => response.json())
        .then(data => console.log(data))
}


async function Root() {
    const { isLoading, user, getAccessTokenSilently } = useAuth0();
    // console.log(user, user.profile)
  
    postToDb(user, getAccessTokenSilently); //posts user to backend
   
    // if (user.assignedRoles !== 'Admin') {
    //     console.log('not admin')
    // }

    if (isLoading) {
        return <div>Loading...</div>;
    } 

    return (
       
        <>
       
            <div id="sidebar">
                
                {/* <h2 style={{color: "#fff"}}>Hola {user.email}!</h2>
                <h4>{user.assignedRoles[0]}</h4> */}

            <h1>Tesoro</h1>
            <div>
                <form id="search-form" role="search">
                    <input
                        id="q"
                        aria-label="Search contacts"
                        placeholder="Search"
                        type="search"
                        name="q" />
                    <div
                        id="search-spinner"
                        aria-hidden
                        hidden={true} />
                    <div
                        className="sr-only"
                        aria-live="polite"
                    ></div>
                </form>
                <form method="post">
                    <button type="submit">New</button>
                </form>
            </div>
            <nav>
            <ul>
                <li>
                <Link to={`/dashboard`} element={<Dashboard/>}>Dashboard</Link>
            </li>
                <li>
                <Link to={`/dashboard/profile`} >Profile</Link>
            </li>
            <li>
                <Link to={`/dashboard/goals`} element={<FinancialGoals/>}>Goals</Link>
            </li>
            <li>
                <Link to={`/dashboard/contacts/2`}>Reports</Link>
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