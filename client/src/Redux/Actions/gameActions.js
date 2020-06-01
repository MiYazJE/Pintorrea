export const setDrawerName = (drawerName) => ({
    type: 'SET_DRAWER_NAME',
    drawerName
});

export const setGuessed = () => ({
    type: 'SET_GUESSED',
});

export const setActualWord = (actualWord) => ({
    type: 'SET_ACTUAL_WORD',
    actualWord
});

export const setIsDrawer = (isDrawer) => ({
    type: 'SET_IS_DRAWER',
    isDrawer
});

export const addMessage = (message) => ({
    type: 'ADD_MESSAGE',
    message
})

export const resetMessages = () => ({
    type: 'RESET_MESSAGES',
});

export const resetGame = () => ({
    type: 'RESET_GAME'
});

export const setCurrentRound = (currentRound) => ({
    type: 'SET_CURRENT_ROUND',
    currentRound
});

export const setMaxRound = (maxRound) => ({
    type: 'SET_MAX_ROUND',
    maxRound
})