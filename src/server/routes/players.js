import express from 'express';
import Player from '../models/player';
import Team from '../models/team';

const router = new express.Router();

const basePath = '/player';

router.post(basePath, async (req, res) => {
    try {
        if (req.body.firstName === '' || req.body.lastName === '' || req.body.nickName === '' || isNaN(req.body.skillLevel)) {
            return res.status(500).json({
                message: 'Data is missing',
            });
        }

        const player = new Player({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nickName: req.body.nickName,
            skillLevel: parseInt(req.body.skillLevel),
        });

        await player.save();

        return res.send({
            message: 'Player created',
            player,
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
    const players = await Player.find()
        .limit(100)
        .sort({
            nickName: 1,
        });

    res.json(players);
});

router.get(`${basePath}/:id`, async (req, res) => {
    try {

        const _id = req.params.id;
        const player = await Player.findOne({_id});

        if (player !== null) {
            return res.json(player);
        }

        return res.status(404).json({
            message: "Player not found",
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
        const player = await Player.findOne({_id: req.params.id});

        player.firstName = req.body.firstName;
        player.lastName = req.body.lastName;
        player.nickName = req.body.nickName;
        player.skillLevel = parseInt(req.body.skillLevel);

        await player.save();

        return res.send({
            message: 'Player updated',
            player,
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
        const id = req.params.id;
        const response = await Player.deleteOne({_id: id});

        // Remove player id from teams
        const team = await Team.findOne({players: id});

        if (team) {
            team.players = team.players.filter(x => {
                return x.toString() !== id;
            });

            await team.save();
        }

        if (response && response.n === 1) {
            return res.json({
                message: 'Player deleted',
            });
        }

        return res.status(404).json({
            message: 'Player not found or not deleted',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.toString(),
        })
    }
});

export default router;