import { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.scss";
import OrderDetailsPage from "./components/OrderDetails/OrderDetailsPage";
import OrderPaymentPage from "./components/OrderPayment/OrderPaymentPage";
import OrderPaymentSuccessPage from "./components/OrderPayment/OrderPaymentSuccessPage";
import OrderPaymentFailurePage from "./components/OrderPayment/OrderPaymentFailurePage";
import OrderCancelPage from "./components/OrderCancel/OrderCancelPage";
import OrderLoadingPage from "./components/OrderLoading/OrderLoadingPage";

// set cookie for broswercloseevennt api
localStorage.setItem("closedBrowser", "");
localStorage.setItem("newPaymentTransactionId", "");


class App extends Component {
  render() {

    return (
      <div>
        <div className="container color-panel">
          <Switch>
            <Route exact path="/" component={OrderLoadingPage} />
            <Route exact path="/orderdetails" component={OrderDetailsPage} />
            <Route exact path="/orderpayment" component={OrderPaymentPage} />
            <Route exact path="/ordersuccess" component={OrderPaymentSuccessPage} />
            <Route exact path="/orderfailure" component={OrderPaymentFailurePage} />
            <Route exact path="/ordercancel" component={OrderCancelPage} />
          </Switch>
        </div>
      </div>
    );

  }
}

export default App;
