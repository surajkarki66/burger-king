import React,  {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {

    checkoutCanceledHandler = () => {
        this.props.history.goBack();
    }
    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }
    render () {
        let summary = <Redirect to="/" />
        if (this.props.ings) {
            const purchasedRedirect = this.props.purchased ? <Redirect to="/" /> : null;  //after filling form redirect to home

            summary = (
            <div>
                {purchasedRedirect}
                <CheckoutSummary
                    ingredients={this.props.ings}
                    checkoutCanceled = {this.checkoutCanceledHandler}
                    checkoutContinued= {this.checkoutContinuedHandler}  />
                    <Route 
                        path={this.props.match.path + '/contact-data'}
                        component={ContactData} />

            </div>);

               
        }
        
        return summary
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        purchased: state.orders.purchased
        
    };
};

export default connect(mapStateToProps)(Checkout);