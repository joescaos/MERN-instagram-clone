const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://res.cloudinary.com/dzglj31s2/image/upload/v1615606252/no-photo_ciltum.jpg"
    },
    followers: [{type: ObjectId}],
    following: [{type: ObjectId}],
})


mongoose.model("User", userSchema)