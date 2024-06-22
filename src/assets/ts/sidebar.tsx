import React from "react";
import '../scss/sidebar.scss';
import getUserData from "./getUserData";

const Sidebar: React.FC = (): React.JSX.Element => {
    const [data, setData] = React.useState<object>({});

    React.useEffect(() => {
        getUserData().then((result: object) => {
            setData(result);
        });
    });
    return (
        <div id="sidebar">
        <div id="profile">
            <img src="https://via.placeholder.com/150" alt="Profile" />
            {/*<h2>{data}</h2>*/}
            <button>Account Settings</button>
        </div>
        <div id="pages">
            <span className="pageSelector">
                <a href="/">Home</a>
            </span>

            <span className="pageSelector">
                <a href="/about">Chat</a>
            </span>

            <span className="pageSelector">
                <a href="/slack">Slack</a>
            </span>
        </div>
    </div>
    )
}

export default Sidebar;