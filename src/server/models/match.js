import mongoose from 'mongoose';
import Team from "./team";
import GlobalEmitter from '../util/globalEmitter';

const Schema = mongoose.Schema;

const MatchSchema = new Schema({
    team1: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    team2: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    timeSlot: Number,
    result1: Number,
    result2: Number,
    winner: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        default: null,
        required: false,
    },
}, {
    timestamps: true,
});

MatchSchema.post('save', () => {
    GlobalEmitter.emit('matches-update');
});

MatchSchema.post('deleteOne', () => {
    GlobalEmitter.emit('matches-update');
});

const Match = mongoose.model('Match', MatchSchema);

export default Match;
