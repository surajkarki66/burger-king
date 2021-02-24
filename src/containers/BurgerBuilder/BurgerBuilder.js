import React, { Component } from "react";
import { connect} from 'react-redux';



import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';


class BurgerBuilder extends Component {
    
    state = {
        purchasing: false,
        
    }

    componentDidMount () {
       // console.log(this.props);
       this.props.onInitIngredients();
    }
    updatePurchaseState( ingredients ) {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        })
        .reduce((sum, el) => {
            return sum + el;
        }, 0);
        

        return sum > 0;
        
    }


    purchaseHandler =  () => {
        if (this.props.isAuthenticated) {
            this.setState({purchasing: true});
        }

        else {
            this.props.onSetAuthRedirectPath('/checkout');  // if user is not authenticated
            this.props.history.push('/auth');
        }
       
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push({
            pathname: '/checkout',
        });  // Goes to checkout 


    }
   

  

    render() {
        const disableInfo = {
            ...this.props.ings   // Assigning state in immutable way
        };
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0  // return true or false
            //{ salad: true, meat:false}
            
        }
        let orderSummary = null;

        let burger = <Spinner />;
        if (this.props.ings) {
               burger =  (
                <Aux>
                <Burger ingredients = {this.props.ings} />
                <BuildControls
                ingredientAdded = {this.props.onIngredientAdded}
                ingredientRemoved = {this.props.onIngredientRemoved}
                disabled = {disableInfo}
                price = {this.props.price}
                isAuth = {this.props.isAuthenticated}
                purchasable = {this.updatePurchaseState(this.props.ings)} 
                ordered = {this.purchaseHandler}/>
                </Aux>
                
                );
                orderSummary =  <OrderSummary ingredients={this.props.ings}
                purchaseCanceled={this.purchaseCancelHandler}
                price = {this.props.price}
                purchaseContinued={this.purchaseContinueHandler} />;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                   {orderSummary }
                </Modal>
                {burger}
               
            </Aux>
            
        );
    }
}

const mapStateToProps =  state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null

    }
}
const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved:  (ingName) =>  dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () =>  dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)) }
}
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));