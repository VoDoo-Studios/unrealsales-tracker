const slicer = state => state.app?.filters ?? {};

export const selectFilters = state =>  slicer(state);
export const selectFilteredFilters = (state, excludeFilter) => Object.keys(slicer(state)).filter((filter) => filter !== excludeFilter)
    // eslint-disable-next-line no-sequences
    .reduce( (res, key) => (res[key] = slicer(state)[key], res), {} );
