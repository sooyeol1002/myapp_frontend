// 회원가입 페이지로 이동
function goToJoinPage() {
  window.location.href = 'signup.html';
}

// 폼 제출 이벤트 처리
document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("login");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // 기본 제출 동작 막기

    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    // 로그인 요청 보내는 코드 등...
    const url = `http://localhost:8080/auth/login`;
    const response = await fetch(url, {
      headers: {
        Autorization: `Bearer ${getCookie(
          "token"
        )}`,
      },
      body: JSON.stringify({ name, password }), // 로그인 요청 데이터
    });

    if (response.ok) {
      const responseData = await response.json();
      const token = responseData.token;
      alert("로그인되었습니다.");
      window.location.href = '/deposit-withdrawal.html'; // 로그인 성공 시 페이지 이동
    } else {
      alert("아이디/비밀번호를 확인해주세요.");
    }
  });
});

// 로그인 버튼 클릭 이벤트 처리
document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("loginButton");

  loginButton.addEventListener("click", () => {
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    // 아이디와 비밀번호가 입력되지 않은 경우
    if (!name || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
    }
  });
});

// 인증토큰이 없으면 로그인 페이지로 튕김
(() => {
  const token = getCookie("token");
  console.log(token);
})();

// 쿠키 값 가져오기 함수
function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(
          /([\.$?*|{}\(\)\[\]\\\/\+^])/g,
          "\\$1"
        ) +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
