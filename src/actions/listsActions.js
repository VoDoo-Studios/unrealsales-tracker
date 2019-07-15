export const getLists = () => {
    return (dispatch, getState) => {
        return fetch('https://api.unrealsales.io/dev/lists', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getState().app.userToken,
            },
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw response;
        })
        .then((response) => {
            if (response.Count > 0) {
                return dispatch(setLists(response.Items));
            }
            throw response;
        })
    }
}
export const setLists = (lists) => {
    return {
        type: 'SET_LISTS',
        lists,
    }
}