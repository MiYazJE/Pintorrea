const rankingsModel = require('./ranking.model'); 

module.exports = { getVictoryType };

function getVictoryType(userStats, gamePosition) {
    switch(gamePosition) {
        case 1:
            return { goldVictories: 1 + (userStats.goldVictories || 0) }
        case 2:
            return { silverVictories: 1 + (userStats.silverVictories || 0) }
        case 3:
            return { bronzeVictories: 1 + (userStats.bronzeVictories || 0) }
    }
    return { };
}