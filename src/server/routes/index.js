import express from 'express';

import playersRouter from './players';
import teamsRouter from './teams';
import matchesRouter from './matches';

const router = new express.Router();

router.use(express.json()); // for parsing application/json
router.use(express.urlencoded({extended: true}));

router.get('/hello', (req, res) => {
    res.json({
        message: 'hello world',
    })
});

router.use(playersRouter);
router.use(teamsRouter);
router.use(matchesRouter);

export default router;