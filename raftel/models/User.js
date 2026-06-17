import mongoose from 'mongoose'

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
    onBoard : {type: Boolean, default: false},
    pollsPrivate: {type: Boolean, default: false},
}, { timestamps: true })

    export default mongoose.models.User || mongoose.model('User', UserSchema)  
