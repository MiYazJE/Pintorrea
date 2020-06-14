const rankingsModel = require('../models/ranking.model');
const usersModel    = require('../models/user.model');
const { getVictoryType } = require('../models/ranking.helper');

module.exports = {
    post,
    get,
    getAll,
    request
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
            totalGames: rankingExists.totalGames + 1,
        }
        await rankingsModel.updateOne({ userId }, { ...rankStats });    
        res.json({ updated: true, rankStats });
    }

    updateRanking(req);
}

async function get(req, res) {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ msg: 'El userId está vacío.' });
    const userRanking = await rankingsModel.findOne({ userId });
    return res.json({ userRanking });
}

async function getAll(req, res) {
    const rankings = await rankingsModel.find({ });
    res.json({ rankings });
}

async function request(req, res) {
    updateRanking(req);
    res.status(201).json({ success: true });
}

async function updateRanking(req) {
    const { io } = req.app.locals;
    let usersRanking = await rankingsModel.find({ });
    const ranking = [];
    for (const user of usersRanking) {
        const { picture, name } = (await usersModel.findById({ _id: user.userId }));
        ranking.push({ ...user._doc, picture, name });
    }
    io.emit('updateRanking', { ranking });
}