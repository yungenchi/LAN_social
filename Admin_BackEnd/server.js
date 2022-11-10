const express = require("express");
const cors = require("cors");
const db = require("./src/database");
const graphql = require("./src/graphql");
const { graphqlHTTP } = require("express-graphql");


// Database will be sync'ed in the background.
db.sync();

const app = express();

// Parse requests of content-type - application/json.
app.use(express.json());

// Add CORS suport.
app.use(cors());

app.use(
    "/graphql",
    graphqlHTTP({
      schema: graphql.schema,
      rootValue: graphql.root,
      graphiql: true
    })
  );

// Set port, listen for requests.
const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
