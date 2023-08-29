$(document).ready(function() {
  calendarInit();
});
/*
  달력 렌더링 할 때 필요한 정보 목록 

  현재 월(초기값 : 현재 시간)
  금월 마지막일 날짜와 요일
  전월 마지막일 날짜와 요일
*/

function calendarInit() {

  // 날짜 정보 가져오기
  const date = new Date(); // 현재 날짜(로컬 기준) 가져오기
  const utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000); // uct 표준시 도출
  const kstGap = 9 * 60 * 60 * 1000; // 한국 kst 기준시간 더하기
  const today = new Date(utc + kstGap); // 한국 시간으로 date 객체 만들기var

  let thisMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // 달력에서 표기하는 날짜 객체

  
  let currentYear = thisMonth.getFullYear(); // 달력에서 표기하는 연
  let currentMonth = thisMonth.getMonth(); // 달력에서 표기하는 월
  let currentDate = thisMonth.getDate(); // 달력에서 표기하는 일

  // kst 기준 현재시간
  // console.log(thisMonth);

  // 캘린더 렌더링
  renderCalender(thisMonth);

  function renderCalender(thisMonth) {

      // 렌더링을 위한 데이터 정리
      currentYear = thisMonth.getFullYear();
      currentMonth = thisMonth.getMonth();
      currentDate = thisMonth.getDate();

      // 이전 달의 마지막 날 날짜와 요일 구하기
      const startDay = new Date(currentYear, currentMonth, 0);
      const prevDate = startDay.getDate();
      const prevDay = startDay.getDay();
      // 이번 달의 마지막날 날짜와 요일 구하기
      const endDay = new Date(currentYear, currentMonth + 1, 0);
      const nextDate = endDay.getDate();
      const nextDay = endDay.getDay();

      // console.log(prevDate, prevDay, nextDate, nextDay);

      // 현재 월 표기
      $('.year-month').text(currentYear + '.' + (currentMonth + 1));

      // 렌더링 html 요소 생성
      calendar = document.querySelector('.dates')
      calendar.innerHTML = '';
      
      // 지난달
      for (let i = prevDate - prevDay + 1; i <= prevDate; i++) {
          calendar.innerHTML = calendar.innerHTML + '<div class="day prev disable">' + i + '</div>'
      }
      // 이번달
      for (let i = 1; i <= nextDate; i++) {
          calendar.innerHTML += `<div class="day current" data-date="${currentYear}-${currentMonth + 1}-${i}">${i}</div>`;

      }
      // 다음달
      for (let i = 1; i <= (7 - nextDay == 7 ? 0 : 7 - nextDay); i++) {
          calendar.innerHTML = calendar.innerHTML + '<div class="day next disable">' + i + '</div>'
      }

      // 오늘 날짜 표기
      if (today.getMonth() == currentMonth) {
          todayDate = today.getDate();
          const currentMonthDate = document.querySelectorAll('.dates .current');
          currentMonthDate[todayDate -1].classList.add('today');
      }

      // 현재 월의 데이터 가져오기
      fetchFinancialData(currentYear, currentMonth + 1).then(data => {
        // 데이터가 있다면 날짜에 표시
        if(data && data.length) {
          const currentMonthDate = document.querySelectorAll('.dates .current');
          data.forEach(item => {
            const itemDate = new Date(item.date[0], item.date[1] - 1, item.date[2]).getDate();
            const el = currentMonthDate[itemDate - 1];
            if(item.deposit === 0 && item.withdraw === 0) {
              el.classList.remove('has-data');
            } else {
              el.classList.add('has-data');
            }
            el.title = `입금: ${item.deposit}, 출금: ${item.withdraw}`;
          });
        }
      });
  }
  function fetchFinancialData(year, month) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `http://localhost:8080/financialHistories/by-month/${year}-${month}`,
        type: 'GET',
        dataType: 'json',
        headers: {
          'Authorization': `Bearer ${getCookie("token")}`
        },
        success: function(data) {
          let totals = {};

          for (let item of data) {
            const dateKey = item.date.join("-");

            if (!totals[dateKey]) {
              totals[dateKey] = { deposit: 0, withdraw: 0 };
            }
            totals[dateKey].deposit += (item.deposit || 0);
            totals[dateKey].withdraw += (item.withdraw || 0);
          }
          for (let dateKey in totals) {
            const dayElement = $(`.day[data-date="${dateKey}"]`);
            const total = totals[dateKey];

            if (total.deposit && total.deposit > 0) {
              dayElement.append(`<span class="deposit">+${total.deposit}</span>`);
            }
            if (total.withdraw && total.withdraw > 0) {
              dayElement.append(`<span class="withdraw">-${total.withdraw}</span>`);
            }
          }
          resolve(data);
        },
        error: function(error) {
          console.error("Error fetching financial data", error);
          reject(error);
        }
      });
    });
  }

  // 이전달로 이동
  $('.go-prev').on('click', function() {
      thisMonth = new Date(currentYear, currentMonth - 1, 1);
      renderCalender(thisMonth);
  });

  // 다음달로 이동
  $('.go-next').on('click', function() {
      thisMonth = new Date(currentYear, currentMonth + 1, 1);
      renderCalender(thisMonth); 
  });
}

// 입/출금 페이지로 이동
function goToManagePage() {
    window.location.href = 'deposit-withdrawal.html';
  }

// 차트 페이지로 이동
function goToChartPage() {
    window.location.href = 'chart.html';
  }

  // 쿠키 값 가져오기 함수
function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}