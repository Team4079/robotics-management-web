/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import '../../assets/scss/events.scss';
import Sidebar from '../../assets/components/sidebar';
import { EventData } from '../../assets/ts/interfaces';

const EventsPage: React.FC = (): React.JSX.Element => {
    const eventNameRef = React.useRef<HTMLInputElement>(null);
    const eventDateRef = React.useRef<HTMLInputElement>(null);
    const eventTimeRef = React.useRef<HTMLInputElement>(null);
    const eventLocationRef = React.useRef<HTMLInputElement>(null);
    const eventDescriptionRef = React.useRef<HTMLInputElement>(null);
    const eventSubmitRef = React.useRef<HTMLButtonElement>(null);

    const [events, setEvents] = React.useState<EventData[]>([]);

    const sendEvents = async (): Promise<void> => {
        try {
            eventSubmitRef.current!.disabled = true;

            if (!eventNameRef.current!.value || !eventDateRef.current!.value || !eventTimeRef.current!.value) {
                alert("Please fill out all fields");
                return;
            }

            if (!eventDescriptionRef.current!.value) {
                eventDescriptionRef.current!.value = "No description";
            }

            if (!eventLocationRef.current!.value) {
                eventLocationRef.current!.value = "No location";
            }

            const dataJson = {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    "eventValues": {
                        "eventName": eventNameRef.current!.value,
                        "eventDate": eventDateRef.current!.value,
                        "eventTime": eventTimeRef.current!.value,
                        "eventLocation": eventLocationRef.current!.value,
                        "eventDescription": eventDescriptionRef.current!.value
                    }
                })
            }

            const response = await fetch('/post/events', { ...dataJson, "credentials": "include" });

            if (response.status === 401) {
                alert("You must be logged in to create an event");
                return;
            } else if (response.status === 500) {
                alert("An error occurred. Please try again later.");
                return;
            }

            const data = await response.json();

            if (data.error) {
                console.error(data.error);
            }

            getEvents();
        } catch (error: unknown) {
            console.error('Error:', error as string);
        } finally {
            eventSubmitRef.current!.disabled = false;
        }
    }

    const getEvents = async (): Promise<void> => {
        try {
            const response = await fetch('/get/events', { "method": "POST", "credentials": "include" });

            if (response.status === 401) {
                alert("You must be logged in to view events");
                return;
            } else if (response.status === 500) {
                alert("Server error");
                return;
            }

            const data = await response.json();

            if (data.error) {
                console.error(data.error);
                return;
            }

            console.log(data.events);

            setEvents(data.events);
        } catch (error: unknown) {
            console.error('Error:', error as string);
        }
    }

    const deleteEvent = async (eventId: string): Promise<void> => {
        try {
            const dataJson = {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    "eventId": eventId
                })
            }

            const response = await fetch('/delete/events', { ...dataJson, "credentials": "include" });
            const data = await response.json();

            if (data.error) {
                console.error(data.error);
            }

            getEvents();
        } catch (error: unknown) {
            console.error('Error:', error as string);
        }
    }

    React.useEffect(() => {
        getEvents();
    }, []);

    return (
        <section id="events">
            <Sidebar />
            <div id="container">
                <div id="content">
                    <h1>Events</h1>
                </div>
                <div id="eventsLists">
                    <div id="left">
                        <p id="eventList">Event List</p>
                        <div id="eventListContent">
                            {
                                !events?.length ?
                                    <p id="default">No events found</p>
                                    :
                                    events?.map((event: EventData, index: number) => {
                                        return (
                                            <div className="event" key={index} id={event?.eventId}>
                                                <button onClick={() => deleteEvent(event?.eventId)}>Del</button>
                                                <div className="eventInfo">
                                                    <h3>{event?.eventName}</h3>
                                                    <p>{event?.eventDescription}</p>
                                                    <p>{event?.eventDate}</p>
                                                    <p>{event?.eventTime}</p>
                                                    <p>{event?.eventLocation}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                            }
                        </div>
                    </div>
                    <div id="right">
                        <p id="eventCreate">Create Event</p>
                        <form id="eventForm">
                            <input type="text" id="eventName" ref={eventNameRef} placeholder="Event Name" />
                            <input type="date" id="eventDate" ref={eventDateRef} placeholder="Event Date" />
                            <input type="time" id="eventTime" ref={eventTimeRef} placeholder="Event Time" />
                            <input type="search" id="eventLocation" ref={eventLocationRef} placeholder="Event Location" />
                            <input type="text" id="eventDescription" ref={eventDescriptionRef} placeholder="Event Description" />
                            <button type="button" onClick={() => sendEvents()} ref={eventSubmitRef}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EventsPage;