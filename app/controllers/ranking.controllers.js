const rankingsModel = require('../models/ranking.model');
const { getVictoryType } = require('../models/ranking.helper');

module.exports = {
    post,
    get,
    getAll,
}

async function post(req, res) {
    const { userId, gamePoints, position } = req.body;
    if (!userId || !gamePoints || !position)
        return res.status(400).json({ msg: 'Los campos están vacíos.' });
    
    const rankingExists = await rankingsModel.findOne({ userId });

    if (!rankingExists) {
        const Ranking = new rankingsModel({ 
            userId,
            totalPoints: gamePoints,
            ...getVictoryType({}, position)
        });
        await Ranking.save();
        res.json({ saved: true, Ranking });
    }
    else {
        const rankStats = {
            ...rankingExists._doc,
            ...getVictoryType((rankingExists), position),
            totalPoints: rankingExists.totalPoints + gamePoints,
        }
        await rankingsModel.updateOne({ userId }, { ...rankStats });    
        res.json({ updated: true, rankStats });
    }
}

async function get(req, res) {
    const { userId } = req.body;
    if (userId) return res.status(400).json({ msg: 'El userId está vacío.' });
    const userRanking = await rankingsModel.findOne({ userId });
    return res.json({ userRanking });
}

async function getAll(req, res) {
    const rankings = await rankingsModel.find({ });
    res.json({ rankings });
}