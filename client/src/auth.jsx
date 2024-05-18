// import { withAuth0 } from '@auth0/auth0-react';
import auth0 from 'auth0-js';
import { LoginButton } from './components/buttons/login-button';
// import axios from 'axios';

// const authConfig = require('../auth-config.json')

export default class Auth {
  accessToken;
  idToken;
  expiresAt;
  userProfile;

  auth0 = new auth0.WebAuth({
    domain: import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN,
    clientID: import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID,
    redirectUri: import.meta.env.VITE_REACT_APP_AUTH0_CALLBACK_URL,
    audience: import.meta.env.VITE_REACT_APP_AUTH0_AUDIENCE, //audience added
    responseType: 'token id_token',
    scope: 'openid profile email read:messages user_metadata app_metadata' //scopes for users
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.postToDB = this.postToDB.bind(this);
  }

  login() {
    <LoginButton/>
  }


  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {

      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        
        this.postToDB();
      } else if (err) {
        // history.replace('/'); //history.replace('/');
        console.log(err);

        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getAccessToken() { 
    const accessToken = localStorage.getItem('access token');
    if(!accessToken) {
    return new Error('No access token found');
    } 
    return accessToken;
  }

  getIdToken() {
    return this.idToken;
 
  }

  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
    localStorage.setItem('access token', authResult.accessToken)
      // navigate to the home route
      
//    history.replace('/home');//testing with linkedin video
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.logout();
         console.log(err);
         alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
       }
    });
  }

    getProfile() {
        const { user } = this.props.auth0;
        return user;
  }
    
    
    async postToDb() {
    const user = this.getProfile();
        
    let name = user.name;
    let email = user.email;
    let username = user.nickname;
    let user_sub = user.sub;
    let password = '123456' // should use brcypt, placeholder (wont store secrets here)

    var options = {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${this.getAccessToken()}`},
        body: JSON.stringify({name, email, username, password, user_sub})
    };

    fetch(`/api/users`, options) // kept getting errors with axios  -- refactor later --
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => console.error('Logging Error', error))
    try {
        const response = await fetch(`/api/users`, options); // kept getting errors with axios  -- refactor later --
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Logging Error', error);
        return;
    }
}


//   postingToDB () { 
//     this.getProfile((err, profile) => {
//       if(err) {
//         console.log(err)
//         return 
//       }
//       const headers = { 'Authorization': `Bearer ${this.getAccessToken()}`}
//       axios({
//         method: 'POST',
//         headers,
//         url: 'http://localhost:3005/usersdata',
//         data: profile
//       })
//       .then(res => {
//         console.log(`the res is ${res}`)
//       })
//       .catch(err => {
//         console.log('post error', err);
//       });
//     }) 
//   }

  logout() {
    this.accessToken = null; // Remove tokens and expiry time
    this.idToken = null;
    this.expiresAt = 0;
    this.userProfile = null;   // Remove user profile
    console.log('Logged Out')

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem( 'access token');

    this.auth0.logout({
      returnTo: window.location.origin
    });

    // navigate to the home route 
    history.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the// access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }
}

