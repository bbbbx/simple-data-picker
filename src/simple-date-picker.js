(function () {
  var datepicker = {};
  var language = "default"
  window.datepicker = datepicker;

  /**
   * 将 Date 对象格式化成的字符串，例如：2018-05-12
   * @param {Date} date 
   * @return {string} ret 
   */
  datepicker.format = function (date) {
    var ret = '';
    function padding(num) {
      if (num <= 9) {
        return '0' + num;
      } else {
        return num;
      }
    }
    ret += date.getFullYear() + '-' + padding(date.getMonth() + 1) + '-' + padding(date.getDate());
    return ret;
  }

  /**
   * 获取月份日期数据
   * @param {number} year 
   * @param {number} month 
   * @return {Object} object
   */
  datepicker.getMonthDate = function (year, month) {
    var ret = [];
    var today = new Date();
    var row;
    year = year || today.getFullYear();
    month = month || today.getMonth() + 1;

    var firstDay = new Date(year, month - 1, 1);
    var firstDayWeekDay = firstDay.getDay();
    firstDayWeekDay = firstDayWeekDay === 0 ? 7 : firstDayWeekDay;

    var lastDayOfLastMonth = new Date(year, month - 1, 0);
    var lastDateOfLastMonth = lastDayOfLastMonth.getDate();

    var prevMonthDayCount = firstDayWeekDay - 1;
    var lastDay = new Date(year, month, 0);
    var lastDate = lastDay.getDate();

    year = firstDay.getFullYear();
    month = firstDay.getMonth() + 1;

    row = firstDayWeekDay - 1 + lastDate > 28 ? (firstDayWeekDay - 1 + lastDate > 35 ? 6 : 5) : 4;

    for (var i = 0; i < 7 * row; i++) {
      var date = i + 1 - prevMonthDayCount;
      var showDate = date;
      var thisMonth = month;

      if (date <= 0) {
        // 上一个月
        thisMonth = month - 1;
        showDate = lastDateOfLastMonth + date;
      } else if (date > lastDate) {
        thisMonth = month + 1;
        showDate = showDate - lastDate;
      }

      // 上一年
      if (thisMonth === 0) thisMonth = 12;
      // 下一年
      if (thisMonth === 13) thisMonth = 1;

      ret.push({
        month: thisMonth,
        date: date,
        showDate: showDate
      });
    }

    return {
      year: year,
      month: month,
      days: ret
    };
  };

  /**
   * 生成日历 HTML 字符串
   * @param {Node} $wrapper
   * @param {number} year 
   * @param {number} month 
   * @return {string} html
   */
  datepicker.createHTML = function ($wrapper, year, month) {
    year = year || new Date().getFullYear();
    month = month || new Date().getMonth() + 1;
    if (month === 13) {
      year++;
      month = 1
    }
    $wrapper.monthDate = datepicker.getMonthDate(year, month);
    console.log(language);
    var html
    if (language == "en") {
      html = '<div class="ui-datepicker-header">' +
        '<span class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</span>' +
        '<span class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</span>' +
        '<span class="ui-datepicker-curr-month">' + $wrapper.monthDate.year + '-' + $wrapper.monthDate.month + '</span>' +
        '</div>' +
        '<div class="ui-datepicker-body">' +
        '<table>' +
        '<thead>' +
        '<tr>' +
        '<th>Mo</th>' +
        '<th>Tu</th>' +
        '<th>We</th>' +
        '<th>Th</th>' +
        '<th>Fr</th>' +
        '<th>Sa</th>' +
        '<th>Su</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';
    } else {
      html = '<div class="ui-datepicker-header">' +
        '<span class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</span>' +
        '<span class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</span>' +
        '<span class="ui-datepicker-curr-month">' + $wrapper.monthDate.year + '-' + $wrapper.monthDate.month + '</span>' +
        '</div>' +
        '<div class="ui-datepicker-body">' +
        '<table>' +
        '<thead>' +
        '<tr>' +
        '<th>一</th>' +
        '<th>二</th>' +
        '<th>三</th>' +
        '<th>四</th>' +
        '<th>五</th>' +
        '<th>六</th>' +
        '<th>日</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';
    }


    for (var i = 0; i < $wrapper.monthDate.days.length; i++) {
      var date = $wrapper.monthDate.days[i];
      if (i % 7 === 0) {
        html += '<tr>';
      }

      if ($wrapper.monthDate.year === new Date().getFullYear() &&
        $wrapper.monthDate.month === new Date().getMonth() + 1 &&
        $wrapper.monthDate.days[i].showDate === new Date().getDate()) {
        html += '<td class="today" data-date="' + date.date + '">' + date.showDate + '</td>';
      } else if (month === $wrapper.monthDate.days[i].month) {
        html += '<td data-date="' + date.date + '">' + date.showDate + '</td>';
      } else {
        html += '<td class="disabled" data-date="' + date.date + '">' + date.showDate + '</td>';
      }

      if (i % 7 === 6) {
        html += '</tr>';
      }
    }

    html += '</tbody>' +
      '</table>' +
      '</div>';

    return html;
  };

  /**
   * 给日历节点 $wrapper 添加 innerHTML
   * @param {Node} $wrapper
   * @param {string} direction 
   */
  datepicker.render = function ($wrapper, direction) {
    var year = $wrapper.monthDate ? $wrapper.monthDate.year : undefined;
    var month = $wrapper.monthDate ? $wrapper.monthDate.month : undefined;
    if (direction === 'prev') {
      month--;
      if (month === 0) {
        month = 12;
        year--;
      }
    }
    if (direction === 'next') month++;

    var html = datepicker.createHTML($wrapper, year, month);
    $wrapper.innerHTML = html;
  }

  /**
   * 初始化日历 DOM，绑定 $input 点击事件
   * @param {DOMNode} $input
   */
  datepicker.init = function ($input, selectedLanguage = "default") {
    var isOpen = false;
    var $wrapper = document.createElement('div');
    $wrapper.className = 'ui-datepicker-wrapper';
    language = selectedLanguage

    datepicker.render($wrapper);

    // $input 点击事件，显示日历 Node
    $input.addEventListener('click', function () {
      if (isOpen) {
        $wrapper.classList.remove('ui-datepicker-wrapper-show');
        isOpen = false;
      } else {
        $wrapper.classList.add('ui-datepicker-wrapper-show');
        var left = $input.offsetLeft;
        var top = $input.offsetTop;
        var height = $input.offsetHeight;
        $wrapper.style.top = top + height + 2 + 'px';
        $wrapper.style.left = left + 'px';
        isOpen = true;
      }
    }, false);

    // 日历 Dode 点击事件，渲染日历日期
    $wrapper.addEventListener('click', function (e) {
      var $target = e.target;
      if (!$target.classList.contains('ui-datepicker-btn')) {
        return;
      }
      if ($target.classList.contains('ui-datepicker-prev-btn')) {
        datepicker.render($wrapper, 'prev');
      } else if ($target.classList.contains('ui-datepicker-next-btn')) {
        datepicker.render($wrapper, 'next');
      }
    }, false);

    // 日历 Dode 点击事件，获取日期值给 $input.value
    $wrapper.addEventListener('click', function (e) {
      var $target = e.target;
      if ($target.tagName.toLowerCase() !== 'td' || $target.classList.contains('disabled')) return;

      var date = new Date($wrapper.monthDate.year, $wrapper.monthDate.month - 1, $target.dataset.date);

      $input.value = datepicker.format(date);
      $wrapper.classList.remove('ui-datepicker-wrapper-show');
      isOpen = false;
    }, false);

    document.body.appendChild($wrapper);
  };

})();
