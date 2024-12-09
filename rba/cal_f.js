var calendar;
var nickName; // = 'ㅁㅁ';
var hourlyRate = 11000; // 시급

var nighthourlyRate;
var nightStartMinutes = 23 * 60;

var weeklyHolidayAllowanceRate = 1.2; // 주휴수당율
var clickCount = true;
var monthWeekArray;
var filteredData;
var totalData = {};

let isclearData = true;

!function () {

    openModal();

    addEventTopButtons();

    /*
    var currentFirstWeek = moment().date(1).isoWeek();
    var currentLastWeek = moment().week(); // 현재 달의 주차
    console.log(currentFirstWeek,currentLastWeek); // 현재 달의 주차 출력
    
    data.forEach(function(item) {
      setWorkingTime(item);
    });
  //setCurrnetMonthData(moment().date(1))
  */

}();

function setTotalDate(nickName) {
    //if (!nickName) nickName = getLocalStorage(inputIds[0]);
    console.log(nickName);
    Object.keys(window.localStorage).forEach(function (k) {
        if (isDateValid(k, nickName)) {
            totalData[k.replace(nickName, '')] = getLocalStorage(k);
            console.log(totalData)
        } else if (inputIds.includes(k)) {
            //totalData[k] = getLocalStorage(k);
        } else {
            //window.localStorage.removeItem(k);
        }
    });

}

function setTimeInput(input, name) {
    const test = document.createElement("input");

    try {
        test.type = "time";
    } catch (e) {
        console.log(e.description);
    }

    if (test.type === "text") {
        input.type = 'text';
        //input.style.fontSize = '20px';
        input.setAttribute('maxlength', '5');
    } else {
        input.type = 'time';
    }

    input.setAttribute('placeholder', 'HH:MM');
    input.id = name + 'Input';
    input.classList.add('timeBox');
    input.classList.add(name);

}


// function getDate(dateString) {
//     // nickName + "yyyy-mm-dd" 형식으로 정규 표현식 생성
//     const regex = new RegExp(`^${nickName}\\d{4}-\\d{2}-\\d{2}$`);

//     // 형식 검사
//     if (!regex.test(dateString)) {
//         return false; // 형식이 맞지 않으면 false 반환
//     }

//     // Date 객체로 변환하고 유효성 체크
//     const dateObject = new Date(dateString.replace(nickName, '')); // nickName을 제거한 후 날짜만 파싱
//     return dateObject;
// }


function isDateValid(dateString, nickName) {
    // nickName + "yyyy-mm-dd" 형식으로 정규 표현식 생성
    const regex = new RegExp(`^${nickName}\\d{4}-\\d{2}-\\d{2}$`);

    // 형식 검사
    if (!regex.test(dateString)) {
        return false; // 형식이 맞지 않으면 false 반환
    }

    // Date 객체로 변환하고 유효성 체크
    const dateObject = new Date(dateString.replace(nickName, '')); // nickName을 제거한 후 날짜만 파싱
    return !isNaN(dateObject.getTime());
}

function addEventTopButtons() {
    copyButtonEvent();
    settingButtonEvent();
    InsertButtonEvent();
}

function copyButtonEvent() {
    // data-copy 버튼 클릭 이벤트
    const dataCopyButton = document.getElementById("dataCopyButton");
    dataCopyButton.addEventListener("click", function () {
        // 로컬 스토리지에서 데이터 가져오기
        const localStorageData = JSON.stringify(localStorage);

        // 클립보드에 복사하기
        const tempInput = document.createElement("input");
        tempInput.value = localStorageData;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        // 복사 완료 메시지
        alert("데이터가 클립보드로 복사되었습니다. data insert에 사용하시면 됩니다.");
    });
}
function settingButtonEvent() {
    // setting 버튼 클릭 이벤트
    const settingButton = document.getElementById("settingButton");
    settingButton.addEventListener("click", function () {
        // 페이지 새로고침
        location.reload();
    });

}

function InsertButtonEvent() {
    // data-Insert 버튼 클릭 이벤트
    const dataInsertButton = document.getElementById("dataInsertButton");
    const dataInsertModal = document.getElementById("dataInsertModal");
    dataInsertButton.addEventListener("click", function () {
        dataInsertModal.style.display = "block";
    });

    // 모달 닫기 클릭 이벤트

    const modalBox = document.querySelector("#dataInsertModal .modal-box");
    dataInsertModal.addEventListener("click", function () {
        if (!modalBox.contains(event.target)) {
            dataInsertModal.style.display = "none";
        }
    });

    // 저장 버튼 클릭 이벤트
    const saveDataInsertButton = document.getElementById("InsertButton");
    saveDataInsertButton.addEventListener("click", function () {

        const dataInsertInput = document.getElementById("dataInsertInput");
        const labelElement = dataInsertInput.nextElementSibling;
        labelElement.classList.remove("error");
        const inputData = dataInsertInput.value;

        if (inputData === 'clear') {
            localStorage.clear();
            location.reload();
        }

        try {
            const parsedData = JSON.parse(inputData);
            if (isKeyValueObject(parsedData)) {
                if (isclearData) localStorage.clear();
                for (const key in parsedData) {
                    localStorage.setItem(key, parsedData[key]);
                }
                location.reload();
            } else {
                labelElement.classList.add("error");
            }

        } catch (error) {
            console.error('JSON 파싱 에러:', error);
            labelElement.classList.add("error");
        }

    });

    const clearDataToggle = document.getElementById('clearData');
    const clearDataText = document.getElementById('clearDataText');
    clearDataToggle.onclick = () => {
        clearDataToggle.classList.toggle('active');
        if (clearDataToggle.classList.contains('active')) {
            clearDataText.textContent = '기존 데이터를 삭제 후 Insert';
            isclearData = true;
        } else {
            clearDataText.textContent = '기존 데이터에 Update';
            isclearData = false;
        }
    };
}

function isKeyValueObject(data) {
    console.log("iskey");
    console.log(typeof data);
    if (typeof data === 'object' && data !== null) {
        // 객체의 프로퍼티들을 순회하면서 확인
        console.log(typeof data);
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                // 프로퍼티의 값이 어떤 형태든 상관 없다면 아래 두 줄은 생략 가능
                console.log(typeof data[key]);
                if (typeof data[key] !== 'string') {
                    return false; // 값이 문자열이 아닌 경우 거짓 반환
                }
            }
        }
        return true; // 모든 프로퍼티가 문자열인 경우 참 반환
    }
    return false; // 객체가 아닌 경우 거짓 반환
}

function setLocalStorage(k, v) {
    window.localStorage.setItem(nickName + k, JSON.stringify(v));
}

function getLocalStorage(k) {
    try {
        const value = window.localStorage.getItem(k);
        return JSON.parse(value);
    } catch (e) {
        console.error("Error parsing localStorage item:", e); // 에러를 콘솔에 출력
        //window.localStorage.removeItem(k);
        return null;  // 에러가 발생하면 null 반환
    }
}
function tableDel() {
    clickCount = true;
    var legend = document.querySelector('.legend');
    var secondChild = legend.childNodes[1]; // Select the second child element (index 1)

    if (secondChild) {
        secondChild.innerHTML = '';
        //legend.removeChild(secondChild); // Remove the second child element
    }
}

function makeTable(currentYear) {
    console.log(currentYear);
    var table = createElement('table', 'container');
    table.innerHTML = '';
    var tableBody = createElement('tbody');
    tableBody.innerHTML = '';
    // thead 요소 생성
    var thead = document.createElement('thead');
    var theadRow = document.createElement('tr');

    // 각 셀(th) 생성
    var weekHeader = document.createElement('th');
    weekHeader.style.width = '9%';
    weekHeader.textContent = '주';
    theadRow.appendChild(weekHeader);

    var dateHeader = document.createElement('th');
    dateHeader.style.width = '18%';
    dateHeader.textContent = '날 짜';
    theadRow.appendChild(dateHeader);

    var startTimeHeader = document.createElement('th');
    startTimeHeader.style.width = '19%';
    startTimeHeader.textContent = '시작시간';
    theadRow.appendChild(startTimeHeader);

    var endTimeHeader = document.createElement('th');
    endTimeHeader.style.width = '19%';
    endTimeHeader.textContent = '종료시간';
    theadRow.appendChild(endTimeHeader);

    var workingTimeHeader = document.createElement('th');
    workingTimeHeader.style.width = '35%';
    workingTimeHeader.innerHTML = '일한시간'

    if (isNigthTime) {
        const spanElement = document.createElement('span');
        spanElement.textContent = '(주/야)';
        spanElement.style.fontSize = '80%';
        workingTimeHeader.appendChild(spanElement);
    }

    theadRow.appendChild(workingTimeHeader);

    // theadRow를 thead에 추가
    thead.appendChild(theadRow);

    // 생성된 thead를 table에 추가
    table.appendChild(thead);

    var money = 0;
    var groupedData = makeWeekGroup(totalData, currentYear); //setCurrnetMonthData()

    for (var week in groupedData) {
        var weekDayList = groupedData[week];
        console.log(weekDayList, week);
        weekDayList.sort(function (a, b) {
            return new Date(a) - new Date(b);
        });

        money += calMoney(weekDayList, tableBody);
    }

    var row = createElement('tr', 'money');
    row.style.backgroundColor = '#1F2739';

    var moneyCell = createElement('td', 'calculationCell');
    moneyCell.style.color = '#ffffff';
    moneyCell.textContent = 'total';
    moneyCell.colSpan = 2;
    row.appendChild(moneyCell);

    var calMonneyCell = createElement('td', 'calMonneyCell');
    calMonneyCell.style.color = '#ffffff';
    calMonneyCell.style.textAlign = 'right';
    calMonneyCell.colSpan = 3;
    calMonneyCell.textContent = numberWithCommas(toFixedDecimals(money, 0));
    row.appendChild(calMonneyCell);

    tableBody.appendChild(row);

    table.appendChild(tableBody);
    return table;
}

function setCurrnetMonthData() {
    var filteredData = Object.keys(totalData).filter(function (key) {
        var item = totalData[key];
        return monthWeekArray.includes(item.week);
    }).reduce(function (obj, key) {
        obj[key] = totalData[key];
        return obj;
    }, {});

    return filteredData;
}

function makeWeekGroup(data, currentYear) {
    var groupedData = {};

    console.log(currentYear)
    Object.keys(data).forEach(function (day) {
        var item = data[day];
        var year = new Date(day).getFullYear(); // day로부터 연도 추출
        // 올해 값이 아니면 groupedData에 추가하지 않음
        if (year !== currentYear) {
            return; // 루프는 계속 진행
        }

        // 주차 배열에 포함된 주차만 처리
        if (monthWeekArray.includes(item.week)) {
            if (!groupedData[item.week]) {
                groupedData[item.week] = [];
            }
            groupedData[item.week].push(day);
        }
    });

    return groupedData;
}

function calMoney(data, tableBody) {

    var totalEarnings = 0;
    var weekTotalWorkingTime = 0;
    var weekTotalDayWorkingTime = 0;
    var weekTotalNightWorkingTime = 0;
    var isWeeklyHolidayAllowanceRate = 1;

    data.forEach(function (day) {

        var item = totalData[day];

        var row = document.createElement('tr');

        var weekCell = document.createElement('td');
        weekCell.textContent = item.week;
        row.appendChild(weekCell);

        var dateCell = document.createElement('td');
        dateCell.textContent = day.substring(5);
        row.appendChild(dateCell);

        var startTimeCell = document.createElement('td');
        startTimeCell.textContent = item.startTime;
        row.appendChild(startTimeCell);

        var endTimeCell = document.createElement('td');
        endTimeCell.textContent = item.endTime;
        row.appendChild(endTimeCell);

        var workingTimeCell = document.createElement('td');
        workingTimeCell.textContent = toFixedDecimals(item.workingTime, 2);

        if (isNigthTime) {
            const spanElement = document.createElement('span');
            spanElement.textContent = ` (${toFixedDecimals(item.dayWorkingTime, 2)} / ${toFixedDecimals(item.nightWorkingTime, 2)})`;
            spanElement.style.fontSize = '80%';
            workingTimeCell.appendChild(spanElement);
        }

        row.appendChild(workingTimeCell);

        tableBody.appendChild(row);

        weekTotalWorkingTime += item.workingTime;
        weekTotalDayWorkingTime += item.dayWorkingTime;
        weekTotalNightWorkingTime += item.nightWorkingTime;
    });

    if (weekTotalWorkingTime >= 15) isWeeklyHolidayAllowanceRate = weeklyHolidayAllowanceRate;

    totalEarnings = ((weekTotalDayWorkingTime * hourlyRate) + (weekTotalNightWorkingTime * nighthourlyRate)) * isWeeklyHolidayAllowanceRate;
    totalEarnings = Number(totalEarnings.toFixed(0));

    // var totalEarningsCalculation = `(${weekTotalDayWorkingTime}*${hourlyRate} + ${weekTotalNightWorkingTime}*${nighthourlyRate})*${isWeeklyHolidayAllowanceRate} =`;
    var totalEarningsCalculation = `(${toFixedDecimals(weekTotalDayWorkingTime, 2)}x${hourlyRate}` +
        `${isNigthTime ? ` + ${toFixedDecimals(weekTotalNightWorkingTime, 2)}x${nighthourlyRate}` : ''})` +
        `x${isWeeklyHolidayAllowanceRate} =`;

    var row = createElement('tr', 'calculation');
    row.style.backgroundColor = 'rgb(60 87 60)';

    var calculationCell = createElement('td', 'calculationCell');
    calculationCell.style.color = 'rgb(219 14 211)';
    calculationCell.textContent = totalEarningsCalculation;
    calculationCell.colSpan = 4; // rowspan 속성을 설정하여 행 병합
    /*
        const maxTextLength = 32;
        const currentTextLength = totalEarningsCalculation.length;
    
        // 만약 현재 너비가 최대 너비를 초과하면 글자 크기를 줄임
        if (currentTextLength > maxTextLength) {
            let fontSize = 16 - (currentTextLength - maxTextLength);
            if(fontSize < 10) fontSize = 10;
            calculationCell.style.fontSize = `${fontSize}px`; // 스타일 변경
        }
    */
    row.appendChild(calculationCell);

    var calMonneyCell = createElement('td', 'calMonneyCell');
    calMonneyCell.style.color = 'rgb(219 14 211)';
    calMonneyCell.textContent = numberWithCommas(toFixedDecimals(totalEarnings, 0));
    row.appendChild(calMonneyCell);

    tableBody.appendChild(row);

    return totalEarnings;
}

function setWorkingTime(item) {
    console.log(item);
    var startParts = item.startTime.split(':');
    var endParts = item.endTime.split(':');

    var startHour = parseInt(startParts[0]);
    var startMinute = parseInt(startParts[1]);

    var endHour = parseInt(endParts[0]);
    var endMinute = parseInt(endParts[1]);

    var startMinutes = startHour * 60 + startMinute;
    var endMinutes = endHour * 60 + endMinute;

    if (endMinutes < startMinutes) {
        // If endTime is before startTime, assume it's the next day
        endMinutes += 24 * 60;
    }

    var nightWorkingTimeMinutes = 0;
    var dayWorkingTimeMinutes = 0;

    if (nightStartMinutes < endMinutes) {

        if (startMinutes <= nightStartMinutes) {
            nightWorkingTimeMinutes = endMinutes - nightStartMinutes
            dayWorkingTimeMinutes = nightStartMinutes - startMinutes;
        } else {
            nightWorkingTimeMinutes = endMinutes - startMinutes;
            dayWorkingTimeMinutes = 0;
        }
    } else {
        dayWorkingTimeMinutes = endMinutes - startMinutes;
        nightWorkingTimeMinutes = 0;
    }
    var dayWorkingTimeHours = dayWorkingTimeMinutes / 60;
    var nightWorkingTimeHours = nightWorkingTimeMinutes / 60;
    var workingTimeHours = dayWorkingTimeHours + nightWorkingTimeHours;
    //console.log((endMinutes - startMinutes) / 60 == workingTimeHours);

    item.workingTime = workingTimeHours;
    item.dayWorkingTime = dayWorkingTimeHours;
    item.nightWorkingTime = nightWorkingTimeHours;

}

function inputTimeColon(time) {
    var inputValue = time.value.replace(/[^\d]/g, '');
    var len = inputValue.length;

    if (len > 2) {
        var hour = inputValue.substring(0, 2);
        var min = inputValue.substring(2, len);

        if (min.length === 2) {
            hour = Math.min(Math.max(parseInt(hour), 0), 23);
            min = Math.min(Math.max(parseInt(min), 0), 59);
            if (hour < 10) hour = '0' + hour;
            if (min < 10) min = '0' + min;
        }
        inputValue = hour + ':' + min;
    }
    time.value = inputValue;
}

function getRandomColorClass() {
    const colorClasses = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'cyan', 'teal', 'lime', 'magenta', 'indigo', 'violet', 'gold', 'salmon', 'turquoise', 'lavender', 'chartreuse', 'aqua'];

    const randomIndex = Math.floor(Math.random() * colorClasses.length);

    return colorClasses[randomIndex];
}

function toFixedDecimals(number, place) {
    var decimalPart = number.toString().split('.')[1];

    if (decimalPart !== undefined) {
        var n = decimalPart.length;
        if (n > place) n = place;
        return Number(number.toFixed(n));
    } else return number;
}

function createNumberArray(start, end) {
    var numberArray = [];

    if (start < end) {
        for (var i = start; i <= end; i++) {
            numberArray.push(i);
        }
    } else if (start > end) {
        for (var i = start; i <= 52; i++) { // 현재 해의 남은 숫자 추가
            numberArray.push(i);
        }
        numberArray.push(end);
    }

    return numberArray;
}

function setCurrnetMonthWeekArray(firstDay) {
    var startWeek = firstDay.week();
    var endWeek = firstDay.endOf('month').week(); // 12월 마지막주가 1주차인 경우있음.
    monthWeekArray = createNumberArray(startWeek, endWeek);
}

function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function createElement(tagName, className, innerText) {
    var ele = document.createElement(tagName);
    if (className) {
        ele.className = className;
    }
    if (innerText) {
        ele.innerText = ele.textContent = innerText;
    }
    return ele;
}
