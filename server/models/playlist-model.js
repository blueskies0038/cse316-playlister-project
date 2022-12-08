const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        ownerId: { type: ObjectId, ref: 'User'},
        ownerName: { type: String, default: '', required: true },
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String
        }], required: true },
        comments: { type: [{
            username: String,
            comment: String
        }], default: [], required: true},
        likes: { type: [String], default: [], required: true },
        dislikes: { type: [String], default: [], required: true },
        isPublished: { type: Boolean, default: false, required: true },
        listens: { type: Number, default: 0, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
