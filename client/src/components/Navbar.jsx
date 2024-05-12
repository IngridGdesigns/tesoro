
import { LogoutButton } from './buttons/logout-button';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <nav>
      <ul >
        {isAuthenticated && ( // Render the "Home" link if authenticated
          <li >
            <a>
              Home
            </a>
          </li>
        )}
      </ul>
      {isAuthenticated && <LogoutButton />}
    </nav>
  );
}

export default Navbar;
