const app = (state = {}, data) => {
    switch (data.type) {
        case 'SET_PROCESSING_FORM': 
            return {
                ...state,
                processing: {
                    ...state.processing,
                    [data.formName]: data.isProcessing,
                }
            }
        case 'SET_USER_TOKEN':
            return {
                ...state,
                userToken: data.token
            }
        case 'SET_FILTERS':
            return {
                ...state,
                filters: data.filters,
            }
        default:
            return state;
    }
};

export default app
