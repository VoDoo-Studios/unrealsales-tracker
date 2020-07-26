const lists = (state = {}, data) => {
    switch (data.type) {
        case 'SET_LISTS': 
            return {
                ...data.lists,
            }
        default:
            return state;
    }
};

export default lists;
