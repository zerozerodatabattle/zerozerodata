function nextPage() {
  var input1 = document.getElementById("input1").value;
  var input2 = document.getElementById("input2").value;

  if (!input1 && !input2) {
    // 아이디와 비밀번호를 모두 입력하지 않은 경우
    alert("아이디와 비밀번호를 입력해주세요.");
  } else if (!input1) {
    // 아이디를 입력하지 않은 경우
    alert("아이디를 입력해주세요.");
  } else if (!input2) {
    // 비밀번호를 입력하지 않은 경우
    alert("비밀번호를 입력해주세요.");
  } else {
    // 아이디와 비밀번호를 모두 입력한 경우 메인 페이지로 이동
    window.location.href = "../html/main.html";
  }
}