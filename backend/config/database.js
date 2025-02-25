const { mongoose, model } = require("mongoose");

const connectDatabse = () => {
    mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(con => {
        console.log(`MongoDB is connected to the host: ${con.connection.host} `)
    }).catch((err) => {
        console.log(err)
    })

}

module.exports = connectDatabse