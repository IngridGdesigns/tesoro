import React from "react";
import { LoginButton } from "./buttons/login-button";
import { useAuth0 } from "@auth0/auth0-react";


const Hero = () => {
    const { isAuthenticated } = useAuth0();

    return (
        <div>
            {/* <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" /> */}
            <div>
                <div>
                    <h1>Tesoro</h1>
                    <p>
                        Welcome to our Tesoro, please sign in or Register!
                    </p>
         
                    <LoginButton />
                    {isAuthenticated && ( // Render the "Home" link if authenticated
                        <div>
                            <h1>You are logged in now!</h1>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
export default Hero;