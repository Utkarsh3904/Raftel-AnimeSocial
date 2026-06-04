import mongoose from 'mongoose'

const animeSchema = new mongoose.Schema({

    anilistId : {type: Number, required: true, unique: true},
    title : {type: String, required: true},
    coverImage: {type: String},
    genres: [String],
    addedAt: {type: Date, default: Date.now}
})

const UserSchema = new mongoose.Schema({
    clerkId: {type: String, required:true, unique: true},
    username: {type: String, required:true },
    avatar: {type: String, required:true},
    top5Anime: {
      type: [
        {
          id: Number,
          title: {
            romaji: String,
          },
          coverImage: {
            medium: String,
          },
        },
      ],
      validate: {
        validator: v => v.length <= 5,
        message: 'top5Anime can only contain up to 5 items',
      },
    },
    reputation: {type: Number, default :0},
    onBoard : {type: Boolean, default: false}
}, { timestamps: true })

    export default mongoose.models.User || mongoose.model('User', UserSchema)  

