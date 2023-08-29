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

    const depositAmountsByMonth = new Array(12).fill(0);
    const withdrawAmountsByMonth = new Array(12).fill(0);

    const depositMap = {};
    const withdrawMap = {};
    const usedWeekLabels = new Set();

    // function getLastWeekOfMonth(year, month) {
    //   const lastDay = new Date(year, month, 0).getDate();
    //   const date = new Date(year, month - 1, lastDay);
    //   const dayOfWeek = date.getDay();
    //   return Math.floor((lastDay + 6 - dayOfWeek) / 7);
    // }

    function calculateWeekIndex(year, month, day) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      
      const firstDayOfMonth = new Date(year, month -1, 1).getDay();
      const lastDayOfMonth = new Date(year, month - 1, new Date(year, month, 0).getDate()).getDay();

      let firstSaturday = 6 -firstDayOfMonth + 1;
      if (day <= firstSaturday) {
        return 1;
      }

      let week = Math.ceil((day - firstSaturday) / 7) + 1;

      if (lastDayOfMonth === 0) {
        week += 1;
      }
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

      usedWeekLabels.add(`${month}월 ${week}주차`);
    })

    data.forEach((item) => {
      const month = item.date[1] -1;
      depositAmountsByMonth[month] += item.deposit;
      withdrawAmountsByMonth[month] += item.withdraw;
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
  } else {
    console.error("Failed to fetch data. Status code:", response.status);
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

// 페이지 로딩 시 데이터를 불러와 차트를 업데이트
window.onload = function() {
  fetchDataAndUpdateChart();
};
