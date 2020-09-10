const images = [
  "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1504829857797-ddff29c27927?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1515133997814-e6460be24073?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80",
  "https://images.unsplash.com/photo-1518156959312-07a5380c1261?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1049&q=80",
  "https://images.unsplash.com/photo-1471277492184-078d3fe6b419?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1439725434120-c1b50e0cc329?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1501879779179-4576bae71d8d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1465353471565-b77e538f34c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1474710820418-dd5406ee35d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1462993340984-49bd9e0f32dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1474690870753-1b92efa1f2d8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1504087825736-ec698faffd4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80",
  "https://images.unsplash.com/photo-1473654729523-203e25dfda10?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1521188453774-625d3fa52b67?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1489864983806-4d0d07e2d37d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1049&q=80"  
];

$('.container').css("background-image", "url('" + images[0] + "')");

let c = 0;
let i = 0;
let speed = 10000;
let half = speed / 2;
let isZero = false;

// Speed at 5000
const s = setInterval(() => {

// Switch from 0-1-0...
if(isZero){
	c = 1;
}
else{
	c = 0;
}
isZero = !isZero;

// Set container opacity to c
$(".container").css("opacity", c);

}, half);


//Speed at 100000 
const t = setInterval(() => {

// If opacity 1 add 1 to i
if(c === 1){
i++;
}

// Go back to 0 at the end of the cycle
if(i >= images.length){
	i = 0;
}

// Set background image to the image url of each image url as i moves up 1 
$('.container').css("background-image", "url('" + images[i] + "')");

}, speed);