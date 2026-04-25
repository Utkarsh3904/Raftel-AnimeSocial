import mongoose from 'mongoose'

const animeSchema = new mongoose.Schema({

    anilistId : {type: Number, required: true, unique: true},
    title : {type: String, required: true},
    coverImage: {type: String},
    genres: [String],
    addedAt: {type: Date, default: Date.now}
})

const UserSchema = new mongoose.Schema({
    clearkId: {type: String, required:true, unique: true},
    username: {type: String, required:true },
    avatar: {type: String, required:true},
    watchedAnime: [animeSchema],
    top5Anime: {type: [animeSchema], validate: v => v.length<=5},
    reputation: {type: number, default :0},
    onBoard : {type: Boolean, default: false}
})

    export default mongoose.models.User || mongoose.model('User', UserSchema)  

