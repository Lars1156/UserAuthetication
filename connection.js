const mongoose = require('mongoose');

async function connection (uri){
    await mongoose.connect(uri);
}

module.exports = {connection}