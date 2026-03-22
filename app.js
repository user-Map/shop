function login() {
  localStorage.setItem("login", "true");
  localStorage.setItem("name", "NguyenKhoi Dev");
  location.reload();
}

function logout() {
  localStorage.removeItem("login");
  location.reload();
}

if (localStorage.getItem("login")) {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("app").style.display = "block";

  document.getElementById("name").innerText =
    localStorage.getItem("name");

  // fake tiền
  document.getElementById("money").innerText = "1000";
}
