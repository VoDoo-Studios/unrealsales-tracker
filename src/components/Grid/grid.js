import React from "react";
import { connect } from "react-redux";
import { Spinner, CardColumns } from "react-bootstrap";
// import { getCurrencyRates } from '../../actions/appActions';
import { selectCurrency, selectCurrencyRate } from "../../selectors/currency";
import { selectSelectedList, selectList } from "../../selectors/lists";

import Product from "../Product/product";

import "./grid.css";

const mapDispatchToProps = (dispatch) => {
  return {
    // getCurrencyRates: (baseRate) => dispatch(getCurrencyRates(baseRate)),
  };
};
const mapStateToProps = (state) => {
  const isProcessing =
    (state.app.processing && state.app.processing.retrieveLists) || false;
  const products = selectList(state, selectSelectedList(state)).items || false;
  const currency = selectCurrency(state);
  const currencyRate = selectCurrencyRate(state, currency);
  return {
    isProcessing,
    products,
    currency,
    currencyRate,
  };
};

class Grid extends React.PureComponent {
  render() {
    const { isProcessing, products } = this.props;
    if (isProcessing) {
      return (
        <div className="grid-loader">
          <Spinner animation="border" size="sm" />
          <Spinner animation="border" />
          <Spinner animation="grow" size="sm" />
          <Spinner animation="grow" />
          <span className="sr-only">Loading...</span>
        </div>
      );
    }
    if (products.length === 1) {
      return (
        <div className="grid-noproducts">
          <h5>Looks like you haven't added anything to your list yet!</h5>
          <p>
            Try adding something now either by using "Add product" at the top of
            this page or drag and drop this link (
            <a href={this.constructAddLink()}>Add to Wishlist</a>) into you
            Bookmarks and press it when you are on a product page on Unreal
            Marketplace.
          </p>
        </div>
      );
    }
    return (
      <CardColumns className="grid">
        {products.length > 1 &&
          products.map((product) => {
            if (product === "empty") return null;
            return <Product key={product} slug={product} />;
          })}
      </CardColumns>
    );
  }
  constructAddLink() {
    let href = window.location.href;
    let link =
      href +
      (href.substring(href.length - 1) === "/" ? "" : "/") +
      "add?product=";
    // eslint-disable-next-line no-script-url
    return (
      'javascript:(function(){f="' +
      link +
      '"+window.location.href;location.href=f;})()'
    );
  }
}

export default Grid = connect(mapStateToProps, mapDispatchToProps)(Grid);
