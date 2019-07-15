export const setProcessingForm = (formName, isProcessing) => {
    return {
        type: 'SET_PROCESSING_FORM',
        formName,
        isProcessing
    };
};
export const setUserToken = (token) => {
    return {
        type: 'SET_USER_TOKEN',
        token,
    };
};