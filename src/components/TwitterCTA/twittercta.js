import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { FaTwitter } from 'react-icons/fa';
import { setTwitterCTAState } from '../../actions/appActions';
import './twittercta.css';

const mapStateToProps = (state) => {
    return {
        hide: state.app.twitterCTAState,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        setTwitterCTAState: (state) => {
            dispatch(setTwitterCTAState(state));
        }
    };
};

class TwitterCTA extends React.PureComponent {
    onHide() {
        const { setTwitterCTAState } = this.props;

        setTwitterCTAState(true);
    }
    onFollow() {
        const { setTwitterCTAState } = this.props;

        setTwitterCTAState(true);
        window.location.href = 'https://twitter.com/VoDooStudios?ref_src=twsrc%5Etfw';
    }
    render() {
        const { hide } = this.props;

        if (hide) return null;
        return (
            <Modal
                show
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <FaTwitter size="24" className="unreal-tracker__twitter" />Follow us on Twitter
              </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Get the latest about UnrealSales or just come by and say hi!
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onFollow.bind(this)}><FaTwitter size="24"/> Follow</Button>
                    <Button variant="light" onClick={this.onHide.bind(this)}>Not interested</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default TwitterCTA = connect(mapStateToProps, mapDispatchToProps)(TwitterCTA);
