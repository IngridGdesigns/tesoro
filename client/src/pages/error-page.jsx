import { useRouteError, Link, Outlet } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page">
            <h1>Uh noes!!</h1>
            <p>Sorry, an error ocurred</p>
            <span role="img" aria-label="weary cat" className="emoji">🙀</span>
            <p>Page: <i>{error.statusText || error.message}</i></p>
            <Link to={`/`}>Return Home</Link>
            <Outlet/>
        </div>
    )
}