import express from 'express';
import Team from '../models/team';
import Player from "../models/player";

const router = new express.Router();

const basePath = '/team';

router.post(basePath, async (req, res) => {
    try {
        const players = await Player.find({
            _id: {
                $in: req.body.players,
            }
        }).select({
            _id: 1
        }).limit(5).lean(); // Maximum player limit for CS:GO is 5

        if (players.length !== req.body.players.length) {
            return res.status(400).json({
                message: "Request invalid",
                error: "One or more players do not exists or number of players larger than five."
            })
        }

        const team = new Team({
            name: req.body.name,
            players,
        });

        await team.save();

        return res.send({
            message: 'Team created',
            team,
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
    const teams = await Team.find()
        .populate('players')
        .limit(100);

    res.json(teams);
});

router.get(`${basePath}/:id`, async (req, res) => {
    try {
        const _id = req.params.id;
        const team = await Team
            .findOne({_id})
            .populate('players');

        if (team !== null) {
            return res.json(team);
        }

        return res.status(404).json({
            message: "Team not found",
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.toString(),
        })
    }
});

router.put(`${basePath}/:id`, async (req, res) => {
    try {
        const team = await Team.findOne({_id: req.params.id});

        const players = await Player.find({
            _id: {
                $in: req.body.players,
            }
        }).select({
            _id: 1
        }).limit(5).lean(); // Maximum player limit for CS:GO is 5

        if (players.length !== req.body.players.length) {
            return res.status(400).json({
                message: "Request invalid",
                error: "One or more players do not exists or number of players larger than five."
            })
        }

        team.name = req.body.name;
        team.players = players;

        await team.save();

        return res.send({
            message: 'Team updated',
            player: Team,
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.toString(),
        })
    }
});

router.delete(`${basePath}/:id`, async (req, res) => {
    try {
        const response = await Team.deleteOne({_id: req.params.id});

        if (response && response.n === 1) {
            return res.json({
                message: 'Team deleted',
            });
        }

        return res.status(404).json({
            message: 'Team not found or not deleted',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.toString(),
        })
    }
});

export default router;