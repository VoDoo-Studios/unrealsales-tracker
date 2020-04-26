import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { NavDropdown } from 'react-bootstrap';
import { matchObject } from 'searchjs';
import stringToColor from '../../modules/strToColor';

import { setFilters } from '../../actions/appActions';
import { selectFilters, selectFilteredFilters } from '../../selectors/filters';

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
    const filteredProducts = Object.keys(state.products).filter((product) => {
        let filtered = false;
        Object.keys(filteredFilters).map((filter) => {
            if (!matchObject(state.products[product], filteredFilters[filter])) filtered = true;
        })

        return !filtered;
    }).reduce( (res, key) => (res[key] = state.products[key], res), {} );
    
    // Retrieve categories from already filtered products
    const categories = [...new Set(Object.keys(filteredProducts).map((product) => {
        return filteredProducts[product].categories[0].name;
    }))];
    return {
        categories,
        filters,
    }
};

class CategoryFilter extends PureComponent {
    render() {
        const { filters, categories } = this.props;
        return (
            <NavDropdown 
                title={filters && filters.categoryFilter && filters.categoryFilter.hasOwnProperty('categories.name') ? filters.categoryFilter['categories.name'] : 'by category'} 
                onSelect={this.handleSaveFilter.bind(this)}
                className="filters__filterbar-category">
                <NavDropdown.Header>Filter by category</NavDropdown.Header>
                <NavDropdown.Item key="clear" eventKey="clear">Clear</NavDropdown.Item>
                <NavDropdown.Divider/>
                {categories.map(cat => {
                    return (
                        <NavDropdown.Item key={cat} eventKey={cat} style={{backgroundColor: stringToColor(cat)}}>
                            {cat}
                        </NavDropdown.Item>
                    )
                })}
            </NavDropdown>
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

export default CategoryFilter = connect(mapStateToProps, mapDispatchToProps)(CategoryFilter);