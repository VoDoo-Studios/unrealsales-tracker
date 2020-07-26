const slicer = state => state.lists ?? {};

export const selectLists = (state) => slicer(state);
export const selectSelectedList = (state) => state.app?.list ?? false;
export const selectList = (state, listId) => Object.keys(slicer(state)).filter((list) => slicer(state)[list].listId === listId)
    // eslint-disable-next-line no-sequences
    .reduce( (res, key) => (res = slicer(state)[key], res), {} );