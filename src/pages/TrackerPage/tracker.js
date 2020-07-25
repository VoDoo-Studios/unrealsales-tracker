import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';

import Header from '../../components/Header/header';
import Grid from '../../components/Grid/grid';
import AddProduct from '../../components/AddProduct/addproduct';
import Filters from '../../components/Filters/filters';

import './tracker.css';

const mapStateToProps = (state) => {
    const userToken = state.app.userToken;

    return {
        userToken,
    };
};

class Tracker extends React.PureComponent {
    componentDidMount() {
        const { userToken } = this.props;

        if (!userToken) {
            window.gtag('event', 'tracker', {'type': 'loggedout'});
            window.tracker.appHistory.push('/tracker/login/');
        }
    }
    render() {
        const { userToken } = this.props;
        if (!userToken) {
            return null;
        }
        return (
            <Container  className="list-page">
                <Header/>
                <AddProduct/>
                <Filters/>
                <Grid/>
                <div className="tracker-footer">
                    Need of support? create an issue <a href="https://github.com/CGeorges/unrealsales-tracker/issues">here</a>. This project is OpenSource, feel free to <a href="https://github.com/CGeorges/unrealsales-tracker">contribute</a>.
                </div>
            </Container>
        )
    }
}

export default Tracker = connect(mapStateToProps, null)(Tracker);
