import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { FaTwitter } from 'react-icons/fa';

import Header from '../../components/Header/header';
import Grid from '../../components/Grid/grid';
import AddProduct from '../../components/AddProduct/addproduct';
import Filters from '../../components/Filters/filters';
import TwitterCTA from '../../components/TwitterCTA/twittercta';
import imgMegagrants from '../../images/megagrants.svg';

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
                <TwitterCTA/>
                <Row className="main-page__footer">
                    <Col lg={10} sm={12}>
                        <div className="tracker-footer">
                            Need of support? create an issue <a target="_blank" rel="noopener noreferrer" href="https://github.com/CGeorges/unrealsales-tracker/issues">here</a>. 
                            This project is OpenSource, feel free to <a target="_blank" rel="noopener noreferrer" href="https://github.com/CGeorges/unrealsales-tracker">contribute</a>.
                            Follow us on <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/VoDooStudios"><FaTwitter /></a>
                        </div>
                    </Col>
                    <Col lg={2} sm={12} className="main-page__megagrants">
                        <img src={imgMegagrants} alt="Epic MegaGrants recipient"/>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Tracker = connect(mapStateToProps, null)(Tracker);
