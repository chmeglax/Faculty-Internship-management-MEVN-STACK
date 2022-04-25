const mongoose = require("mongoose");

function makeNewConnection(dbName) {
  const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_SECRET}@${process.env.MONGO_HOST}/${dbName}?retryWrites=true&w=majority`;
  const db = mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  db.on("error", function (error) {
    console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
    db.close().catch(() =>
      console.log(`MongoDB :: failed to close connection ${this.name}`)
    );
  });

  db.on("connected", function () {
    if (process.env.NODE_ENV === 'dev')
      mongoose.set("debug", function (col, method, query, doc) {
        console.log(`MongoDB :: ${this.conn.name} ${col}.${method}`);
      });
    console.log(`MongoDB :: connected ${this.name}`);
  });

  db.on("disconnected", function () {
    console.log(`MongoDB :: disconnected ${this.name}`);
  });

  return db;
}
module.exports = {
  Root: makeNewConnection("pfa"),
}
