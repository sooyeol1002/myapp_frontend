// 회원가입 페이지로 이동
function goToJoinPage() {
  window.location.href = 'signup.html';
}

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
  return matches
    ? decodeURIComponent(matches[1])
    : undefined;
}

// 인증토큰이 없으면 로그인페이지로 튕김
(() => {
  const token = getCookie("token");
  console.log(token);
})();

import { saveToken } from './tokenUtils.js';

// 로그인
(() => {
  window.addEventListener("DOMContentLoaded", async () => {
    const loginButton = document.getElementById("loginButton");

    loginButton.addEventListener("click", async () => {
      let url = `http://localhost:8080/auth/login`
      const name = document.getElementById("name").value;
      const password = document.getElementById("password").value;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${getCookie(
            "token"
          )}`,
        },
      });

        if (response.ok) {
          const responseData = await response.json();
          const token = responseData.token;

          saveToken(token);
          alert("로그인되었습니다.");
          window.location.href = '/deposit-withdrawal.html';
        } else {
          alert("아이디/비밀번호를 확인해주세요.")
        }
    });
  });
})();

