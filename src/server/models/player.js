import mongoose from 'mongoose';
import GlobalEmitter from '../util/globalEmitter';

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

PlayerSchema.post('save', () => {
    GlobalEmitter.emit('players-update');
});

PlayerSchema.post('deleteOne', () => {
    GlobalEmitter.emit('players-update');
});

const Player = mongoose.model('Player', PlayerSchema);

export default Player;
