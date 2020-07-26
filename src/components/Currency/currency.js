import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { setCurrency } from '../../actions/appActions';
import { selectCurrency } from '../../selectors/currency';
import './currency.css';

const mapStateToProps = (state) => {
    const currency = selectCurrency(state);

    return {
        currency,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        setCurrency: (currency) => {
            dispatch(setCurrency(currency));
        }
    };
};

class Currency extends React.PureComponent {
    onSelect(eventKey, event) {
        const { setCurrency } = this.props;
        window.gtag('event', 'tracker', {'type': 'currency', 'currency': event.target.innerHTML})
        setCurrency(event.target.innerHTML);
    }
    render() {
        const { currency } = this.props;
        return (
            <div>
                <Dropdown onSelect={this.onSelect.bind(this)}>
                    <Dropdown.Toggle variant="secondary">
                        {currency}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item>USD</Dropdown.Item>
                        <Dropdown.Item>EUR</Dropdown.Item>
                        <Dropdown.Item>GBP</Dropdown.Item>
                        <Dropdown.Item>CAD</Dropdown.Item>
                        <Dropdown.Item>RUB</Dropdown.Item>
                        <Dropdown.Item>JPY</Dropdown.Item>
                        <Dropdown.Item>HKD</Dropdown.Item>
                        <Dropdown.Item>CHF</Dropdown.Item>
                        <Dropdown.Item>CNY</Dropdown.Item>
                        <Dropdown.Item>NZD</Dropdown.Item>
                        <Dropdown.Item>ISK</Dropdown.Item>
                        <Dropdown.Item>PHP</Dropdown.Item>
                        <Dropdown.Item>SEK</Dropdown.Item>
                        <Dropdown.Item>DKK</Dropdown.Item>
                        <Dropdown.Item>NOK</Dropdown.Item>
                        <Dropdown.Item>HUF</Dropdown.Item>
                        <Dropdown.Item>CZK</Dropdown.Item>
                        <Dropdown.Item>RON</Dropdown.Item>
                        <Dropdown.Item>IDR</Dropdown.Item>
                        <Dropdown.Item>INR</Dropdown.Item>
                        <Dropdown.Item>BRL</Dropdown.Item>
                        <Dropdown.Item>HRK</Dropdown.Item>
                        <Dropdown.Item>THB</Dropdown.Item>
                        <Dropdown.Item>MYR</Dropdown.Item>
                        <Dropdown.Item>TRY</Dropdown.Item>
                        <Dropdown.Item>ZAR</Dropdown.Item>
                        <Dropdown.Item>MXN</Dropdown.Item>
                        <Dropdown.Item>SGD</Dropdown.Item>
                        <Dropdown.Item>AUD</Dropdown.Item>
                        <Dropdown.Item>ILS</Dropdown.Item>
                        <Dropdown.Item>KRW</Dropdown.Item>
                        <Dropdown.Item>PLN</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        )
    }
}

export default Currency = connect(mapStateToProps, mapDispatchToProps)(Currency);
