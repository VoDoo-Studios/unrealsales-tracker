import React from 'react';
import { connect } from 'react-redux';
import { Container, Jumbotron, Card, Badge, Row, Col } from 'react-bootstrap';

import Header from '../../components/Header/header';
import imgOverview from '../../images/overview.png';

import './mainpage.css';

class MainPage extends React.PureComponent {
    render() {
        return (
            <Container  className="main-page">
                <Header/>
                <Jumbotron style={{backgroundImage: `url(${imgOverview})`}}>
                    <h1>Unreal Marketplace Wishlist</h1>
                    <p>
                        Easily manage your own list of marketplace items with just one click
                        directly from unreal market place.
                    </p>

                </Jumbotron>
                <Row>
                    <Col lg={4} sm={12}>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Easy to use</Card.Title>
                                <Card.Text>
                                    With our Bookmarklet you can easily add any product from the marketplace
                                    to your list.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} sm={12}>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Track prices</Card.Title>
                                <Card.Text>
                                    We monitor the prices daily,
                                    when the price drops, you get notified.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} sm={12}>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Filters</Card.Title>
                                <Card.Text>
                                    Filter your list based on category or tags.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col lg={4} sm={12}>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Multiple lists</Card.Title>
                                <Card.Text>
                                    Create a list for every project, you can manage multiple
                                    lists.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} sm={12}>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Badge pill variant="success">
                                    Coming soon
                                </Badge>
                                <Card.Title>Discover</Card.Title>
                                <Card.Text>
                                    Discover new assets by finding most reviewed, most wishlisted and more.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} sm={12}>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Badge pill variant="success">
                                    Coming soon
                                </Badge>
                                <Card.Title>Collaborate</Card.Title>
                                <Card.Text>
                                    Share your list with your team and collaborate together.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="main-page__cta">
                    <h2>
                        Give it a spin, <a href="/tracker/register" onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            window.tracker.appHistory.push('/tracker/register')
                        }}>create a free account</a>
                    </h2>
                </Row>


            </Container>
        )
    }
}

export default MainPage = connect(null, null)(MainPage);
