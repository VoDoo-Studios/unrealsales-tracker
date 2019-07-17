
export const postProduct = (slug) => {
    return (dispatch, getState) => {
        return fetch(window.tracker.api_endpoint + 'products', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getState().app.userToken,
            },
            body: JSON.stringify({
                slug: slug,
            }),
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw response;
        })
        .then((response) => {
            if (response.Count > 0) {
                return response.Items[0];
            }
            throw response;
        })
    }
}
export const setProduct = (slug, productData) => {
    return {
        type: 'SET_PRODUCT',
        productData,
        slug,
    }
}