import mongoose from 'mongoose'

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
})

const PollSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['poll', 'discussion'],
    default: 'poll',
  },
  question: { type: String, required: true },
  body: { type: String, default: null },
  options: { type: [OptionSchema], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isAiGenerated: { type: Boolean, default: true },
  totalVotes: { type: Number, default: 0 },
  image: { type: String, default: null },
  likes: { type: Number, default: 0 },
  likedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  upvotedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  downvotedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  private: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.models.Poll || mongoose.model('Poll', PollSchema)
