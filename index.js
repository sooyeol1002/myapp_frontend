// 회원가입 페이지로 이동
function goToJoinPage() {
  window.location.href = 'signup.html';
}

// 로그인
(() => {
  window.addEventListener("DOMContentLoaded", async () => {
    const loginButton = document.getElementById("loginButton");

    loginButton.addEventListener("click", async () => {
      const name = document.getElementById("name").value;
      const password = document.getElementById("password").value;

      try{
        const response = await fetch("http://127.0.0.1:5500/members");
        const members = await response.json();

        const validMember = members.find(
          (member) => member.name === name && member.password === password
        );
        if (validMember) {
          alert("로그인되었습니다.");
          window.location.href = '/deposit-withdrawal.html';
        } else {
          alert("아이디/비밀번호를 확인해주세요.")
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    });
  });
})();

