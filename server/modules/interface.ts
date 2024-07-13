interface EventsPrelim {
    eventName: string;
    eventDescription: string;
    eventLocation: string;
    eventTime: string;
    eventDate: string;
    eventId: string;
}
interface EventsData<EventsPrelim> {
    [x: string]: unknown;
    events: EventsPrelim[];
    eventId: string;
    userId?: string;
    length?: number;
}

export type { EventsData, EventsPrelim };