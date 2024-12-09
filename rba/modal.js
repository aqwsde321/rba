const inputIds = ["nickName", "timeMoney", "nigthTimeMoney", "nigthTimeStart"];
let isNigthTime = true;
let isBonusTime = true;
let settingData = {};

function settingDataInCal() {

    nickName = settingData[inputIds[0]];
    hourlyRate = parseInt(settingData[inputIds[1]]);
    if (isNigthTime) {
        nighthourlyRate = parseInt(settingData[inputIds[2]]);
        var startParts = settingData[inputIds[3]].split(':');
        var startHour = parseInt(startParts[0]);
        var startMinute = parseInt(startParts[1]);
        nightStartMinutes = startHour * 60 + startMinute;
    } else {
        nighthourlyRate = hourlyRate;
        nightStartMinutes = 50 * 60;
    }

    if (!isBonusTime) {
        weeklyHolidayAllowanceRate = 1;
    }

    Object.values(totalData).forEach((value) => {
        setWorkingTime(value);
    });

    calendar = new Calendar('#calendar');
}

// 모달 창 열기
function openModal() {
    const modal = document.getElementById('settingModal');
    modal.style.display = 'block';

    // 로컬 스토리지에서 데이터 가져와서 초기값 설정
    inputIds.forEach((id) => {
        const inputValue = getLocalStorage(id); // 로컬 스토리지에서 해당 아이디의 데이터 가져오기
        const inputElement = document.getElementById(id); // 아이디로 input 요소 가져오기

        // 로컬 스토리지에서 가져온 데이터가 존재하면 해당 값으로 초기화
        if (inputValue !== null) {
            inputElement.value = inputValue;
        }
    });

    settingForm();
}

// 모달 창 닫기
function closeModal() {
    const modal = document.getElementById('settingModal');
    modal.style.display = 'none';
}

// Submit 버튼 클릭 시 실행되는 함수
function handleSubmit() {
    let isValid = true;

    // 각 input 요소의 값을 로컬 스토리지에 저장하면서 유효성 검사
    inputIds.forEach((id) => {
        console.log(id);
        const inputElement = document.getElementById(id);
        const labelElement = inputElement.nextElementSibling;
        const value = inputElement.value.trim();

        if (value === "" || (isNigthTime && (id === inputIds[3] && value.length != 5))) {
            isValid = false;
            labelElement.classList.add("error");
        } else {
            labelElement.classList.remove("error");
            //setLocalStorage(id, value);
            window.localStorage.setItem(id, JSON.stringify(value));
            settingData[id] = value;
        }
    });

    if (isValid) {
        closeModal();
        setTotalDate(settingData[inputIds[0]]);
        settingDataInCal();

    }
}

// 숫자만 입력되게 필터링
function filterNumericInput(inputElement) {
    inputElement.value = inputElement.value.replace(/[^0-9]/g, "");
}

function filterKoreanInput(inputElement) {
    inputElement.value = inputElement.value.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7A3]+/g, '');
}

function enforceMaxLength(element, maxLength) {
    const value = element.value;
    const utf8Length = new Blob([value]).size;

    if (utf8Length > maxLength * 2) {
        // 한글 글자 수가 maxLength를 초과하면 잘라냅니다.
        const truncatedValue = value.substring(0, maxLength);
        element.value = truncatedValue;
    }
}
function settingForm() {

    // Submit 버튼에 이벤트 리스너 추가
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', handleSubmit);

    const nigthTimeToggle = document.getElementById('nigthTime');
    const userBox1 = document.getElementById('nigthTimeBox1');
    const userBox2 = document.getElementById('nigthTimeBox2');
    const nigthTimeText = document.getElementById('nigthTimeText');

    nigthTimeToggle.onclick = () => {
        nigthTimeToggle.classList.toggle('active');

        if (nigthTimeToggle.classList.contains('active')) {
            userBox1.style.display = 'block';
            userBox2.style.display = 'block';
            nigthTimeText.classList.remove("text-with-line-through");
            isNigthTime = true;
        } else {
            userBox1.style.display = 'none';
            userBox2.style.display = 'none';
            nigthTimeText.classList.add("text-with-line-through");
            isNigthTime = false;
        }
    };

    const bonusTimeToggle = document.getElementById('bonusTime');
    const bonusTimeText = document.getElementById('bonusTimeText');
    bonusTimeToggle.onclick = () => {
        bonusTimeToggle.classList.toggle('active');
        if (bonusTimeToggle.classList.contains('active')) {
            bonusTimeText.classList.remove("text-with-line-through");
            isBonusTime = true;
        } else {
            bonusTimeText.classList.add("text-with-line-through");
            isBonusTime = false;
        }
    };

    // 각 필드에 유효성 검사와 이벤트 핸들러 추가
    inputIds.forEach((id) => {
        const inputElement = document.getElementById(id);
        const labelElement = inputElement.nextElementSibling;

        inputElement.addEventListener("input", () => {
            const value = inputElement.value.trim();

            if (id === inputIds[0]) {
                filterKoreanInput(inputElement);
                enforceMaxLength(inputElement, 2);
            } else if (id === inputIds[3]) {
                inputTimeColon(inputElement);
            } else {
                filterNumericInput(inputElement);
            }

        });
    });

}
