import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';
import './header.css';

const mapStateToProps = (state) => {
    const userToken = state.app.userToken;

    return {
        userToken,
    };
};

class Header extends React.PureComponent {
    redirect(path, e) {
        e.preventDefault();
        e.stopPropagation();
        window.tracker.appHistory.push(path);
    }
    logout() {
        localStorage.removeItem('userToken');
        window.location.reload();
    }
    render() {
        const { userToken } = this.props;
        return (
            <Navbar expand="lg" className="unreal-tracker__header">
                <Navbar.Brand href="#" onClick={this.redirect.bind(this, '/tracker/')}>UnrealSales</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#" onClick={this.redirect.bind(this, '/tracker/')}>Tracker</Nav.Link>
                        {!userToken && 
                            <>
                                <Nav.Link href="#" onClick={this.redirect.bind(this, '/tracker/login')}>Login</Nav.Link>
                                <Nav.Link href="#" onClick={this.redirect.bind(this, '/tracker/register')}>Register</Nav.Link>
                            </>
                        }
                        {userToken &&
                            <Nav.Link href="#" onClick={this.logout.bind(this)}>Logout</Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Header = connect(mapStateToProps, null)(Header);
