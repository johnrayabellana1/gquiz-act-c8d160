window.onload = () => {
  const notif = localStorage.getItem("notification");
  if (notif) {
    document.getElementById("notifMessage").innerText = notif;
  }
};

function addNotification() {
  const message = "You have a new system alert!";
  localStorage.setItem("notification", message);
  document.getElementById("notifMessage").innerText = message;
}