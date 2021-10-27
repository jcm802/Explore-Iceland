// ==========================
// Work In Progress Functions - For checking if description overflows, if so, show an arrow indicating to user they can scroll
// ==========================
// const checkOverflow = () => {
//     const el = document.body.querySelector(".things-to-do-details-description");
//     const curOverflow = el.style.overflow;

//     if ( !curOverflow || curOverflow === "visible" )
//         el.style.overflow = "hidden";

//     const isOverflowing = el.clientWidth < el.scrollWidth 
//         || el.clientHeight < el.scrollHeight;

//     el.style.overflow = curOverflow;

//     return isOverflowing;
// }

// Check the if the text is overflowing, if it is show the arrow on load
// const isOverflown = () => {
//     const box = document.body.querySelector(".things-to-do-details-description");
//     const arrow = document.body.querySelector(".scroll-down");
//     if(box.scrollHeight > box.clientHeight || box.scrollWidth > box.clientWidth){
//         arrow.style.visibility = "visible";
//     } else {
//         arrow.style.visibility = "hidden";
//     };
//   }

// const showArrow = () => {
//     const el = document.body.querySelector(".scroll-down");
//     el.style.visibility = "visible";
//     setTimeout(() => {
//         el.style.visibility = "hidden";
//     }, 3000);
// }

