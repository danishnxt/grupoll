const MongoClient = require('mongodb').MongoClient;
const mgs = require('mongoose')

uri = "mongodb+srv://danishnxt:yjUJK13ocEdFgOOU@nxtcluster1-hy2py.mongodb.net/grupoll_DB";
mgs.connect(uri)

db = mgs.connection
schema = mgs.Schema

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected through mongoose")
});

// Defining schema
























