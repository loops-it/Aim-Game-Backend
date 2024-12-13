const mongoose = require("mongoose");
const { database } = require("../config");

module.exports.connect = async () => {
  try {
    const data = await mongoose.connect(
      `mongodb+srv://${database.user}:${database.password}@${database.host}/${database.database}?retryWrites=true&w=majority`
      
    );
    console.log(`-----Connected to ${database.database} successfully-----`);
  } catch (error) {
    console.log("db connection error ", { error });
  }
};
