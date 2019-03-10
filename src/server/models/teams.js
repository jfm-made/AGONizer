import mongoose from 'mongoose';
import Player from "./player";

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name: String,
    players: [{
        type: Schema.Types.ObjectId,
        ref: 'Player',
    }],
    skillLevelSum: Number,
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

    this.skillLevelSum = players.reduce((count, current) => {
        return count + current.skillLevel;
    }, 0);

    next();
});

const Team = mongoose.model('Team', TeamSchema);

export default Team;
