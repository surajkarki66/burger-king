import React, {Component} from 'react';
import {connect} from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: '',
        validation: {
          required: true,
          maxLength: 40
        },
        valid: false,
        touched: false
      },

      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },

      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Zipcode'
        },
        value: '',
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5,
          isNumeric: true
        },
        valid: false,
        touched: false
      },

      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false
      },

      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Email'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            {
              value: 'fastest',
              displayValue: 'Fastest'
            }, {
              value: 'cheapest',
              displayValue: 'Cheapest'
            }
          ]
        },
        value: 'fastest',
        touched: false,
        valid: true,
        validation: {}

      }
    },
    formIsValid: false
  }

  checkValidity(value, rules) {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {      // copy
      ...this.state.orderForm
    };

    const updatedFormElement = {  //copy
      ...updatedOrderForm[inputIdentifier]
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    //console.log(updatedOrderForm)
    //console.log(update)
    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});

  }

  orderHandler = (event) => {
    event.preventDefault();
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    }
    //console.log(formData)
    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData,
      userId: this.props.userId
    }

    this.props.onOrderBurger(order, this.props.token);

  }

  render() {
    //console.log(this.state.orderForm);
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({id: key, config: this.state.orderForm[key]});
    }
    // console.log(formElementsArray)
    let form = (
      <form onSubmit={this.orderHandler}>

        {formElementsArray.map(formElement => (<Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          invalid={!formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
          changed=
          {(event)=> this.inputChangedHandler(event, formElement.id)}/>))}
        <Button
          btnType="Success"
          disabled={!this.state.formIsValid}
          clicked={this.orderHandler}>ORDER</Button>

      </form>
    );
    if (this.props.loading) {
      form = (<Spinner/>)
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your ContactData</h4>
        {form}
      </div>
    );
  }

}

const mapStateToProps = state => {
  return {
      ings: state.burgerBuilder.ingredients,
      price: state.burgerBuilder.totalPrice,
      loading: state.orders.loading,
      token: state.auth.token,
      userId: state.auth.userId
    
    }
}

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token)) // dispatching action creators

  };

}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));