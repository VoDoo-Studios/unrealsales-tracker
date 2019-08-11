import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';
import IncludeTagsFilter from './includeTagsFilter';
import CategoryFilter from './categoryFilter';
import KeywordFilter from './keywordFilter';
import ExcludeTagsFilter from './excludeTagsFilter';
import AdvancedFilter from './advancedFilter';

import './filters.css';

class Filters extends PureComponent {
    render() {
        return (
            <Navbar bg="dark" expand="lg" variant="dark" className="filters">
                <Navbar.Toggle aria-controls="filter-selector" />
                <Navbar.Collapse id="filter-selector">
                    <Nav
                        className="filters__filterbar"
                    >
                        <h5>Filters</h5>
                        <KeywordFilter/>
                        <CategoryFilter/>
                        <IncludeTagsFilter/>
                        <ExcludeTagsFilter/>
                        {/* <AdvancedFilter/> */}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Filters = connect(null, null)(Filters);