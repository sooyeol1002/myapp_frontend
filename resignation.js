(() => {
  window.addEventListener(
    "DOMContentLoaded",
    async () => {
      const response = await fetch(
        "http://localhost:8080/members"
      );
    }
  );
})();

function btnResign() {
  const button = 
  document.forms[1].querySelectorAll("button");
}