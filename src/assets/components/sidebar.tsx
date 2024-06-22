import React from "react";
import '../scss/sidebar.scss';
import getUserData from "../ts/getUserData";
import UserData from "../ts/interfaces";

const Sidebar: React.FC = (): React.JSX.Element => {
    const [data, setData] = React.useState<UserData | null | undefined>();

    React.useEffect(() => {
        getUserData().then((result: UserData | null | undefined) => {
            setData(result);
        });
    });

    return (
        <div id="sidebar">
            <div id="profile">
                <img src="https://via.placeholder.com/150" alt="Profile" />
                <h2>Logged in as <br/>Erick Tran</h2>
                <button>Account</button>
            </div>
            <div id="pages">
                <span className="pageSelector">
                    <a href="/">
                        <h1>Home</h1>
                    </a>
                </span>

                <span className="pageSelector">
                    <a href="/about">
                        <h1>Chat</h1>
                    </a>
                </span>

                <span className="pageSelector">
                    <a href="/slack">
                        <h1>Slack</h1>
                    </a>
                </span>

                <span className="pageSelector">
                    <a href='/logout'>
                        <h1>Logout</h1>
                    </a>
                </span>
            </div>
        </div>
    )
}

export default Sidebar;