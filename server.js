require("dotenv").config();
const { port } = require('./config')
const app = require("./app");

app.listen(port, () => {
    console.log(`Server listen on ${port}`);
});
