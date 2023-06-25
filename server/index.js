const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { ConnectDB } = require("./config");
const { graphqlHTTP } = require("express-graphql");
const {graphqlUploadExpress} = require("graphql-upload");
const schema = require("./schema/schema");
const PORT = process.env.PORT || 5000;
const app = express();

ConnectDB();

// define middleware
app.use(cors());

// app.post("/users", async (req, res) => {
//   const hashUsers = users.map((user) => {
//     if (user.password) {
//       const salt = bcrypt.genSaltSync(10);
//       const password = bcrypt.hashSync(user.password, salt);
//       user.password = password;
//     }
//      return user;
//   });
//   const createUser = await User.create(hashUsers);
//   res.json(createUser);
// });
app.use( "/graphql", 
  graphqlUploadExpress({maxFileSize: "20mb"}),
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(PORT, () => {
  console.log(`listen on port ${PORT}`);
});
