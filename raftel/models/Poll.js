import mongoose from 'mongoose'

const OptionSchema = new mongoose.Schema({
    text: {type: String, required: true},
    votes: {type: Number, default: 0}
})

const PollSchema = new mongoose.Schema({

    question:{type: String, required: true},
    options:{type:[OptionSchema]},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref:'User', default:null},
    isAiGenerated : {type: Boolean , default: true},
    totalVotes: {type: Number, default:0},

}, {timestamps: true})

export default mongoose.models.Poll || mongoose.model('Poll', PollSchema);