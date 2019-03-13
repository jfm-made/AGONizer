import mongoose from 'mongoose';
import Player from "./player";
import GlobalEmitter from '../util/globalEmitter';

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name: String,
    players: [{
        type: Schema.Types.ObjectId,
        ref: 'Player',
    }],
    currentSkillLevelSum: Number,
}, {
    timestamps: true,
});

TeamSchema.pre('save', async function(next) {
    const playerList = this.players;

    const players = await Player.find({
        _id: {
            $in: playerList,
        }
    }).lean();

    this.currentSkillLevelSum = players.reduce((count, current) => {
        return count + current.skillLevel;
    }, 0);

    next();
});

TeamSchema.post('save', () => {
    GlobalEmitter.emit('teams-update');
});

TeamSchema.post('deleteOne', () => {
    GlobalEmitter.emit('teams-update');
});

const Team = mongoose.model('Team', TeamSchema);

export default Team;
