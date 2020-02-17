const REFRESH_TIME = 30;
var i = REFRESH_TIME;
let countdownBox = document.querySelector("#countdown");
window.setInterval(() => {
    countdownBox.innerHTML = `Rafraîchissement des résultats dans ${i} seconde${i > 1 ? "s" : ""}`;
    if (i <= 1) {
        location.reload();
    }
    i--;
}, 1000);
