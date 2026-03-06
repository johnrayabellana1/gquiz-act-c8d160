window.onload = () => {
  const savedName = localStorage.getItem("username");
  if (savedName) {
    document.getElementById("displayName").innerText = savedName;
  }
};

function saveProfile() {
  const name = document.getElementById("nameInput").value;
  localStorage.setItem("username", name);
  document.getElementById("displayName").innerText = name;
}

function logout() {
  localStorage.clear();
  alert("Logged out successfully");
  location.reload();
}