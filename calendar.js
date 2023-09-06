$(document).ready(function () {
  calendarInit();
});

function calendarInit() {
  // 날짜 정보 가져오기
  const date = new Date(); // 현재 날짜(로컬 기준) 가져오기
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000; // uct 표준시 도출
  const kstGap = 9 * 60 * 60 * 1000; // 한국 kst 기준시간 더하기
  const today = new Date(utc + kstGap); // 한국 시간으로 date 객체 만들기var

  let thisMonth = new Date();
  // 달력에서 표기하는 날짜 객체

  let currentYear = thisMonth.getFullYear(); // 달력에서 표기하는 연
  let currentMonth = thisMonth.getMonth(); // 달력에서 표기하는 월
  let currentDate = thisMonth.getDate(); // 달력에서 표기하는 일

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
    const prevDay = startDay.getDay() + 1;
    // 이번 달의 마지막날 날짜와 요일 구하기
    const endDay = new Date(currentYear, currentMonth + 1, 0);
    const nextDate = endDay.getDate();
    const nextDay = endDay.getDay() + 1;

    // 현재 월 표기
    $(".year-month").text(currentYear + "." + (currentMonth + 1));

    // 렌더링 html 요소 생성
    calendar = document.querySelector(".dates");
    calendar.innerHTML = "";

    // 지난달
    for (let i = prevDate - prevDay + 1; i <= prevDate; i++) {
      calendar.innerHTML =
        calendar.innerHTML + '<div class="day prev disable">' + i + "</div>";
    }
    // 이번달
    for (let i = 1; i <= nextDate; i++) {
      const dateElement = document.createElement("div");
      dateElement.className = "day current";
      dateElement.dataset.date = `${currentYear}-${currentMonth + 1}-${i}`;
      dateElement.textContent = i;

      // console.log(`${i} 일에 이벤트 리스너 추가`);

      calendar.appendChild(dateElement);
    }

    // 다음달
    for (let i = 1; i <= (7 - nextDay == 7 ? 0 : 7 - nextDay); i++) {
      calendar.innerHTML =
        calendar.innerHTML + '<div class="day next disable">' + i + "</div>";
    }

    // 오늘 날짜 표기
    if (today.getMonth() == currentMonth) {
      todayDate = today.getDate();
      const currentMonthDate = document.querySelectorAll(".dates .current");
      currentMonthDate[todayDate - 1].classList.add("today");
    }

    // 현재 월의 데이터 가져오기
    fetchFinancialData(currentYear, currentMonth + 1).then((data) => {
      // 데이터가 있다면 날짜에 표시
      if (data && data.length) {
        const currentMonthDate = document.querySelectorAll(".dates .current");
        data.forEach((item) => {
          const itemDate = new Date(
            item.date[0],
            item.date[1] - 1,
            item.date[2]
          ).getDate();
          const el = currentMonthDate[itemDate - 1];
          if (item.deposit === 0 && item.withdraw === 0) {
            el.classList.remove("has-data");
          } else {
            el.classList.add("has-data");
          }
          el.title = `입금: ${item.deposit}, 출금: ${item.withdraw}`;
        });
      }
      rebindClickEvent();
    });

    // 금융기록 가져오기
    function fetchFinancialData(year, month) {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: `http://localhost:8080/financialHistories/by-month/${year}-${month}`,
          type: "GET",
          dataType: "json",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
          success: function (data) {
            let totals = {};

            for (let item of data) {
              const dateKey = item.date.join("-");

              if (!totals[dateKey]) {
                totals[dateKey] = { deposit: 0, withdraw: 0 };
              }
              totals[dateKey].deposit += item.deposit || 0;
              totals[dateKey].withdraw += item.withdraw || 0;
            }
            for (let dateKey in totals) {
              const dayElement = $(`.day[data-date="${dateKey}"]`);
              const total = totals[dateKey];

              if (total.deposit && total.deposit > 0) {
                dayElement.append(
                  `<span class="deposit">+${total.deposit}</span>`
                );
              }
              if (total.withdraw && total.withdraw > 0) {
                dayElement.append(
                  `<span class="withdraw">-${total.withdraw}</span>`
                );
              }
            }
            resolve(data);
          },
          error: function (error) {
            console.error("Error fetching financial data", error);
            reject(error);
          },
        });
      });
    }

    // 날짜를 두 자릿수로 포매팅하기
    function formatDate(date) {
      const d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      const paddedMonth = month.length < 2 ? "0" + month : month;
      const paddedDay = day.length < 2 ? "0" + day : day;

      return [year, paddedMonth, paddedDay].join("-");
    }

    // 특정 날짜의 금융기록 가져오기
    function fetchFinancialDataByDate(date) {
      return new Promise((resolve, reject) => {
        const formattedDate = formatDate(date);
        if (typeof date === "string") {
          date = new Date(date);
        }
        $.ajax({
          url: `http://localhost:8080/financialHistories/by-date/${formattedDate}`,
          type: "GET",
          crossDomain: true,
          dataType: "json",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
          success: function (data) {
            resolve(data);
          },
          error: function (error) {
            console.error("Error fetching financial data", error);
            reject(error);
          },
        });
      });
    }

    // 특정 날짜의 금융기록 수정하기
    function updateFinancialData(id, date, newDeposit, newWithdraw) {
      const formattedDate = formatDateToTwoDigits(date);
      return new Promise((resolve, reject) => {
        $.ajax({
          url: `http://localhost:8080/financialHistories/update/${id}/${formattedDate}`,
          type: "PUT",
          dataType: "json",
          contentType: "application/json",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
          data: JSON.stringify({
            date: formattedDate,
            deposit: newDeposit,
            withdraw: newWithdraw,
            id: id
          }),
          success: function (response) {
            resolve(response);
          },
          error: function (error) {
            console.error("Error updating financial data", error);
            reject(error);
          },
        });
      });
    }

    // 특정 날짜의 금융기록 삭제하기
    function deleteFinancialData(date) {
      const formattedDate = formatDateToTwoDigits(date);
      return new Promise((resolve, reject) => {
        $.ajax({
          url: `http://localhost:8080/financialHistories/delete/${formattedDate}`,
          type: "DELETE",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
          success: function (response) {
            resolve(response);
          },
          error: function (error) {
            console.error("Error deleting financial data", error);
            reject(error);
          },
        });
      });
    }

    function rebindClickEvent() {
      const currentMonthDate = document.querySelectorAll(".dates .current");
      currentMonthDate.forEach((el) => {
        el.removeEventListener("click", handleDateclickEvent);
        el.addEventListener("click", handleDateclickEvent);
      });
    }

    function formatDateToTwoDigits(dateString) {
      const [year, month, day] = dateString.split("-");
      const paddedMonth = month.padStart(2, "0");
      const paddedDay = day.padStart(2, "0");
      return `${year}-${paddedMonth}-${paddedDay}`;
    }

    // 클릭한 날짜 처리
    function handleDateclick(clickedDate, id) {
      console.log(`Clicked date is ${clickedDate}`);
      const formattedDate = formatDateToTwoDigits(clickedDate);
      fetchFinancialDataByDate(formattedDate).then((data) => {
        if (data && data.length > 0) {
          const id = data[0].id;
          const action = prompt(
            "원하시는 기능에 해당하는 숫자를 입력해주세요. (1: 수정, 2: 삭제, 3: 취소)",
            "1, 2, 3"
          );
          switch (action) {
            // 수정
            case "1":
              const newDeposit = prompt(
                "새로운 입금액을 입력하세요:",
                data[0].deposit
              );
              const newWithdraw = prompt(
                "새로운 출금액을 입력하세요:",
                data[0].withdraw
              );
              updateFinancialData(
                id,
                clickedDate,
                newDeposit,
                newWithdraw
              ).then(() => {
                renderCalender(thisMonth);
              });
              break;
            case "2":
              const confirmDelete = confirm("이 데이터를 삭제하시겠습니까?");
              if (confirmDelete) {
                deleteFinancialData(clickedDate).then(() => {
                  renderCalender(thisMonth);
                });
              }
              break;
            default:
              break;
          }
        } else {
          alert("수정/삭제할 데이터가 없습니다.");
        }
      });
    }

    function handleDateclickEvent(e) {
      handleDateclick(e.currentTarget.dataset.date);
    }
  }

  // 이전달로 이동
  $(".go-prev").on("click", function () {
    thisMonth = new Date(currentYear, currentMonth - 1, 1);
    renderCalender(thisMonth);
  });

  // 다음달로 이동
  $(".go-next").on("click", function () {
    thisMonth = new Date(currentYear, currentMonth + 1, 1);
    renderCalender(thisMonth);
  });
}

// 입/출금 페이지로 이동
function goToManagePage() {
  window.location.href = "deposit-withdrawal.html";
}

// 차트 페이지로 이동
function goToChartPage() {
  window.location.href = "chart.html";
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

// 이름 가져오기
async function fetchUserName() {
  const token = getCookie("token");
  const response = await fetch(
    "http://localhost:8080/financialHistories/getName",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.ok) {
    const data = await response.json();
    return data.name;
  } else {
    console.error("Failed to fetch name. Status code:", response.status);
    return null;
  }
}

// 이름 보여주기
async function showUserName() {
  const userName = await fetchUserName();
  const userNameElement = document.getElementById("name");
  if (userNameElement) {
    userNameElement.textContent = `${userName}님의 캘린더 페이지입니다.`;
  }
}

window.onload = function () {
  showUserName();
};

// 쿠키 삭제
function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// 로그아웃 버튼 이벤트
document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", function () {
    deleteCookie("token");
    window.location.href = "/index.html";
  });
});
