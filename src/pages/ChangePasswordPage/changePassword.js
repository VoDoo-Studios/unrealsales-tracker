import React from 'react';
import { connect } from 'react-redux';
import { Container, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { changePassword, setChangePasswordForm } from '../../actions/registerActions';
import { setProcessingForm } from '../../actions/appActions';
import { getUrlParameter } from '../../modules/query';

import Header from '../../components/Header/header';

import './changepassword.css';

const mapDispatchToProps = (dispatch) => {
    return {
        setProcessingForm: (form, value) => {
            return dispatch(setProcessingForm(form, value));
        },
        setChangePasswordForm: (data) => {
            return dispatch(setChangePasswordForm(data));
        },
        changePassword: (form) => {
            return dispatch(changePassword(form));
        }
    }
}

const mapStateToProps = (state) => {
    const isProcessing = state?.app?.processing?.changePasswordForm;
    const changePasswordForm = state?.register?.changePasswordForm ?? {};
    return {
        isProcessing,
        changePasswordForm,
    };
};

class ChangePassword extends React.PureComponent {
    onChange(data) {
        const { setChangePasswordForm } = this.props;
        let input = {
            [data.target.name]: data.target.value,
            retypeInvalid: false,
            systemFail: false,
        };
        setChangePasswordForm(input);
    }

    async onSubmit(event) {
        const { setProcessingForm, changePassword, setChangePasswordForm, changePasswordForm } = this.props;
        const form = event.currentTarget;
        let isValid = form.checkValidity();
        event.preventDefault();
        event.stopPropagation();
        setChangePasswordForm({validated: true});
        if (changePasswordForm.password !== changePasswordForm.passwordRetype) {
            isValid = false;
            setChangePasswordForm({retypeInvalid: true});
        }

        if (isValid) {
            setProcessingForm('changePasswordForm', true)
            try {
                const payload = {
                    resetId: getUrlParameter('resetId'),
                    password: changePasswordForm.password,
                }
                await changePassword(payload);
                setProcessingForm('changePasswordForm', false);
                window.gtag('event', 'changepassword', {'result': 'succesful'});
                window.tracker.appHistory.push('/tracker/login');
            } catch(err) {
                window.gtag('event', 'changepassword', {'result': 'error'});
                setProcessingForm('changePasswordForm', false);
                setChangePasswordForm({systemFail: true})
                console.error(err);
            }
        }
        
    }
    render() {
        const { isProcessing, changePasswordForm } = this.props;

        if (!getUrlParameter('resetId')) {
            return (
                <Container className="changepassword-page">
                    <Header />
                        <Row className="changepassword-page__content">
                            <p>Invalid link</p>
                        </Row>
                </Container>
            )
        }

        return (
            <Container className="changepassword-page">
                <Header />
                <Row className="changepassword-page__content">
                    <Col md={{ span: 6, offset: 3 }}>
                        <Form noValidate validated={changePasswordForm.validated} onSubmit={this.onSubmit.bind(this)}>
                            {changePasswordForm.systemFail &&
                                <Alert variant="danger">
                                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                    <p>
                                        It seems we could not change your password, probably the reset link had expired, please retry the process.
                                    </p>
                                </Alert>
                            }
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    required
                                    minLength="6"
                                    defaultValue={changePasswordForm.password} 
                                    onChange={this.onChange.bind(this)}
                                    name="password"
                                    type="password"/>
                                    <Form.Control.Feedback type="invalid">
                                        Password must consist of minimum 6 characters.
                                    </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="passwordRetype">
                                <Form.Label>Retype password</Form.Label>
                                <Form.Control
                                    required
                                    isInvalid={changePasswordForm.retypeInvalid}
                                    defaultValue={changePasswordForm.passwordRetype} 
                                    onChange={this.onChange.bind(this)}
                                    name="passwordRetype"
                                    type="password" />
                                    <Form.Control.Feedback type="invalid">
                                        Passwords must match.
                                    </Form.Control.Feedback>
                            </Form.Group>
                            <Button disabled={isProcessing} variant="primary" type="submit">
                                {isProcessing &&
                                    <Spinner animation="grow" size="sm" variant="warning"/>
                                }
                                Change password
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ChangePassword = connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
