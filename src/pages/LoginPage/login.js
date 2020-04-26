import React from 'react';
import { connect } from 'react-redux';
import { Container, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";

import { setLoginForm, clearLoginForm, loginUser } from '../../actions/registerActions';
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
        setProcessingForm: (form, value) => {
            return dispatch(setProcessingForm(form, value));
        },
        clearLoginForm: () => {
            return dispatch(clearLoginForm());
        },
        setLoginForm: (data) => {
            return dispatch(setLoginForm(data));
        },
        loginUser: (loginForm) => {
            return dispatch(loginUser(loginForm));
        },
        setUserToken: (token) => {
            return dispatch(setUserToken(token));
        }
    }
}

const mapStateToProps = (state) => {
    const isProcessing = state?.app?.processing?.loginForm;
    const loginForm = state?.register?.loginForm ?? {};

    return {
        isProcessing,
        loginForm,
    };
};

class Login extends React.PureComponent {
    onChange(data) {
        const { setLoginForm } = this.props;
        let input = {
            [data.target.name]: data.target.type === 'checkbox' ? data.target.checked : data.target.value,
            invalidLogin: false,
            systemFail: false,
        };
        setLoginForm(input);
    }
    async onSubmit(event) {
        const { setProcessingForm, clearLoginForm, loginForm, setUserToken, setLoginForm, loginUser } = this.props;
        const form = event.currentTarget;
        let isValid = form.checkValidity();
        event.preventDefault();
        event.stopPropagation();
        setLoginForm({validated: true});
        
        if (isValid) {
            setProcessingForm('loginForm', true);
            try {
                let userProfile = await loginUser(loginForm);
                setUserToken(userProfile.userToken);
                setProcessingForm('loginForm', false);
                clearLoginForm();
                window.gtag('event', 'login', {'result': 'succesful'});
                if (getUrlParameter('product')) {
                    window.tracker.appHistory.push('/tracker/add?product=' + getUrlParameter('product'));
                } else {
                    window.tracker.appHistory.push('/tracker/');
                }
            } catch(err) {
                if (err.status === 401) {
                    setLoginForm({invalidLogin: true});
                } else {
                    setLoginForm({systemFail: true});
                }
                window.gtag('event', 'login', {'result': 'error'});
                setProcessingForm('loginForm', false);
                console.error(err);
            }
        }
    }
    render() {
        const { loginForm, isProcessing } = this.props;
        return (
            <Container className="login-page">
                <Header />
                <Row className="login-page__content">
                    <Col md={{ span: 6, offset: 3 }}>
                        <Form noValidate validated={loginForm.validated} onSubmit={this.onSubmit.bind(this)}>
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
                                    onChange={this.onChange.bind(this)} 
                                    name="email"
                                    type="email" 
                                    placeholder="Enter email" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    required
                                    defaultValue={loginForm.password} 
                                    onChange={this.onChange.bind(this)}
                                    name="password"
                                    type="password" 
                                    placeholder="Password" />
                                <Link to="/tracker/reset-password">Forgot password?</Link>
                            </Form.Group>
                            <Button disabled={isProcessing} variant="primary" type="submit">
                                {isProcessing &&
                                    <Spinner animation="grow" size="sm" variant="warning"/>
                                }
                                Log in
                            </Button>
                            <Link className="ml-3" to="/tracker/register"> or Create an account for free</Link>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Login = connect(mapStateToProps, mapDispatchToProps)(Login);
