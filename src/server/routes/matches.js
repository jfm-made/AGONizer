import express from 'express';
import Team from '../models/team';
import Match from '../models/match';
import {getPossibleMatches} from '../util/matchMaking';
const router = new express.Router();

const basePath = '/match';

router.post(basePath, async (req, res) => {
    try {
        const teamIdList = [
            req.body.team1,
            req.body.team2,
        ];

        if (req.body.winner && req.body.winner !== null) {
            teamIdList.push(req.body.winner);
        }

        const teams = await Team.find({
            _id: {
                $in: teamIdList
            }
        }).select({
            _id: 1,
        }).lean();

        if (teams.length >= 3 || teams.length === 1) {
            return res.status(400).json({
                message: "Request invalid",
                error: "A match needs two valid teams. All given teams must be valid."
            })
        }

        const match = new Match({
            team1: req.body.team1,
            team2: req.body.team2,
            timeSlot: parseInt(req.body.timeSlot) || null,
            result1: parseInt(req.body.result1) || null,
            result2: parseInt(req.body.result2) || null,
            winner: req.body.winner || null,
        });

        await match.save();

        return res.send({
            message: 'Match created',
            match,
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            body: req.body,
            error: error.toString(),
        });
    }
});

// TODO Add limit and pagination to params
router.get(basePath, async (req, res) => {
    const matches = await Match.find()
        .populate('team1')
        .populate('team2')
        .populate('winner')
        .limit(100);

    res.json(matches);
});

router.get(`${basePath}/:id`, async (req, res) => {
    try {
        const _id = req.params.id;
        const match = await Match
            .findOne({_id})
            .populate('team1')
            .populate('team2')
            .populate('winner');

        if (match !== null) {
            return res.json(match);
        }

        return res.status(404).json({
            message: "Match not found",
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.toString(),
        })
    }
});

router.put(`${basePath}/:id`, async (req, res) => {
    try {
        const match = await Match.findOne({_id: req.params.id});

        const teamIdList = [
            req.body.team1,
            req.body.team2,
        ];

        if (req.body.winner && req.body.winner !== null) {
            teamIdList.push(req.body.winner);
        }

        const teams = await Team.find({
            _id: {
                $in: teamIdList
            }
        }).select({
            _id: 1,
        }).lean();

        if (teams.length >= 3 || teams.length === 1) {
            return res.status(400).json({
                message: "Request invalid",
                error: "A match needs two valid teams. All given teams must be valid."
            })
        }

        match.team1 = req.body.team1 || match.team1;
        match.team2 = req.body.team2 || match.team2;
        match.timeSlot = parseInt(req.body.timeSlot) || match.timeSlot || null;
        match.result1 = parseInt(req.body.result1) || match.result1 || null;
        match.result2 = parseInt(req.body.result2) || match.result2 || null;
        match.winner = req.body.winner || match.winner || null;

        await match.save();

        return res.send({
            message: 'Match updated',
            player: Match,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.toString(),
        })
    }
});

router.delete(`${basePath}/:id`, async (req, res) => {
    try {
        const response = await Match.deleteOne({_id: req.params.id});

        if (response && response.n === 1) {
            return res.json({
                message: 'Match deleted',
            });
        }

        return res.status(404).json({
            message: 'Match not found or not deleted',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.toString(),
        });
    }
});

router.post(`${basePath}/build`, async (req, res) => {
    try {
        const teams = await Team.find({
            _id: {
                $in: req.body.teams,
            }
        }).select({_id: 1}).lean();

        const possibleMatches = getPossibleMatches(teams.map(x => x._id));

        res.send({
            possibleMatches,
        })


    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.toString(),
        });
    }
});

export default router;