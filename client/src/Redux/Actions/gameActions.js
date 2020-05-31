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

export const resetGame = () => ({
    type: 'RESET_GAME'
});