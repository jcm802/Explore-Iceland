// Fades the flash in and out
const flash = document.querySelector(".bootstrap .fade.show");
if (flash) {
setTimeout(() => { flash.style.opacity = 0; }, 4000);
// Optional Full Remove
setTimeout(() => { flash.style.display = "none"; }, 4200);
}