// 레이더 차트 데이터
const barData = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  datasets: [{
    label: '입금액',
    data: [317, 478, 141, 355, 475, 416, 174, 248, 367, 123, 460, 50],
    fill: true,
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgb(255, 99, 132)',
    pointBackgroundColor: 'rgb(255, 99, 132)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(255, 99, 132)'
  }, {
    label: '출금액',
    data: [172, 456, 39, 288, 184, 92, 309, 21, 429, 383, 102, 248],
    fill: true,
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgb(54, 162, 235)',
    pointBackgroundColor: 'rgb(54, 162, 235)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(54, 162, 235)'
  }]
};

// 레이더 차트 설정
const barOptions = {
  maintainAspectRatio: false,
  responsive: true,
};

// 레이더 차트 생성
const ctx = document.getElementById('myBarChart').getContext('2d');
const myBarChart = new Chart(ctx, {
  type: 'bar',
  data: barData,
  options: barOptions
});

// 라인 차트 데이터
const lineData = {
  labels: ['7월 1주차', '7월 2주차', '7월 3주차', '7월 4주차', '7월 5주차', 
  '8월 1주차', '8월 2주차', '8월 3주차', '8월 4주차', '8월 5주차', 
  '9월 1주차', '9월 2주차', '9월 3주차', '9월 4주차', '9월 5주차'],
  datasets: [{
    label: '입금액',
    data: [385, 249, 88, 212, 460, 173, 407, 437, 300, 47, 156, 365, 399, 55, 491],
    fill: true,backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgb(255, 99, 132)',
    pointBackgroundColor: 'rgb(255, 99, 132)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(255, 99, 132)'
  }, {
    label: '출금액',
    data: [34, 269, 138, 84, 124, 464, 278, 228, 472, 411, 490, 366, 27, 152, 440],
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
  window.location.href = 'project3.html';
}

// 캘린더 페이지로 이동
function goToCalenderPage() {
  window.location.href = 'project4.html';
}