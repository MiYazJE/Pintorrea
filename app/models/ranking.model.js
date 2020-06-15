const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const RankingSchema = new Schema({
    userId: { type: String, unique: true },
    totalPoints: { type: Number, default: 0 },
    goldVictories: { type: Number, default: 0 },
    silverVictories: { type: Number, default: 0 },
    bronzeVictories: { type: Number, default: 0 },
    totalGames: { type: Number, default: 0 }
});

module.exports = model('Ranking', RankingSchema);