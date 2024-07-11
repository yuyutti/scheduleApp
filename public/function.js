async function fetchHolidays() {
    const response = await fetch('https://holidays-jp.github.io/api/v1/date.json');
    const holidays = await response.json();
    return holidays;
}

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function addTimeInputFields_NewInput() {
    const startTimeContainer = document.getElementById('startInput');
    const endTimeContainer = document.getElementById('endInput');
    const inputType = isMobileDevice() ? 'time' : 'text';
    const step = isMobileDevice() ? '900' : '';

    startTimeContainer.innerHTML = `
        <input type="${inputType}" class="form-control" id="eventStartTime" ${step ? `step="${step}"` : ''} required>
    `;
    endTimeContainer.innerHTML = `
        <input type="${inputType}" class="form-control" id="eventEndTime" ${step ? `step="${step}"` : ''}>
    `;
}

function addTimeInputFields_EditInput() {
    const startTimeContainer = document.getElementById('editStartInput');
    const endTimeContainer = document.getElementById('editEndInput');
    const inputType = isMobileDevice() ? 'time' : 'text';
    const step = isMobileDevice() ? '900' : '';

    startTimeContainer.innerHTML = `
        <input type="${inputType === 'time' ? 'data' : 'text'}" class="form-control" id="editEventStartDay" ${step ? `step="${step}"` : ''} required>
        <input type="${inputType}" class="form-control" id="editEventStartTime" ${step ? `step="${step}"` : ''} required>
    `;
    endTimeContainer.innerHTML = `
        <input type="${inputType === 'time' ? 'data' : 'text'}" class="form-control" id="editEventEndDay" ${step ? `step="${step}"` : ''}>
        <input type="${inputType}" class="form-control" id="editEventEndTime" ${step ? `step="${step}"` : ''}>
    `;
}