// 월, 일 반복문/ 셀렉티드

document.addEventListener("DOMContentLoaded", function() {
  const monthDropdown = document.getElementById("monthDropdown");

  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.text = i + "월";
    option.value = i < 10 ? "0" + i : "" + i;
    monthDropdown.add(option);
  }
  monthDropdown.value = "08";

  monthDropdown.addEventListener("change", function() {
    const selectedOption = monthDropdown.options[monthDropdown.selectedIndex];
    selectedOption.selected = true;
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const dayDropdown = document.getElementById("dayDropdown");

  for (let j = 1; j <= 31; j++) {
    const option = document.createElement("option");
    option.text = j + "일";
    option.value = j < 10 ? "0" + j : "" + j;
    dayDropdown.add(option);
  }
  dayDropdown.value = "09";

  dayDropdown.addEventListener("change", function() {
    const selectedOption = dayDropdown.options[dayDropdown.selectedIndex];
    selectedOption.selected = true;
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const monthDropdown1 = document.getElementById("monthDropdown1");

  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.text = i + "월";
    option.value = i < 10 ? "0" + i : "" + i;
    monthDropdown1.add(option);
  }
  monthDropdown1.value = "08";

  monthDropdown1.addEventListener("change", function() {
    const selectedOption = monthDropdown1.options[monthDropdown1.selectedIndex];
    selectedOption.selected = true;
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const dayDropdown1 = document.getElementById("dayDropdown1");

  for (let j = 1; j <= 31; j++) {
    const option = document.createElement("option");
    option.text = j + "일";
    option.value = j < 10 ? "0" + j : "" + j;
    dayDropdown1.add(option);
  }
  dayDropdown1.value = "09";

  dayDropdown1.addEventListener("change", function() {
    const selectedOption = dayDropdown1.options[dayDropdown1.selectedIndex];
    selectedOption.selected = true;
  });
});

// 캘린더 페이지로 이동
function goToCalenderPage() {
  window.location.href = 'project4.html';
}