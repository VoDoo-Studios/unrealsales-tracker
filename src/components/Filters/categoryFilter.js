import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { NavDropdown } from 'react-bootstrap';
import stringToColor from '../../modules/strToColor';

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
        return filteredProducts[product]?.categories[0]?.name;
    }).filter((cat) => cat !== undefined))];
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