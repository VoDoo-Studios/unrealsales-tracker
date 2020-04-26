import React from 'react';
import { connect } from 'react-redux';
import { Container, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';

import { resetPassword, setResetForm } from '../../actions/registerActions';
import { setProcessingForm } from '../../actions/appActions';

import Header from '../../components/Header/header';

import './reset.css';

const mapDispatchToProps = (dispatch) => {
    return {
        setProcessingForm: (form, value) => {
            return dispatch(setProcessingForm(form, value));
        },
        setResetForm: (data) => {
            return dispatch(setResetForm(data));
        },
        resetPassword: (form) => {
            return dispatch(resetPassword(form));
        }
    }
}

const mapStateToProps = (state) => {
    const isProcessing = state?.app?.processing?.resetForm;
    const resetForm = state?.register?.resetForm ?? {};
    const resetFormSubmitted = state?.app?.processing?.resetFormSubmitted;
    return {
        resetFormSubmitted,
        isProcessing,
        resetForm,
    };
};

class Reset extends React.PureComponent {
    onChange(data) {
        const { setResetForm } = this.props;
        let input = {
            [data.target.name]: data.target.value,
        };
        setResetForm(input);
    }
    async onSubmit(event) {
        const { setProcessingForm, setResetForm, resetPassword, resetForm } = this.props;
        const form = event.currentTarget;
        let isValid = form.checkValidity();
        event.preventDefault();
        event.stopPropagation();
        setResetForm({validated: true});
        if (isValid) {
            setProcessingForm('resetForm', true)
            try {
                await resetPassword(resetForm);
                setProcessingForm('resetForm', false);
                window.gtag('event', 'reset', {'result': 'succesful'});
            } catch(err) {
                window.gtag('event', 'reset', {'result': 'error'});
                setProcessingForm('resetForm', false);
                console.error(err);
            }
            setProcessingForm('resetFormSubmitted', true);
        }
    }
    render() {
        const { resetForm, isProcessing, resetFormSubmitted } = this.props;
        return (
            <Container className="reset-page">
                <Header />
                <Row className="reset-page__content">
                    <Col md={{ span: 6, offset: 3 }}>
                        {resetFormSubmitted &&
                            <Alert variant="success">
                                <Alert.Heading>Password reset</Alert.Heading>
                                <p>
                                    An email to the provided email address had been sent, please follow the instructions to complete the password reset.
                                </p>
                            </Alert>
                        }
                        {!resetFormSubmitted &&
                            <Form noValidate validated={resetForm.validated} onSubmit={this.onSubmit.bind(this)}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        required
                                        defaultValue={resetForm.email} 
                                        onChange={this.onChange.bind(this)} 
                                        name="email"
                                        type="email" 
                                        placeholder="Enter email" />
                                </Form.Group>
                                <Button disabled={isProcessing} variant="primary" type="submit">
                                    {isProcessing &&
                                        <Spinner animation="grow" size="sm" variant="warning"/>
                                    }
                                    Send reset link
                                </Button>
                            </Form>
                        }
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Reset = connect(mapStateToProps, mapDispatchToProps)(Reset);
