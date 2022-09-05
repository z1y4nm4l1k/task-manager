const mongoose = require("mongoose");

// Establish connection
mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api");

// Define a basic model

// // Create inst

// const me = new User({
//   name: "   Sam    ",
//   email: "   sam@test.com    ",
//   password: "mySecretPassphrase",
// });

// // Save model inst
// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch((error) => {
//     console.log("Error!", error);
//   });

// const code = new Task({ description: "Buy groceries       " });

// code
//   .save()
//   .then(() => console.log(code))
//   .catch((error) => console.log(error));
