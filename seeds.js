// CONFIG
const 	mongoose 	= require("mongoose"),
		IndexImage  = require("./models/indexImages");

// SEED DATA
const images = [

  	{
  	name: "image1",
   image: "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
	},
	{
  	name: "image2",
   image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
	},
	{
  	name: "image3",
   image: "https://images.unsplash.com/photo-1515133997814-e6460be24073?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80"
	},
	{
  	name: "image4",
   image: "https://images.unsplash.com/photo-1518156959312-07a5380c1261?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1049&q=80"
	},
	{
  	name: "image5",
   image: "https://images.unsplash.com/photo-1471277492184-078d3fe6b419?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
	},
	{
  	name: "image6",
   image: "https://images.unsplash.com/photo-1439725434120-c1b50e0cc329?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
	},
	{
  	name: "image7",
   image: "https://images.unsplash.com/photo-1501879779179-4576bae71d8d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
	},
	{
  	name: "image8",
   image: "https://images.unsplash.com/photo-1465353471565-b77e538f34c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
	},
	{
  	name: "image9",
   image: "https://images.unsplash.com/photo-1474710820418-dd5406ee35d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
	},
	{
  	name: "image10",
   image: "https://images.unsplash.com/photo-1462993340984-49bd9e0f32dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
	},
	{
  	name: "image11",
   image: "https://images.unsplash.com/photo-1474690870753-1b92efa1f2d8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
	},
	{
  	name: "image12",
   image: "https://images.unsplash.com/photo-1504087825736-ec698faffd4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80"
	},
	{
  	name: "image13",
   image: "https://images.unsplash.com/photo-1473654729523-203e25dfda10?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
	},
	{
  	name: "image14",
   image: "https://images.unsplash.com/photo-1521188453774-625d3fa52b67?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
	},
	{
  	name: "image15",
   image: "https://images.unsplash.com/photo-1489864983806-4d0d07e2d37d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1049&q=80"
	}
    
];

// Remove and add to DB to 
function seedDB(){

	// Remove all images
	IndexImage.remove({}, (err) => {
		if(err){
			console.log(err);
		}
		console.log("REMOVED IMAGES SUCCESSFULLY");
		images.forEach((seed) => {
			IndexImage.create(seed, (err, image) => {
				if(err){
					console.log(err);
				} else {
					image.save();
				}
			})
		})
		console.log(images.length + " IMAGES ADDED TO DB");
	})

};

module.exports = seedDB;


