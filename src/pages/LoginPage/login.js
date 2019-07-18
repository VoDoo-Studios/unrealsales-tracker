import React from 'react';
import { connect } from 'react-redux';
import { Container, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';

import { setLoginForm, clearLoginForm } from '../../actions/registerActions';
import { setProcessingForm, setUserToken } from '../../actions/appActions';

import Header from '../../components/Header/header';

import './login.css';
const getUrlParameter = (name) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(window.location.search);
    return results && results.length > 0 ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : false;
};
const mapDispatchToProps = (dispatch) => {
    return {
        updateForm: (data) => {
            let input = {
                [data.target.name]: data.target.type === 'checkbox' ? data.target.checked : data.target.value,
            };
            dispatch(setLoginForm(input));
            dispatch(setLoginForm({invalidLogin: false}));
            dispatch(setLoginForm({systemFail: false}));
        },
        handleSubmit: (formData) => event => {
            const form = event.currentTarget;
            let isValid = form.checkValidity();
            event.preventDefault();
            event.stopPropagation();

            dispatch(setLoginForm({validated: true}));
            
            if (isValid) {
                dispatch(setProcessingForm('loginForm', true));
                return fetch(window.tracker.api_endpoint + 'profile/login', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                    }),
                })
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw response;
                })
                .then((response) => {
                    localStorage.setItem('userToken', response.userToken);
                    dispatch(setUserToken(response.userToken));
                    dispatch(setProcessingForm('loginForm', false));
                    dispatch(clearLoginForm());
                    if (getUrlParameter('product')) {
                        window.tracker.appHistory.push('/tracker/add?product=' + getUrlParameter('product'));
                    } else {
                        window.tracker.appHistory.push('/tracker/');
                    }
                })
                .catch(err => {
                    if (err.status === 401) {
                        dispatch(setLoginForm({invalidLogin: true}));
                    } else {
                        dispatch(setLoginForm({systemFail: true}));
                    }
                    dispatch(setProcessingForm('loginForm', false));
                    console.error(err);
                });
            }
        }
    }
}

const mapStateToProps = (state) => {
    const isProcessing = (state.app.processing && state.app.processing.loginForm) || false;
    const loginForm = state.register.loginForm || {};

    return {
        isProcessing,
        loginForm,
    };
};

class Login extends React.PureComponent {
    render() {
        const { updateForm, loginForm, isProcessing, handleSubmit } = this.props;
        return (
            <Container className="login-page">
                <Header />
                <Row className="login-page__content">
                    <Col md={{ span: 6, offset: 3 }}>
                        <Form noValidate validated={loginForm.validated} onSubmit={handleSubmit(loginForm)}>
                            {loginForm.invalidLogin &&
                                <Alert variant="warning">
                                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                    <p>
                                        The email/password combination does not match our system.
                                    </p>
                                </Alert>
                            }
                            {loginForm.systemFail &&
                                <Alert variant="danger">
                                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                    <p>
                                        There seems to be a problem with our login system, please try again in a couple of minutes.
                                    </p>
                                </Alert>
                            }
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    required
                                    defaultValue={loginForm.email} 
                                    onChange={updateForm.bind(this)} 
                                    name="email"
                                    type="email" 
                                    placeholder="Enter email" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    required
                                    defaultValue={loginForm.password} 
                                    onChange={updateForm.bind(this)}
                                    name="password"
                                    type="password" 
                                    placeholder="Password" />
                            </Form.Group>
                            <Button disabled={isProcessing} variant="primary" type="submit">
                                {isProcessing &&
                                    <Spinner animation="grow" size="sm" variant="warning"/>
                                }
                                Log in
                            </Button>
                            <a className="ml-3" href="" onClick={(event) => {event.preventDefault();event.stopPropagation();window.tracker.appHistory.push('/tracker/register')}}>
                                or Create an account for free
                            </a>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Login = connect(mapStateToProps, mapDispatchToProps)(Login);
