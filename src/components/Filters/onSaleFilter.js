import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';

import { setFilters } from '../../actions/appActions';
import { selectFilters, selectFilteredFilters } from '../../selectors/filters';
import { selectFilteredProducts } from '../../selectors/products';

const mapDispatchToProps = (dispatch) => {
    return {
        setFilters: (filters) => {
            dispatch(setFilters(filters));
        }
    };
};
const mapStateToProps = (state) => {
    const filters = selectFilters(state);

    // Retrieve all filters except the current one 
    let filteredFilters = selectFilteredFilters(state, 'categoryFilter');

    // Filter out products that had been already filtered by other filters
    const filteredProducts = selectFilteredProducts(state, filteredFilters);
    
    // Retrieve categories from already filtered products
    const categories = [...new Set(Object.keys(filteredProducts).map((product) => {
        return filteredProducts[product].categories[0].name;
    }))];
    return {
        categories,
        filters,
    }
};

class OnSaleFilter extends PureComponent {
    render() {
        return (
            <Form.Check
                inline
                label="Show only on sale"
                type="checkbox"
                id="advanced-on-sale"
            />
        );
    }

    handleSaveFilter(selection) {
        const { setFilters, filters } = this.props;

        let newFilters = {
            ...filters,
            categoryFilter: {
                'categories.name': selection,
            }
        }

        if (selection === 'clear') delete newFilters.categoryFilter;
        setFilters(newFilters);

    }
}

export default OnSaleFilter = connect(mapStateToProps, mapDispatchToProps)(OnSaleFilter);