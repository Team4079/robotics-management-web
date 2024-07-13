/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import '../../assets/scss/format-calendar.scss';
import createCalendar from '../ts/calendar.ts';

const FormatCalendar: React.FC = (): React.JSX.Element => {
    const [year, setYear] = React.useState<number>(new Date().getFullYear());
    const [month, setMonth] = React.useState<number>(new Date().getMonth() + 1);
    const [shortenedDate, setShortenedDate] = React.useState<string>('');
    const [daysOfWeek, setDaysOfWeek] = React.useState<string[]>(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    const [days, setDays] = React.useState<number[][] | string[][]>([]);
    const [today, setToday] = React.useState<number>(new Date().getDate());
    const [todayMonth, setTodayMonth] = React.useState<number>(new Date().getMonth() + 1);
    const [todayYear, setTodayYear] = React.useState<number>(new Date().getFullYear());

    React.useEffect(() => {
        formatCalendar(createCalendar(year, month));
    }, [year, month]);

    const formatCalendar = (calendar: string): void => {
        const weeksInCalendar: string[][] | string[] = calendar.split('\n');
        const newWeeksInCalendar: string[][] = [];

        weeksInCalendar.forEach((week: string) => {
            newWeeksInCalendar.push(week.split(' ').filter((day: string) => day !== ''));
        });

        setShortenedDate(`${newWeeksInCalendar[0][0]} ${year}`);
        newWeeksInCalendar.shift();

        setDaysOfWeek(newWeeksInCalendar[0]);
        newWeeksInCalendar.shift();

        setDays(newWeeksInCalendar);

        setDays(newWeeksInCalendar);
    };

    const changeYear = (type: string): void => {
        if (type === 'Previous Year') {
            setYear(year - 1);
        } else {
            setYear(year + 1);
        }
    }

    const changeMonth = (type: string): void => {
        if (type === 'Previous Month') {
            if (month === 1) {
                setMonth(12);
                setYear(year - 1);
            } else {
                setMonth(month - 1);
            }
        } else {
            if (month === 12) {
                setMonth(1);
                setYear(year + 1);
            } else {
                setMonth(month + 1);
            }
        }
    }

    React.useEffect(() => {
        const today = new Date().getDate();
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();

        setToday(today);
        setTodayMonth(month);
        setTodayYear(year);
    }, [today, month, year]);

    return (
        <div id="mini-calendar">
            <h1>{shortenedDate}</h1>
            <div id="mainCalendar">
                <div id="yearModifiers">
                    <button className="year" onClick={() => changeYear("Previous Year")}>Previous Year</button>
                    <button className="year" onClick={() => changeYear("Next Year")}>Next Year</button>
                </div>
                <div id="monthModifiers">
                    <button className="month" onClick={() => changeMonth("Previous Month")}>Previous Month</button>
                    <button className="month" onClick={() => changeMonth("Next Month")}>Next Month</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            {daysOfWeek.map((day: string, index: number) => (
                                <th key={index}>{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {days.map((week: number[] | string[], weekIndex: number) => (
                            <tr key={weekIndex}>
                                {week.map((day: number | string, dayIndex: number) => (
                                    <td key={
                                        dayIndex
                                    }
                                        className={
                                            `${Number(day) === today && Number(month) === todayMonth && Number(year) === todayYear ? 'today' : ''} 
                                            ${weekIndex <= 1 && Number(day) > 20 || weekIndex >= 4 && Number(day) < 10 ? 'gray' : ''}`
                                        }
                                    >{day}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default FormatCalendar;