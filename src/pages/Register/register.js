import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Form, Button, Media, Spinner } from 'react-bootstrap';
import { setRegisterForm, clearRegistrationForm, loginUser, registerUser } from '../../actions/registerActions';
import { setProcessingForm, setUserToken } from '../../actions/appActions';

import Header from '../../components/Header/header';

import './register.css';

const mapDispatchToProps = (dispatch) => {
    return {
        setProcessingForm: (form, value) => {
            return dispatch(setProcessingForm(form, value));
        },
        setRegisterForm: (data) => {
            return dispatch(setRegisterForm(data));
        },
        clearRegistrationForm: () => {
            return dispatch(clearRegistrationForm());
        },
        loginUser: (credentials) => {
            return dispatch(loginUser(credentials));
        },
        registerUser: (formData) => {
            return dispatch(registerUser(formData));
        },
        setUserToken: (token) => {
            return dispatch(setUserToken(token));
        }
    }
}

const mapStateToProps = (state) => {
    const isProcessing = (state.app.processing && state.app.processing.registrationForm) || false;
    const registerForm = state.register.form || {};

    return {
        isProcessing,
        registerForm,
    };
};

class Register extends React.PureComponent {
    onChange(data) {
        const { setRegisterForm } = this.props;
        let input = {
            [data.target.name]: data.target.type === 'checkbox' ? data.target.checked : data.target.value,
        };
        setRegisterForm(input);
    }
    async onSubmit(event) {
        const { setProcessingForm, setRegisterForm, registerForm, clearRegistrationForm, registerUser, loginUser, setUserToken } = this.props;
        const form = event.currentTarget;
        let isValid = form.checkValidity();
        event.preventDefault();
        event.stopPropagation();

        setRegisterForm({ validated: true });

        if (isValid) {
            setProcessingForm('registrationForm', true);
            try {
                // Register user
                await registerUser(registerForm);
                window.gtag('event', 'register', {'result': 'succesful'});
                
                // Automatically log in user
                let userProfile = await loginUser(registerForm);
                setUserToken(userProfile.userToken);

                setProcessingForm('registrationForm', false);
                clearRegistrationForm();
                window.tracker.appHistory.push('/tracker/');
            } catch(err) {
                setProcessingForm('registrationForm', false);
                window.gtag('event', 'register', {'result': 'error'});
                console.error(err);
            }
        }
    }
    render() {
        const { isProcessing, registerForm } = this.props;
        return (
            <Container className="register-page">
                <Header />
                <Row className="register-page__content">
                    <Col xs={12} md={6}>
                        <Form noValidate validated={registerForm.validated} onSubmit={this.onSubmit.bind(this)}>
                            <h3>Register for a free account</h3>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    required
                                    defaultValue={registerForm.email}
                                    name="email"
                                    onChange={this.onChange.bind(this)}
                                    type="email"
                                    placeholder="Enter email" />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                        </Form.Text>
                                <Form.Control.Feedback type="invalid">
                                    We need your email, don't worry, it's safe.
                        </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    required
                                    defaultValue={registerForm.password}
                                    name="password"
                                    onChange={this.onChange.bind(this)}
                                    type="password"
                                    placeholder="Password" />
                                <Form.Control.Feedback type="invalid">
                                    You can't enter without a password
                            </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formBasicChecbox">
                                <Form.Check
                                    required
                                    custom
                                    defaultChecked={registerForm.terms}
                                    name="terms"
                                    onChange={this.onChange.bind(this)}
                                    type="checkbox"
                                    label={(<span>I agree to the <a onClick={(event) => { event.preventDefault(); event.stopPropagation(); window.tracker.appHistory.push('/tracker/terms-conditions') }} href="">terms and conditions</a></span>)} />
                                <Form.Control.Feedback type="invalid">
                                    It's this or we make our lawyers meet, but let's use this first.
                            </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={isProcessing}>
                                {isProcessing &&
                                    <Spinner animation="grow" size="sm" variant="warning" />
                                }
                                Register
                    </Button>
                        </Form>
                    </Col>
                    <Col xs={12} md={6}>
                        <h3>Features</h3>
                        <ul className="list-unstyled">
                            <Media as="li">
                                <Media.Body>
                                    <h5>Create your wishlist of products</h5>
                                    <p>
                                        Add products to your tracker list with one click using our
                                        Bookmarklet directly from Unreal Marketplace.
                        </p>
                                </Media.Body>
                            </Media>
                            <Media as="li">
                                <Media.Body>
                                    <h5>Get notified when a product goes on sale</h5>
                                    <p>
                                        You can enable sale notifier for each product individually that
                                        when your favourite Unreal Marketplace product goes on sale
                                        you will never miss out.
                        </p>
                                </Media.Body>
                            </Media>
                        </ul>
                    </Col>

                </Row>
            </Container>
        )
    }
}

export default Register = connect(mapStateToProps, mapDispatchToProps)(Register);
