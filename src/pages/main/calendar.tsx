import React from 'react';
import '../../assets/scss/calendar.scss';
import Sidebar from '../../assets/components/sidebar.tsx';
import FormatCalendar from '../../assets/components/format-calendar.tsx';

const CalendarPage: React.FC = (): React.JSX.Element => {
    return (
        <section id="calendar">
            <Sidebar />
            <div id="container">
                <FormatCalendar />
            </div>
        </section>
    )
}

export default CalendarPage;