import { withAuthenticationRequired } from "@auth0/auth0-react";
import { PageLoader } from "./page-loader";

// eslint-disable-next-line react/prop-types
export const AuthenticationGuard = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="page-layout">
        <PageLoader />
      </div>
    ),
  });

  return <Component />;
};