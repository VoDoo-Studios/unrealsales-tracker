import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Form, Button, Media, Spinner } from 'react-bootstrap';
import { setRegisterForm, clearRegistrationForm } from '../../actions/registerActions';
import { setProcessingForm } from '../../actions/appActions';

import Header from '../../components/Header/header';

import './register.css';

const mapDispatchToProps = (dispatch) => {
    return {
        updateForm: (data) => {
            let input = {
                [data.target.name]: data.target.type === 'checkbox' ? data.target.checked : data.target.value,
            };
            dispatch(setRegisterForm(input));
        },
        handleSubmit: (formData) => event => {
            const form = event.currentTarget;
            let isValid = form.checkValidity();
            event.preventDefault();
            event.stopPropagation();

            dispatch(setRegisterForm({validated: true}));
            
            if (isValid) {
                dispatch(setProcessingForm('registrationForm', true));
                return fetch('https://api.unrealsales.io/dev/profile/register', {
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
                .then(() => {
                    dispatch(setProcessingForm('registrationForm', false));
                    dispatch(clearRegistrationForm());
                    window.tracker.appHistory.push('/tracker/');
                })
                .catch(err => {
                    dispatch(setProcessingForm('registrationForm', false));
                    console.error(err);
                });
            }
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
  render() {
    const { isProcessing, updateForm, registerForm, handleSubmit } = this.props;
    return (
      <Container className="register-page">
        <Header/>
        <Row className="register-page__content">
            <Col xs={12} md={6}>
                <Form noValidate validated={registerForm.validated} onSubmit={handleSubmit(registerForm)}>
                    <h3>Register for a free account</h3>
                    <Form.Group controlId="formBasicName">
                        <Form.Row>
                            <Col>
                                <Form.Label>First name</Form.Label>
                                <Form.Control
                                    required
                                    defaultValue={registerForm.first_name} 
                                    name="first_name" 
                                    onChange={updateForm.bind(this)} 
                                    type="text" 
                                    placeholder="John" />
                                    <Form.Control.Feedback type="invalid">
                                        We have to be on first name basis if you want to use our application
                                    </Form.Control.Feedback>
                            </Col>
                            <Col>
                                <Form.Label>Last name</Form.Label>
                                <Form.Control
                                    required
                                    defaultValue={registerForm.last_name} 
                                    name="last_name" 
                                    onChange={updateForm.bind(this)} 
                                    type="text" 
                                    placeholder="Doe" />
                                    <Form.Control.Feedback type="invalid">
                                        You must have a last name, everybody has one.
                                    </Form.Control.Feedback>
                            </Col>
                        </Form.Row>  
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                            required
                            defaultValue={registerForm.email} 
                            name="email" 
                            onChange={updateForm.bind(this)} 
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
                            onChange={updateForm.bind(this)} 
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
                            onChange={updateForm.bind(this)} 
                            type="checkbox" 
                            label="I agree to the terms and conditions" />
                            <Form.Control.Feedback type="invalid">
                                It's this or we make our lawyers meet, but let's use this first.
                            </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={isProcessing}>
                        {isProcessing &&
                            <Spinner animation="grow" size="sm" variant="warning"/>
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
                            browser extension directly from Unreal Marketplace.
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
