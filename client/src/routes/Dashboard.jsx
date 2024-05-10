import { Outlet, Link, useLoaderData } from "react-router-dom";
import { fetchData } from "../helpers.js/helpers";

export function dashboardLoader() {
    const username = fetchData("username");
    return { username }
}

export default function Dashboard() {
    const { username } = useLoaderData();
    return (
        <>
            <div id="sidebar">
                <h2>Hello {username}!</h2>
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
                        <Link to={`/dashboard/profile`}>Profile</Link>
                    </li>
                    <li>
                        <Link to={`/dashboard/goals`}>Goals</Link>
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