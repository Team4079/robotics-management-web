import React from "react";
import '../scss/sidebar.scss';
import getUserData from '../ts/getUserData';
import { UserData } from "../ts/interfaces";

const Sidebar: React.FC = (): React.JSX.Element => {
    const [data, setData] = React.useState<UserData>();

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const userData: UserData[] | undefined | null = await getUserData();

                if (userData === null) {
                    window.location.href = '/login';
                    return;
                }

                if (userData === undefined) {
                    console.error('Guest account');
                    setData({
                        firstName: 'Guest',
                        lastName: 'Account',
                        email: '',
                        profilePicture: 'https://www.kravemarketingllc.com/wp-content/uploads/2018/09/placeholder-user-500x500.png',
                        displayName: 'Guest Account',
                        hd: '',
                    })
                    return;
                }

                setData(userData[0]);
            } catch (error: unknown) {
                console.error('Error:', error as string);
            }
        }

        fetchData();
    }, []);

    const account = async (): Promise<void> => {
        if (await getUserData() === null) {
            window.location.href = '/login';
            return;
        } else if (await getUserData() === undefined) {
            alert('Guest accounts cannot access this page. Please login.');
            return;
        }

        window.location.href = '/account';
    }

    return (
        <div id="sidebar">
            <div id="profile">
                <img src={data?.profilePicture ? data?.profilePicture : "https://via.placeholder.com/150"} alt="Profile Picture" />
                <h2>Logged in as <br /> {data?.firstName}</h2>
                <button onClick={() => account()}>Account</button>
            </div>
            <div id="pages">
                <span className="pageSelector">
                    <a href="/">
                        <h1>Home</h1>
                    </a>
                </span>

                <span className="pageSelector">
                    <a href="/calendar">
                        <h1>Calendar</h1>
                    </a>
                </span>

                <span className="pageSelector">
                    <a href="/events">
                        <h1>Events</h1>
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