let totalDeposit = 0;
let totalWithdraw = 0;

let recentMonthDeposit = 0;
let recentMonthWithdraw = 0;
let lastMonthDeposit = 0;
let lastMonthWithdraw = 0;

// 데이터를 가져와 차트를 업데이트하는 함수
async function fetchDataAndUpdateChart() {
  const token = getCookie("token");

  // 백엔드에서 데이터 가져오기
  const response = await fetch("http://localhost:8080/financialHistories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    console.log("Received data from server:", data);

    totalDeposit = 0;
    totalWithdraw = 0;

    let largestDepositWeek = "";
    let largestDepositBalance = 0;

    let largestWithdrawWeek = "";
    let largestWithdrawBalance = 0;

    let depositMonthCount = {};
    let withdrawMonthCount = {};

    data.forEach((item) => {
      const month = item.date[1];

      if(!depositMonthCount[month]) depositMonthCount[month] = 0;
      if(!withdrawMonthCount[month]) withdrawMonthCount[month] = 0;

      depositMonthCount[month] += 1;
      withdrawMonthCount[month] += 1;
    });

    let recentMonths = [];

    const depositAmountsByMonth = new Array(12).fill(0);
    const withdrawAmountsByMonth = new Array(12).fill(0);

    const depositMap = {};
    const withdrawMap = {};

    const usedWeekLabels = new Set();

    function calculateWeekIndex(year, month, day) {
      const date = new Date(year, month - 1, day);  // month - 1 because JavaScript month index starts from 0
      const firstDayOfMonth = new Date(year, month - 1, 1);
      let week;
      
      // 일요일이 주의 시작이므로 dayOfWeek는 0
      const dayOfWeek = date.getDay();
      
      // 해당 달의 첫 주의 일요일을 찾기
      let firstSunday = firstDayOfMonth;
      while (firstSunday.getDay() !== 0) {
        firstSunday.setDate(firstSunday.getDate() + 1);
      }
      
      // 첫 주의 일요일을 기준으로 주차 계산
      week = Math.ceil((day - firstSunday.getDate() + 1) / 7) + 1;
      
      return week;
    }

    data.forEach((item) => {
      const year = item.date[0];
      const month = item.date[1];
      const day = item.date[2];

      const week = calculateWeekIndex(year, month, day);
      const label = `${month}월 ${week}주차`;

      if (!depositMap[label]) depositMap[label] = 0;
      if (!withdrawMap[label]) withdrawMap[label] = 0;

      depositMap[label] += item.deposit;
      withdrawMap[label] += item.withdraw;

      if (depositMap[label] > largestDepositBalance) {
        largestDepositBalance = depositMap[label];
        largestDepositWeek = label;
      }

      if (withdrawMap[label] > largestWithdrawBalance) {
        largestWithdrawBalance = withdrawMap[label];
        largestWithdrawWeek = label;
      }

      usedWeekLabels.add(`${month}월 ${week}주차`);
    })

    data.forEach((item) => {
      const month = item.date[1] -1;

      totalDeposit += item.deposit;
      totalWithdraw += item.withdraw;

      depositAmountsByMonth[month] += item.deposit;
      withdrawAmountsByMonth[month] += item.withdraw;
    });

    data.forEach((item) => {
      const month = item.date[1];
      if (!recentMonths.includes(month)) {
        recentMonths.push(month);
      }
    });

    recentMonths.sort((a, b) => b - a);
    recentMonths = recentMonths.slice(0, 2);

    data.forEach((item) => {
      const month = item.date[1];
      if (month === recentMonths[0]) {
        recentMonthDeposit += item.deposit;
        recentMonthWithdraw += item.withdraw;
      } else if (month === recentMonths[1]) {
        lastMonthDeposit += item.deposit;
        lastMonthWithdraw += item.withdraw;
      }
    });

    const sortedLabels = Array.from(usedWeekLabels).sort((a, b) => {
      const [monthA, weekA] = a.match(/\d+/g).map(Number);
      const [monthB, weekB] = b.match(/\d+/g).map(Number);
      return monthA !== monthB ? monthA - monthB : weekA - weekB;
    })

    lineData.labels = Array.from(usedWeekLabels).sort();

    barData.datasets[0].data = depositAmountsByMonth;
    barData.datasets[1].data = withdrawAmountsByMonth;

    myLineChart.data.datasets[0].data = sortedLabels.map(label => depositMap[label] || 0);
    myLineChart.data.datasets[1].data = sortedLabels.map(label => withdrawMap[label] || 0);

    console.log("Updated chart data:", barData, lineData);

    // 차트 업데이트
    myBarChart.update();
    myLineChart.update();

    console.log("Charts updated.");
    showTotalBalance(depositMonthCount, withdrawMonthCount, largestDepositWeek, largestWithdrawWeek, depositAmountsByMonth, withdrawAmountsByMonth);
  } else {
    console.error("Failed to fetch data. Status code:", response.status);
  }
}

async function showTotalBalance(depositMonthCount, withdrawMonthCount, largestDepositWeek, largestWithdrawWeek, depositAmountsByMonth, withdrawAmountsByMonth) {
  const userName = await fetchUserName();
  const summaryElement = document.getElementById('summary');
  if (summaryElement) {
    let depositAverageText = "";
    let withdrawAverageText = "";

    for (const month in depositMonthCount) {
      const average = (depositAmountsByMonth[month - 1] / depositMonthCount[month]).toFixed(1);
      depositAverageText += `${month}월 주간 평균 입금액: ${average}원<br>`;
    }

    for (const month in withdrawMonthCount) {
      const average = (withdrawAmountsByMonth[month - 1] / withdrawMonthCount[month]).toFixed(1);
      withdrawAverageText += `${month}월 주간 평균 출금액: ${average}원<br>`;
    }

    summaryElement.innerHTML = `${userName}님의 통계 <br>
    총 입금액은: ${totalDeposit}원 입니다.<br>
    총 출금액은: ${totalWithdraw}원 입니다.<br>
    가장 큰 입금량이 있던 주: ${largestDepositWeek}<br>
    가장 큰 출금량이 있던 주: ${largestWithdrawWeek}<br>
    ${depositAverageText}<br>
    ${withdrawAverageText}`;
  }
}

// 바 차트 데이터
const barData = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  datasets: [{
    label: '입금액',
    data: [],
    fill: true,
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgb(255, 99, 132)',
    pointBackgroundColor: 'rgb(255, 99, 132)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(255, 99, 132)'
  }, {
    label: '출금액',
    data: [],
    fill: true,
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgb(54, 162, 235)',
    pointBackgroundColor: 'rgb(54, 162, 235)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(54, 162, 235)'
  }]
};

// 바 차트 설정
const barOptions = {
  maintainAspectRatio: false,
  responsive: true,
};

// 바 차트 생성
const ctx = document.getElementById('myBarChart').getContext('2d');
const myBarChart = new Chart(ctx, {
  type: 'bar',
  data: barData,
  options: barOptions
});

// 라인 차트 데이터
const lineData = {
  labels: [],
  datasets: [{
    label: '입금액',
    data: [],
    fill: true,
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgb(255, 99, 132)',
    pointBackgroundColor: 'rgb(255, 99, 132)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(255, 99, 132)'
  }, {
    label: '출금액',
    data: [],
    fill: true,
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgb(54, 162, 235)',
    pointBackgroundColor: 'rgb(54, 162, 235)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(54, 162, 235)'
  }]
};

// 라인 차트 설정
const lineOptions = {
  maintainAspectRatio: false,
  responsive: true,
};

// 라인 차트 생성
const chartLine = document.getElementById('myLineChart').getContext('2d');
const myLineChart = new Chart(chartLine, {
  type: 'line',
  data: lineData,
  options: lineOptions
});

// 입/출금 페이지로 이동
function goToManagePage() {
  window.location.href = 'deposit-withdrawal.html';
}

// 캘린더 페이지로 이동
function goToCalendarPage() {
  window.location.href = 'calendar.html';
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

// 페이지 로딩 시 데이터를 불러와 차트를 업데이트(이름도)
window.onload = function() {
  fetchDataAndUpdateChart();
  showUserName();
};

// 이름 가져오기
async function fetchUserName() {
  const token = getCookie("token");
  const response = await fetch("http://localhost:8080/financialHistories/getName", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
    const userNameElement = document.getElementById('name');
    if (userNameElement) {
    userNameElement.textContent = `${userName}님의 차트 페이지입니다.`;
  } 
}

// 쿠키 삭제
function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// 로그아웃 버튼 이벤트
document.addEventListener("DOMContentLoaded", function() {
  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", function() {
    deleteCookie("token");
    window.location.href = "/index.html";
  });
});