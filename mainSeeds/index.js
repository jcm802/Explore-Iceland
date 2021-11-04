// ---------- This file reseeds db data, needs to be separately executed ----------

const mongoose 		= require("mongoose"),
	  Plan          = require("../models/plan"),
      Thingstodo    = require("../models/thingstodo"),
      activities     = require("./activities"),
    { ADMIN_ID } = require("../config"),
      thingsToDo     = require("./thingstodo");

const url = process.env.DATABASEURL || "mongodb://localhost:27017/iceland";

// Connecting mongoose
mongoose.connect(url, { 	
	useNewUrlParser: true,
	useUnifiedTopology: true})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));



// Iterating over seeded data and adding to db (Plans)
// const seedActivities = async () => {
//     await Plan.deleteMany({});
//     for(let i = 0; i < activities.length; i++){
//         const plan = new Plan({
//             // using es6 to access these values
//             title: `${activities[i].title}`,
//             description: `${activities[i].description}`,
//             image: `${activities[i].image}`,
//             location: `${activities[i].location}`,
//             geometry: {
//                 type: 'Point',
//                 coordinates: [ activities[i].longitude, activities[i].latitude ]
//               }
//         })
//         await plan.save()
//     }
// }

// =======
// TESTING
// =======
// ====== TESTER FUNCTION FOR CHECKING THIS FILE WORKS WITH DB SEPARATELY ====== //
// const seedDB = async() => {
//     await Plan.deleteMany({});
//     const p = new Plan({title: 'The blue lagoon'});
//     await p.save();
// }
//-------------------------------------------------------------------------------

//========== TESTING activities seeding (My Planner) =========
// const id = 1;
// const seedActivity = async() => {
//     await Plan.deleteMany({});
//     const plan = new Plan({
//         title: `${activities[id].title}`,
//         description: `${activities[id].description}`,
//         image: `${activities[id].image}`
//     })
//     await plan.save()
// }

// ====== TESTING things to do seeding =====
// const seedThingsToDo = async() => {
//     await Thingstodo.deleteMany({});
//     const t = new Thingstodo({title: "whale watching"});
//     await t.save();
// }

// RE-SEED THINGS TO DO
const seedThingsToDo = async () => {
    await Thingstodo.deleteMany({});
    for(let i = 0; i < thingsToDo.length; i++){
        const thingtodo = new Thingstodo({
            author: ADMIN_ID, // Only the author (me) can add, remove or edit things to do on the client side
            title: `${thingsToDo[i].title}`,
            image: `${thingsToDo[i].image}`,
            description: `${thingsToDo[i].description}`,
            location: `${thingsToDo[i].location}`,
            geometry: {
                type: 'Point',
                coordinates: [ thingsToDo[i].longitude, thingsToDo[i].latitude ]
              },
            tour: `${thingsToDo[i].tour}`
        })
        await thingtodo.save()
    }
}

// Seeds DB - Closes connection after final seed only
seedActivities();
seedThingsToDo().then(() => {
    mongoose.connection.close();
});