function createCalendar(year: number, month: number): string {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let calendar = `${monthNames[month - 1]} ${year}\n`;
    calendar += daysOfWeek.join(' ') + '\n';

    let currentDay = 1;
    let nextMonthDay = 1;
    let prevMonthDays = new Date(year, month - 1, 0).getDate() - firstDay + 1;

    for (let i = 0; i < 6; i++) {
        let week = '';

        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                week += prevMonthDays.toString().padStart(3) + ' ';
                prevMonthDays++;
            } else if (currentDay <= daysInMonth) {
                week += currentDay.toString().padStart(3) + ' ';
                currentDay++;
            } else {
                week += nextMonthDay.toString().padStart(3) + ' ';
                nextMonthDay++;
            }
        }
        calendar += week.trim() + '\n';
        if (currentDay > daysInMonth && i > 3) break;
    }

    return calendar.trim();
}

export default createCalendar;