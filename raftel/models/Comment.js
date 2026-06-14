import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({

    pollId :{
        type: mongoose.Schema.types.ObjectId,
        ref: 'Poll',
        required: true
    },
    userId : {
        type : mongoose.Schema.types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    likes:{
        type: Number,
        default: 0
    },
    likedBy:{
        type : [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    }


},{timestamps:true})

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema)


