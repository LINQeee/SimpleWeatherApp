function weekDayFromIsoDate(date) {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-us", { weekday: "short"});
}

function formatIsoDate(date) {
    const dateObj = new Date(date);
    const monthName = dateObj.toLocaleDateString("en-us", { month: "long"});
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    return `${day} ${monthName} ${year}`;
}