export const selectCurrency = state =>  state.app?.currency ?? 'USD';
export const selectCurrencyRate = (state, baseRate) => state.app?.rates?.[baseRate];