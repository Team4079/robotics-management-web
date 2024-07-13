interface CreateCalendarProps {
    year: number;
    month: number;
}

interface UserData {
    displayName: string;
    email: string;
    firstName: string;
    hd: string | null;
    lastName: string | null;
    profilePicture: string;
}

interface EventData {
    eventName: string;
    eventDescription: string;
    eventLocation: string;
    eventTime: string;
    eventDate: string;
    eventId: string;
}

export type { CreateCalendarProps, UserData, EventData }