// 회원가입 페이지로 이동
function goToJoinPage() {
  window.location.href = 'signup.html';
}
const params = new URLSearchParams(
  window.location.search
);
if (params.get("err")) {
  document.querySelector("#err").innerHTML = 
  params.get("err");
  history.replaceState(
    null,
    null,
    "http://localhost:5500/index.html"
  );
}
const btn = document.forms[0].querySelector("button");
btn.addEventListener("click", async (e) => {
  e.preventDefault();

  const nameInput = document.forms[0].querySelectorAll("input")[0];
  const passwordInput = document.forms[0].querySelectorAll("input")[1];
  if (!nameInput.value) {
    alert("사용자 이름을 입력해주세요.");
    return;
  }

  if (!passwordInput.value) {
    alert("비밀번호를 입력해주세요.");
    return;
  }
  document.forms[0].submit();
});


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
(() => {
  const token = getCookie("token");
  console.log(token)
  if (token) {
    window.location.href = `deposit-withdrawal.html`;
  };
})();