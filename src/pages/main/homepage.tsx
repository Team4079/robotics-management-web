/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import '../../assets/scss/homepage.scss';
import { EventData, UserData } from '../../assets/ts/interfaces';
import getUserData from '../../assets/ts/getUserData';
import Sidebar from '../../assets/components/sidebar';
import FormatCalendar from '../../assets/components/format-calendar';

const HomePage: React.FC = (): React.JSX.Element => {
    const [data, setData] = React.useState<UserData | null | undefined>();
    const [events, setEvents] = React.useState<EventData[]>([]);

    const getEvents = async (): Promise<void> => {
        try {
            const response = await fetch('/get/events', { "method": "POST", "credentials": "include" });
            
            if (response.status === 401) {
                console.log("Guest account");
                return;
            } else if (response.status === 500) {
                alert("Server error");
                return;
            } else if (response.status === 404) {
                alert("No events found");
                return;
            }

            const data = await response.json();

            if (data.error) {
                console.error(data.error);
            }

            setEvents(data.events);
        } catch (error: unknown) {
            console.error('Error:', error as string);
        }
    }

    const userData = async (): Promise<void> => {
        try {
            const userData: UserData[] | null | undefined = await getUserData();

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
                    profilePicture: '',
                    displayName: 'Guest Account',
                    hd: '',
                })
                return;
            }

            setData(userData![0]);

            getEvents();
        } catch (error: unknown) {
            console.error('Error:', error as string);
        }
    }

    React.useEffect(() => {
        try {
            userData();
        } catch (error: unknown) {
            console.error('Error:', error as string);
        }
    }, []);

    return (
        <section id="home">
            <Sidebar />
            <div id="container">
                <h1>Welcome, {data?.displayName}!</h1>

                <div id="content">
                    <div id="events">
                        <h2>Upcoming Events</h2>
                        <div id="event-list">
                            {
                                events === null || events === undefined || events.length < 1 ? <p id="default">No events found</p> :
                            events?.map((event, index) => {
                                return (
                                    <div key={index} className="event">
                                        <h3>{event?.eventName}</h3>
                                        <p>{event?.eventDescription}</p>
                                        <p>{event?.eventLocation}</p>
                                        <p>{event?.eventDate}</p>
                                        <p>{event?.eventTime}</p>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>

                    <div id="calendar">
                        <FormatCalendar />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HomePage;