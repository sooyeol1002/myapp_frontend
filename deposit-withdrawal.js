document.addEventListener("DOMContentLoaded", function () {
  // 입금-월-for문-셀렉티드
  const monthDropdown = document.getElementById("monthDropdown");
  const defaultMonthOption = document.createElement("option");
  defaultMonthOption.text = "월을 선택하세요.";
  defaultMonthOption.value = "";
  defaultMonthOption.selected = true;
  defaultMonthOption.disabled = true;
  monthDropdown.add(defaultMonthOption);

  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.text = i + "월";
    option.value = i < 10 ? "0" + i : "" + i;
    monthDropdown.add(option);
  }

  monthDropdown.addEventListener("change", function () {
    const selectedOption = monthDropdown.options[monthDropdown.selectedIndex];
    selectedOption.selected = true;
  });

  // 입금-일-for문-셀렉티드
  const dayDropdown = document.getElementById("dayDropdown");
  const defaultDayOption = document.createElement("option");
  defaultDayOption.text = "일을 선택하세요";
  defaultDayOption.value = "";
  defaultDayOption.selected = true;
  defaultDayOption.disabled = true;
  dayDropdown.add(defaultDayOption);

  for (let j = 1; j <= 31; j++) {
    const option = document.createElement("option");
    option.text = j + "일";
    option.value = j < 10 ? "0" + j : "" + j;
    dayDropdown.add(option);
  }

  dayDropdown.addEventListener("change", function () {
    const selectedOption = dayDropdown.options[dayDropdown.selectedIndex];
    selectedOption.selected = true;
  });

  // 입금 서버전송
  const depositButton = document.getElementById("depositButton");
  depositButton.addEventListener("click", async () => {
    try {
      const year = document.getElementById("yearSelect").value;
      const month = document.getElementById("monthDropdown").value;
      const day = document.getElementById("dayDropdown").value;

      const balance = parseFloat(
        document.getElementById("depositBalance").value
      );
      const depositInput = document.getElementById("depositBalance");
      const deposit = parseFloat(depositInput.value);
      const depositRequest = {
        selectedDate: `${year}-${month}-${day}`,
        deposit: deposit,
        balance: balance,
      };
      console.log(depositRequest);

      const response = await fetch(
        "http://localhost:8080/financialHistories/deposit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
          body: JSON.stringify(depositRequest),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert("입금이 완료되었습니다.");
        console.log(result);
        document.getElementById("depositBalance").value = "";
      } else {
        const error = await response.json();
        alert("입금에 실패했습니다: " + error.message);
      }
    } catch (error) {
      console.error("Error depositing:", error);
    }
  });

  // 출금-월-for문-셀렉티드
  const monthDropdown1 = document.getElementById("monthDropdown1");
  const defaultMonthOption1 = document.createElement("option");
  defaultMonthOption1.text = "월을 선택하세요";
  defaultMonthOption1.value = "";
  defaultMonthOption1.selected = true;
  defaultMonthOption1.disabled = true;
  monthDropdown1.add(defaultMonthOption1);

  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.text = i + "월";
    option.value = i < 10 ? "0" + i : "" + i;
    monthDropdown1.add(option);
  }

  monthDropdown1.addEventListener("change", function () {
    const selectedOption = monthDropdown1.options[monthDropdown1.selectedIndex];
    selectedOption.selected = true;
  });

  // 출금-일-for문-셀렉티드
  const dayDropdown1 = document.getElementById("dayDropdown1");
  const defaultDayOption1  = document.createElement("option");
  defaultDayOption1.text = "일을 선택하세요";
  defaultDayOption1.value = "";
  defaultDayOption1.selected = true;
  defaultDayOption1.disabled = true;
  dayDropdown1.add(defaultDayOption1);

  for (let j = 1; j <= 31; j++) {
    const option = document.createElement("option");
    option.text = j + "일";
    option.value = j < 10 ? "0" + j : "" + j;
    dayDropdown1.add(option);
  }

  dayDropdown1.addEventListener("change", function () {
    const selectedOption = dayDropdown1.options[dayDropdown1.selectedIndex];
    selectedOption.selected = true;
  });

  // 출금 서버전송
  const withdrawButton = document.getElementById("withdrawButton");
  withdrawButton.addEventListener("click", async () => {
    try {
    const year = document.getElementById("yearSelect").value;
    const month = document.getElementById("monthDropdown1").value;
    const day = document.getElementById("dayDropdown1").value;
    const balance = parseFloat(
      document.getElementById("withdrawBalance").value
    );
    const withdrawInput = document.getElementById("withdrawBalance");
    const withdraw = parseFloat(withdrawInput.value);

    const withdrawRequest = {
      selectedDate: `${year}-${month}-${day}`,
      withdraw: withdraw,
      balance: -balance,
    };
    console.log(withdrawRequest);

      const response = await fetch(
        "http://localhost:8080/financialHistories/withdraw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
          body: JSON.stringify(withdrawRequest),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert("출금이 완료되었습니다.");
        console.log(result);
        document.getElementById("withdrawBalance").value = "";
      } else {
        const error = await response.json();
        alert("출금에 실패했습니다: " + error.message);
      }
    } catch (error) {
      console.error("Error withdrawing:", error);
    }
  });
});

// 캘린더 페이지로 이동
function goToCalendarPage() {
  window.location.href = "calendar.html";
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
    userNameElement.textContent = `${userName}님, 환영합니다.`;
  } 
}


window.onload = function() {
  showUserName();
}
