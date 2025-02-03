const mongoose = require("mongoose");
const { database } = require("../config");

module.exports.connect = async () => {
  try {
    // const data = await mongoose.connect(
    //   // `mongodb+srv://${database.user}:${database.password}@${database.host}/${database.database}?retryWrites=true&w=majority`
    //   `mongodb+srv://dgnayanajith:CdOqhYZJEzZJlfZO@medcube.qvekw.mongodb.net/AimGame?retryWrites=true&w=majority`
    // );
    mongoose.connect('mongodb+srv://dgnayanajith:CdOqhYZJEzZJlfZO@medcube.qvekw.mongodb.net/AimGame?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
  });
  
    console.log(`-----Connected to ${database.database} successfully-----`);
  } catch (error) {
    console.log("db connection error ", { error });
  }
};
