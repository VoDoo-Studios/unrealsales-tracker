import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';

import Header from '../../components/Header/header';
import Grid from '../../components/Grid/grid';

import './app.css';

const mapStateToProps = (state) => {
    const userToken = state.app.userToken;

    return {
        userToken,
    };
};

class App extends React.PureComponent {
    componentDidMount() {
        const { userToken } = this.props;

        if (!userToken) {
            window.tracker.appHistory.push('/tracker/login/');
        }
    }
    render() {
        return (
            <Container fluid className="unreal-tracker">
                <Header/>
                <Grid/>
            </Container>
        )
    }
}

export default App = connect(mapStateToProps, null)(App);
