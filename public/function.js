// フォームリセット用の関数 //

function resetEventForm() {
    document.getElementById('eventTitle').value = '';
    // document.getElementById('eventColor').value = '';
    document.getElementById('eventDescription').value = '';
    document.getElementById('eventStartTime').value = '';
    document.getElementById('eventEndTime').value = '';
}

// 祝日を取得する関数 //

async function fetchHolidays() {
    const response = await fetch('https://holidays-jp.github.io/api/v1/date.json');
    const holidays = await response.json();
    return holidays;
}

// モバイルデバイスかどうかを判定する関数 //

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// イベントの開始時間と終了時間を変換するための関数 //

function normalizeTimeInput(value) {
    if (/^\d+$/.test(value)) {
        return `${String(value).padStart(2, '0')}:00`;  // ex: "9" → "09:00"
    } else if (/^\d+(\.\d{1,2})?$/.test(value)) {
        return convertToTimeString(parseFloat(value));  // ex: "9.5" → "09:30"
    }
    return value;
}

function convertToTimeString(value) {
    let hours = Math.floor(value);
    let minutes = Math.round((value - hours) * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function createTimeInputField(containerId, dateInputId, timeInputId, includeDate = false) {
    const container = document.getElementById(containerId);
    const isMobile = isMobileDevice();

    container.innerHTML = `
        <div class="input-group">
            ${includeDate ? `<input type="date" class="form-control" id="${dateInputId}" required>` : ''}
            <input type="number" class="form-control" id="${timeInputId}" 
                placeholder="HH:mm" pattern="[0-9]{2}:[0-9]{2}" tabindex="4" autocomplete="off" required>
            <div id="timeDropdown" class="time-dropdown"></div>
            <datalist id="timeList">
                ${
                    Array.from({ length: 24 * 4 }, (_, i) => {
                        let hours = Math.floor(i / 4);
                        let minutes = i % 4 * 15;
                        return `<option value="${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}">`;
                    }).join('')
                }
            </datalist>
        </div>
    `;

    const timeField = document.getElementById(timeInputId);

    if (isMobile) {
        // iPhoneの場合、15分おきに補正
        timeField.addEventListener("blur", (e) => {
            if (!e.target.value) return;
            let [hours, minutes] = e.target.value.split(":").map(Number);
            let roundedMinutes = Math.round(minutes / 15) * 15;
            if (roundedMinutes === 60) {
                hours = (hours + 1) % 24;
                roundedMinutes = 0;
            }
            e.target.value = `${String(hours).padStart(2, "0")}:${String(roundedMinutes).padStart(2, "0")}`;
        });
    } else {
        // PCやAndroidは自由入力
        timeField.addEventListener("blur", (e) => {
            e.target.value = normalizeTimeInput(e.target.value);
        });
    }
}

function setupTimeDropdown(inputId, datalistId) {
    const input = document.getElementById(inputId);
    const datalist = document.getElementById(datalistId);

    if (!input || !datalist) {
        console.error(`setupTimeDropdown: ${inputId} または ${datalistId} が見つかりません`);
        return;
    }

    // 各 input ごとに dropdown を作成
    let dropdown = document.createElement("div");
    dropdown.classList.add("time-dropdown");
    dropdown.style.position = "absolute";
    dropdown.style.width = input.offsetWidth + "px";
    dropdown.style.display = "none";
    input.parentElement.appendChild(dropdown);

    let options = Array.from(datalist.getElementsByTagName("option")).map(opt => opt.value);

    // 候補リストを作成
    function createDropdown() {
        dropdown.innerHTML = "";
        options.forEach(time => {
            let option = document.createElement("div");
            option.classList.add("time-option");
            option.textContent = time;
            option.addEventListener("click", () => {
                input.value = time;
                dropdown.style.display = "none"; // 選択したら閉じる
            });
            dropdown.appendChild(option);
        });
    }

    // 入力に応じてフィルター
    function updateDropdown(filter = "") {
        let normalizedFilter = filter.padStart(2, "0"); // `6` → `06`
        let exactMatch = options.find(time => time === normalizedFilter);

        dropdown.innerHTML = ""; // 一度リセット

        if (exactMatch) {
            // 完全一致する場合は、それだけを表示
            let option = document.createElement("div");
            option.classList.add("time-option");
            option.textContent = exactMatch;
            option.addEventListener("click", () => {
                input.value = exactMatch;
                dropdown.style.display = "none"; // 選択したら閉じる
            });
            dropdown.appendChild(option);
        } else {
            // 部分一致する場合は、絞り込んで表示
            options.forEach(time => {
                if (!filter || time.startsWith(normalizedFilter)) {
                    let option = document.createElement("div");
                    option.classList.add("time-option");
                    option.textContent = time;
                    option.addEventListener("click", () => {
                        input.value = time;
                        dropdown.style.display = "none"; // 選択したら閉じる
                    });
                    dropdown.appendChild(option);
                }
            });
        }

        dropdown.style.display = dropdown.childNodes.length > 0 ? "block" : "none";
    }

    // 初回ロード時にリスト作成
    createDropdown();

    // `input` にフォーカスしたら全て表示
    input.addEventListener("focus", () => {
        dropdown.style.width = input.offsetWidth + "px";
        dropdown.style.top = input.offsetTop + input.offsetHeight + "px";
        dropdown.style.left = input.offsetLeft + "px";
        updateDropdown();
    });

    // 入力時にフィルター
    input.addEventListener("input", (e) => {
        updateDropdown(e.target.value);
    });

    // フォーカスを外したらリストを閉じる
    input.addEventListener("blur", () => setTimeout(() => dropdown.style.display = "none", 200));
}

function setupAutoEndTime(startInputId, endInputId, endSelectId) {
    const startInput = document.getElementById(startInputId);
    const endInput = document.getElementById(endInputId);
    const endSelect = document.getElementById(endSelectId);

    startInput.addEventListener('input', () => {
        if (!endInput.value) {
            let startTimeDecimal = convertToDecimalTime(startInput.value);
            let endTimeDecimal = startTimeDecimal + 2; // 2時間後
            if (endTimeDecimal >= 24) endTimeDecimal = 23.75; // 23:45が上限

            let endTimeString = convertToTimeString(endTimeDecimal);
            endInput.value = endTimeString;
            endSelect.value = endTimeString;
        }
    });
}