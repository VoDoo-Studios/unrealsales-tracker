import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import './filters.css';

const mapDispatchToProps = (dispatch) => {
    return {
    };
};
const mapStateToProps = (state) => {
    return {}
};

class Filters extends Component {
    render() {
        return (
            <Navbar bg="dark" expand="lg" variant="dark" className="filters">
                <Navbar.Toggle aria-controls="filter-selector" />
                <Navbar.Collapse id="filter-selector">
                    <Nav
                        className="filters__filterbar"
                    >
                        <h5>Filters</h5>
                        <NavDropdown title="by category" id="nav-dropdown">
                            <NavDropdown.Item eventKey="4.1">Action</NavDropdown.Item>
                            <NavDropdown.Item eventKey="4.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item eventKey="4.3">Something else here</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item eventKey="4.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    handleSaveFilter(filter) {
        const { setDateFilterStart, setDateFilterEnd, setActiveDateFilterName } = this.props;
        let today = new Date();
        let past = null;
        let currentDate = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
        setActiveDateFilterName(filter);
        switch (filter) {
            case '7D':
                past = new Date();
                past.setDate(today.getDate() - 7);
                break;
            case '14D':
                past = new Date();
                past.setDate(today.getDate() - 14);
                break;
            case '1M':
                past = new Date();
                past.setMonth(today.getMonth() - 1);
                break;
            case '3M':
                past = new Date();
                past.setMonth(today.getMonth() - 3);
                break;
            case 'ALL':
                setDateFilterStart('');
                setDateFilterEnd('');
                break;
            default:
                break
        }
        if (past) {
            let pastDate = past.getFullYear() + '-' + ("0" + (past.getMonth() + 1)).slice(-2) + '-' + ("0" + past.getDate()).slice(-2);
            setDateFilterStart(pastDate);
            setDateFilterEnd(currentDate);
        }
    }
}

export default Filters = connect(mapStateToProps, mapDispatchToProps)(Filters);