import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { NavDropdown } from 'react-bootstrap';
import { matchObject } from 'searchjs';
import stringToColor from '../../modules/strToColor';

import { setFilters } from '../../actions/appActions';

import './filters.css';

const mapDispatchToProps = (dispatch) => {
    return {
        setFilters: (filters) => {
            dispatch(setFilters(filters));
        }
    };
};
const mapStateToProps = (state) => {
    const filters = state.app.filters || [];
    let filteredFilters = Object.keys(filters).filter((filter) => filter !== 'categories.name')
        .reduce( (res, key) => (res[key] = filters[key], res), {} );
    const filteredProducts = Object.keys(state.products).filter((product) => {
        if (filters && !matchObject(state.products[product], filteredFilters)) {
            return false;
        }
        return true;
    }).reduce( (res, key) => (res[key] = state.products[key], res), {} );
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
                title={filters && filters.hasOwnProperty('categories.name') ? filters['categories.name'] : 'by category'} 
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
            'categories.name': selection,
        }
        if (selection === 'clear') delete newFilters['categories.name'];
        setFilters(newFilters);

    }
}

export default CategoryFilter = connect(mapStateToProps, mapDispatchToProps)(CategoryFilter);