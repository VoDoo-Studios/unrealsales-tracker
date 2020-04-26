import { matchObject } from 'searchjs';

const slicer = state => state.products ?? {};

export const selectFilteredProducts = (state, filters) => Object.keys(slicer(state)).filter((product) => {
    let filtered = false;
    Object.keys(filters).map((filter) => {
        if (!matchObject(state.products[product], filters[filter])) filtered = true;
    })
    return !filtered;
}).reduce( (res, key) => (res[key] = state.products[key], res), {} );

