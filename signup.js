(() => {
const form = document.forms[0];
const inputs = form.querySelectorAll("input");

const name = inputs[0];
const phone = inputs[1];
const email = inputs[2];
const password = inputs[3];

const add = form.querySelector("button");

add.addEventListener("click", async (e) => {
  e.preventDefault();

  if(name.value === "") {
    alert("이름을 입력해주세요.");
    return;
  }
  if(phone.value === "") {
    alert("전화번호를 입력해주세요.");
    return;
  }
  if(email.value === "") {
    alert("이메일을 입력해주세요.");
    return;
  }
  if(password.value === "") {
    alert("비밀번호를 입력해주세요.");
    return;
  }
  try{
  const response = await fetch(
    "http://localhost:8080/members",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: name.value,
        phone: phone.value,
        email: email.value,
        password: password.value,
      }),
    }
  );
  
  if(response.ok) {
    const result = await response.json();
    console.log(result);

    alert("회원 가입이 완료되었습니다!");
    window.location.href = '/index.html';
  } else {
    const errorRe = await response.json();
    alert("회원 가입에 실패했습니다: " + errorRe.message);
  }
} catch (error) {
  console.error("회원 가입 오류:", error);
}
});
})();
