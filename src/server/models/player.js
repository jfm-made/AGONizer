import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    lastName: String,
    firstName: String,
    nickName: {
        type: String,
        index: true,
        unique: true,
    },
    skillLevel: Number,
}, {
    timestamps: true,
});

const Player = mongoose.model('Player', PlayerSchema);

export default Player;
