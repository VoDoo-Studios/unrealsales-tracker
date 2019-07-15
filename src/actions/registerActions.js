export const setRegisterForm = (form) => {
    return {
        type: 'SET_REGISTER_FORM',
        form,
    };
};
export const setLoginForm = (form) => {
    return {
        type: 'SET_LOGIN_FORM',
        form,
    };
};
export const clearLoginForm = () => {
    return {
        type: 'CLEAR_LOGIN_FORM',
    };
};
export const clearRegistrationForm = () => {
    return {
        type: 'CLEAR_REGISTRATION_FORM',
    };
};