document.addEventListener("DOMContentLoaded", function() {
  // 입금-월-for문-셀렉티드
  const monthDropdown = document.getElementById("monthDropdown");
  for(let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.text = i + "월";
    option.value = i< 10 ? "0" + i : "" + i;
    monthDropdown.add(option);
  }
  monthDropdown.value = "08";

  monthDropdown.addEventListener("change", function() {
    const selectedOption = monthDropdown.options[monthDropdown.selectedIndex];
    selectedOption.selected = true;
  })

  // 입금-일-for문-셀렉티드
  const dayDropdown = document.getElementById("dayDropdown");
  for(let j = 1; j <= 31; j++) {
    const option = document.createElement("option");
    option.text = j + "일";
    option.value = j < 10 ? "0" + j : "" + j;
    dayDropdown.add(option);
  }

  dayDropdown.value = "08";

  dayDropdown.addEventListener("change", function() {
    const selectedOption = dayDropdown.options[dayDropdown.selectedIndex];
    selectedOption.selected = true;
  })

  // 서버전송
  const depositButton = document.getElementById("depositButton");
  depositButton.addEventListener("click", async () => {
    const year = document.getElementById("yearSelect").value;
    const month = document.getElementById("monthDropdown").value;
    const day = document.getElementById("dayDropdown").value;
    const balance = parseFloat(document.getElementById("depositBalance").value);

    const data = {
      date: `${year}-${month}-${day}`,
      deposit: balance,
      withdraw: 0,
      balance: balance,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/financialHistories/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert("입금이 완료되었습니다.");
        console.log(result);
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

  // 출금-일-for문-셀렉티드
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

  // 서버전송
  const withdrawButton = document.getElementById("withdrawButton");
  withdrawButton.addEventListener("click", async () => {
    const year = document.getElementById("yearSelect").value;
    const month = document.getElementById("monthDropdown1").value;
    const day = document.getElementById("dayDropdown1").value;
    const balance = parseFloat(document.getElementById("withdrawBalance").value);

    const data = {
      date: `${year}-${month}-${day}`,
      deposit: 0,
      withdraw: balance,
      balance: - balance
    };

    try {
      const response = await fetch("http://localhost:8080/financialHistories/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        alert("출금이 완료되었습니다.");
        console.log(result);
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
function goToCalenderPage() {
  window.location.href = 'calender.html';
}