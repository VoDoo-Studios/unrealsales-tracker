const products = (state = {}, data) => {
    switch (data.type) {
        case 'SET_PRODUCT':
            return {
                ...state,
                [data.slug]: {
                    ...data.productData,
                },
            }
        default:
            return state;
    }
};

export default products;