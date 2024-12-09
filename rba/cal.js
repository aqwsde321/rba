!function () {

  var today = moment();

  function Calendar(selector) {
    this.el = document.querySelector(selector);
    // this.events = events;
    this.current = moment().date(1);
    this.draw();
    var current = document.querySelector('.today');
    if (current) {
      var self = this;
      window.setTimeout(function () {
        self.openDay(current);
      }, 500);
    }

    // DOM 요소에 클릭 이벤트 리스너 추가
    /*
    this.el.addEventListener('click', function(event) {
      console.log(totalData);
      if (event.target.classList.contains('add-event-button')) {

        if(this.events.length != filteredData.length){
          console.log("바꾼다");
          this.events = filteredData;
          clickCount = true;

          var legend = document.querySelector('.legend');
          var secondChild = legend.childNodes[1]; // Select the second child element (index 1)
          console.log(secondChild);
          if (secondChild) {
            legend.removeChild(secondChild); // Remove the second child element
          }

        }
      }
    }.bind(this)); // 이벤트 핸들러 내에서 this를 Calendar 객체에 연결하기 위해 bind 사용
    */

  }

  Calendar.prototype.draw = function () {

    setCurrnetMonthWeekArray(this.current.clone());
    //Create Header
    this.drawHeader();
    //Draw Month
    this.drawMonth();

    this.drawLegend();
  }

  Calendar.prototype.drawHeader = function () {
    var self = this;
    if (!this.header) {
      //Create the header elements
      this.header = createElement('div', 'header');
      this.header.className = 'header';

      this.title = createElement('h1');

      var right = createElement('div', 'right');
      right.addEventListener('click', function () { self.nextMonth(); });

      var left = createElement('div', 'left');
      left.addEventListener('click', function () { self.prevMonth(); });

      //Append the Elements
      this.header.appendChild(this.title);
      this.header.appendChild(right);
      this.header.appendChild(left);
      this.el.appendChild(this.header);
    }

    this.title.innerHTML = this.current.format('MMMM YYYY');
  }

  Calendar.prototype.drawMonth = function () {
    var self = this;

    if (this.month) {
      this.oldMonth = this.month;
      this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');

      self.oldMonth.parentNode.removeChild(self.oldMonth);
      self.month = createElement('div', 'month');
      self.backFill();
      self.currentMonth();
      self.fowardFill();
      self.el.appendChild(self.month);

      self.month.className = 'month in ' + (self.next ? 'next' : 'prev');

    } else {
      this.month = createElement('div', 'month');
      this.el.appendChild(this.month);
      this.backFill();
      this.currentMonth();
      this.fowardFill();
      this.month.className = 'month new';
    }
  }

  Calendar.prototype.backFill = function () {
    var clone = this.current.clone();

    var dayOfWeek = clone.day();

    if (!dayOfWeek) { return; }

    clone.subtract(dayOfWeek + 1, 'days');

    for (var i = dayOfWeek; i > 0; i--) {
      this.drawDay(clone.add(1, 'days'));
    }
  }

  Calendar.prototype.fowardFill = function () {
    var clone = this.current.clone().add(1, 'months').subtract(1, 'days');

    var dayOfWeek = clone.day();

    if (dayOfWeek === 6) { return; }

    for (var i = dayOfWeek; i < 6; i++) {
      this.drawDay(clone.add(1, 'days'));
    }
  }

  Calendar.prototype.currentMonth = function () {
    var clone = this.current.clone();

    while (clone.month() === this.current.month()) {
      this.drawDay(clone);
      clone.add(1, 'days');
    }
  }

  Calendar.prototype.getWeek = function (day) {
    var weekNumber = day.week();
    if (!this.week || day.day() === 0) {
      this.week = createElement('div', 'week');
      this.week.setAttribute('data-week', weekNumber);
      this.month.appendChild(this.week);
    }
  }

  Calendar.prototype.drawDay = function (day) {
    var self = this;
    this.getWeek(day);

    //Outer Day
    var outer = createElement('div', this.getDayClass(day));
    outer.addEventListener('click', function () {
      self.openDay(this);
    });
    //day 클래스에 날짜 추가
    outer.setAttribute('data-date', day.format('YYYY-MM-DD'));

    var name = createElement('div', 'day-name', day.format('ddd'));

    var number = createElement('div', 'day-number', day.format('DD'));

    var events = createElement('div', 'day-events');
    this.drawEvents(day, events);

    outer.appendChild(name);
    outer.appendChild(number);
    outer.appendChild(events);
    this.week.appendChild(outer);
  }

  Calendar.prototype.drawEvents = function (day, element) {

    var targetEvent = totalData[day.format('YYYY-MM-DD')];

    if (targetEvent) {
      var evSpan = createElement('span', getRandomColorClass());
      element.appendChild(evSpan);
    }

  }

  Calendar.prototype.getDayClass = function (day) {
    classes = ['day'];
    if (day.month() !== this.current.month()) {
      classes.push('other');
    } else if (today.isSame(day, 'day')) {
      classes.push('today');
    }
    return classes.join(' ');
  }

  Calendar.prototype.openDay = function (el) {

    var details, arrow;

    var currentOpened = document.querySelector('.details');

    if (currentOpened && currentOpened.parentNode === el.parentNode) {
      details = currentOpened;
      arrow = document.querySelector('.arrow');
    } else {
      if (currentOpened) {
        currentOpened.addEventListener('webkitAnimationEnd', function () {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('oanimationend', function () {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('msAnimationEnd', function () {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('animationend', function () {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.className = 'details out';
      }

      details = createElement('div', 'details in');

      var arrow = createElement('div', 'arrow');

      details.appendChild(arrow);
      el.parentNode.appendChild(details);
    }

    var targetEvent = totalData[el.getAttribute('data-date')];

    this.renderEvents(targetEvent, details, el);

    arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + 'px';
  }

  Calendar.prototype.renderEvents = function (event, ele, el) {
    var currentWrapper = ele.querySelector('.events');
    var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));

    var div = createElement('div', 'event empty');

    /* 시간 입력 text */
    var input = document.createElement('input');
    setTimeInput(input, 'startTime');
    input.addEventListener('keyup', function () {
      inputTimeColon(this);
      if (this.value.length >= 5) {
        input2.focus();
      }
    });

    var textNode = document.createTextNode(' ~ ');

    var input2 = document.createElement('input');
    setTimeInput(input2, 'endTime');

    input2.addEventListener('keyup', function () {
      inputTimeColon(this);
    });

    var registerButton = createElement('button', 'add-event-button');
    registerButton.textContent = nickName;
    if (event) {
      input.value = event.startTime;
      input2.value = event.endTime;
      registerButton.textContent = 'edit';
    }

    registerButton.addEventListener('click', function () {
      var startTime = input.value;
      var endTime = input2.value;
      var day = el.getAttribute('data-date');
      var week = parseInt(el.parentNode.getAttribute('data-week'));

      if (this.textContent === nickName) {
        //if(startTime.trim() !== '' && endTime.trim() !== ''){
        if (startTime.length == 5 && endTime.length == 5) {
          var evSpan = createElement('span', getRandomColorClass());
          el.querySelector(".day-events").appendChild(evSpan);
          registerButton.textContent = 'edit';
          var newEvent = Object.assign({}, { week, startTime, endTime });
          setLocalStorage(day, newEvent);
          setWorkingTime(newEvent);
          totalData[day] = newEvent;
          tableDel();
        }
      } else {

        if (startTime.trim() == '' || endTime.trim() == '') {
          input.value = null;
          input2.value = null;

          el.querySelector(".day-events").innerHTML = "";
          registerButton.textContent = nickName;

          if (totalData.hasOwnProperty(day)) {
            delete totalData[day]; // 해당 키를 삭제합니다.
            tableDel();
            window.localStorage.removeItem(day);
          }
        } else if (totalData[day].startTime != startTime || totalData[day].endTime != endTime) {
          if (startTime.length == 5 && endTime.length == 5) {
            var newEvent = Object.assign({}, { week, startTime, endTime });
            setLocalStorage(day, newEvent);
            setWorkingTime(newEvent);
            totalData[day] = newEvent;
            tableDel();
          }
        }
      }
    });

    div.appendChild(input);
    div.appendChild(textNode);
    div.appendChild(input2);
    div.appendChild(registerButton);
    wrapper.appendChild(div);

    if (currentWrapper) {
      currentWrapper.className = 'events out';
      currentWrapper.addEventListener('webkitAnimationEnd', function () {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('oanimationend', function () {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('msAnimationEnd', function () {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('animationend', function () {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
    } else {
      ele.appendChild(wrapper);
    }
  }

  // 하단부 목록 표 만들자
  Calendar.prototype.drawLegend = function () {
    var legendElement = document.querySelector('.legend');
    if (legendElement) {
      legendElement.parentNode.removeChild(legendElement);
      clickCount = true;
    }

    var legend = createElement('div', 'legend');
    var btn = createElement('span', 'calTable-btn');
    var calTable = createElement('span', 'calTable');
    var currentYear = this.current.year();
    console.log(currentYear);
    btn.addEventListener('click', function () {
      if (clickCount) {
        calTable.innerHTML = '';
        calTable.appendChild(makeTable(currentYear));
        legend.appendChild(calTable);
        clickCount = false;
      } else {
        calTable.classList.toggle('hidden');
      }
    });

    legend.appendChild(btn);
    this.el.appendChild(legend);
  }

  Calendar.prototype.nextMonth = function () {
    this.current.add(1, 'months');
    this.next = true;
    this.draw();
  }

  Calendar.prototype.prevMonth = function () {
    this.current.subtract(1, 'months');
    this.next = false;
    this.draw();
  }

  window.Calendar = Calendar;

}();
