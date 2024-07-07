async function fetchHolidays() {
    const response = await fetch('https://holidays-jp.github.io/api/v1/date.json');
    const holidays = await response.json();
    return holidays;
}

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function addTimeInputFields() {
    const startTimeContainer = document.getElementById('startinput');
    const endTimeContainer = document.getElementById('endinput');
    const inputType = isMobileDevice() ? 'time' : 'text';
    const step = isMobileDevice() ? '900' : '';

    startTimeContainer.innerHTML = `
        <input type="${inputType}" class="form-control" id="eventStartTime" ${step ? `step="${step}"` : ''} required>
    `;
    endTimeContainer.innerHTML = `
        <input type="${inputType}" class="form-control" id="eventEndTime" ${step ? `step="${step}"` : ''} required>
    `;
}