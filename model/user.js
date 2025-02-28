const mongoose = require('mongoose');
const bcrypt  = require('bcryptjs')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
userSchema.pre('save', async function(next){
   if (this.isModified(this.password)){
    const salt =  await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt);
   }
   next();
});

module.exports = mongoose.model('User', userSchema);
