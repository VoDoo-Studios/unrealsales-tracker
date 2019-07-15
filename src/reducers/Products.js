const products = (state = {}, data) => {
    switch (data.type) {
        case 'SET_PRODUCT':
            return {
                ...state,
                ...data,
            }
        default:
            return state;
    }
};

export default products;