import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({

    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    pollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll',
        required: true  
    },
    optionIndex: {
        type: Number,
        required: true
    }
},{timestamps : true })

export default mongoose.models.Vote || mongoose.model('Vote', VoteSchema)