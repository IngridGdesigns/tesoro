// import React from 'react';

// async function postToDb(user, getAccessTokenSilently) {
//     let name = user.name;
//     let email = user.email;
//     let username = user.nickname;
//     let user_sub = user.sub;
//     let password = '123456'

//     var options = {
//         method: 'POST',
//         headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${getAccessTokenSilently()}`},
//         body: JSON.stringify({name, email, username, password, user_sub})
//     };

//     // fetch(`/api/users`, options) // kept getting errors with axios  -- refactor later --
//     //     .then(response => response.json())
//     //     .then(data => console.log(data))
//     //     .catch((error) => console.error('Logging Error', error))
//     try {
//         const response = await fetch(`/api/users`, options); // kept getting errors with axios  -- refactor later --
//         const data = await response.json();
//         console.log(data);
//     } catch (error) {
//         console.error('Logging Error', error);
//         return;
//     }
// }


const Dashboard = () => {
    return(
  <div>
        <h1>You are on dashboard opening page now</h1>
        <p>Hello </p>
  </div>
)};

export default Dashboard;