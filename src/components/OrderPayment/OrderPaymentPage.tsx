import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import urlLogoDesktop from "./Logo.png";
import backarrow from "./BackArrow.png";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

declare global {
  interface Window {
    ucomSDK?: any;
  }
}
const { ucomSDK } = window;
export default function Component(props: any) {
  let history = useHistory();
  const [getState] = useState(props.location.state);
  const [open, setOpen] = React.useState(true);
  const [paymentLoad, setPaymentLoad] = React.useState(true);
  const [totalAmount] = useState(getState?.totalAmount);
  var configs = {
    accessToken: getState?.accessTokenId,
    apiKey: "K1QOtkZ1Amg0LpyBY97MzRyV1LvsV1mR",
    pageUrl: getState?.hostedPageLink,
    mountId: "ucom-container",
    encryptionKey: getState?.publicKey,
    redirectUrl: getState?.redirectURL,
    debug: true,
  };

  useEffect(() => {
    setTimeout(() => {
      loadPaymentPage(configs);
      setTimeout(() => {
        setPaymentLoad(false);
      }, 2200);
    }, 2000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paymentCallBack = (response: any) => {
    setOpen(true);
    const data = JSON.parse(response);
    console.log("UCOM", response);
    if (data?.token?.tokenId) {
      callSuccesAPI(response);
      ucomSDK.stop();
    } else {
      console.log("111111111");
      let path = "/orderfailure";
      // error go to whoops page
      var responseData = JSON.parse(response);
      let errorData = {
        icon: true,
        url: "payment",
        button: true,
        subtext:
          "Please try again, or follow the instructions  on the POPs screen change the payment method or scan QR code again.",
        responseData,
        getState,
      };
      history.push(path, errorData);
    }
  };
  const callSuccesAPI = (params: any) => {
    var requestParams = JSON.parse(params);
    var request = {
      orderId: getState?.orderId,
      storeId: getState?.storeId,
      stallId: getState?.stallId,
      subTicketId: getState?.subTicketId,
      totalAmount: getState?.totalAmount,
      token: {
        tokenId: requestParams.token.tokenId,
        tokenProvider: requestParams.token.tokenProvider,
        tokenType: requestParams.token.tokenType,
      },
      credit: {
        nameOnCard: requestParams.credit.nameOnCard,
        cardType: requestParams.credit.cardType,
        alias: requestParams.credit.alias,
        billingAddress: {
          postalCode: requestParams.credit.billingAddress.postalCode,
        },
      },
    };

    axios
      .post(
        `https://appsrv-sonic-dev01-contactless-payment-dpp-be.azurewebsites.net/api/payment/${getState?.paymentTransactionId}/sales/${getState?.accessTokenId}`,
        request
      )
      .then((response) => {
        console.log("callSuccesAPI", response.data);
        if (response.data.salesStatus === "SUCCESS") {
          setTimeout(() => {
            let path = "/ordersuccess";
            history.push(path, getState);
          }, 2000);
        } else {
          setTimeout(() => {
            console.log("2222222222");
            let path = "/orderfailure";
            var responseData = response.data;
            let errorData = {
              icon: false,
              url: "",
              button: false,
              subtext:
                response.data.counter >= 3
                  ? "Too many attempts, please select another payment method on POPs screen to complete the payment"
                  : "Please try again, or follow the instructions  on the POPs screen change the payment method or scan QR code again.",
              responseData,
              getState,
            };
            history.push(path, errorData);
          }, 2000);
        }
      })
      .catch((err) => { });
  };

  // uCom Payment Load
  const loadPaymentPage = (configs: any) => {
    // if any error need to go woops page
    ucomSDK?.init(configs, paymentCallBack, true);
    ucomSDK?.start();
    setOpen(false);
  };
  const goBack = () => {
    let path = "/orderdetails";
    history.push(path, getState);
  };

  const closedTab = () => {
    let path = "/ordercancel";
    history.push(path, getState);
  };

  return (
    <>
      <Backdrop
        sx={{
          background: "#FFF",
          color: "#E40046",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="App">
        {/* logo */}
        <div className="sticky-top" aria-label="Contactless Header">
          <nav className="navigation">
            <div className="logoContainer">
              <a href="/" className="logo">
                <img src={urlLogoDesktop} alt="logo" />
              </a>
            </div>
          </nav>
        </div>
        {/* total Order */}
        <div className="orderInfo">
          <h3 className="orderTotal">Order Total</h3>
          <h1 className="amount">${totalAmount.toFixed(2)}</h1>
        </div>
        {/* payment info */}
        <div className="contactlessPayForm">
          <div className="formFields">
            <section aria-label="payment Info Section" className="paymentInfo">
              <h2>Payment Info</h2>
              {paymentLoad && (
                <div style={{ 'display': 'flex', justifyContent: 'center' }}>
                  <div className="loader2"></div>
                </div>
              )}
              <div id="ucom-container" style={{height: '635px'}}></div>
              <p id="demo" style={{ display: "none" }}></p>
            </section>
          </div>
          <div>
            <button className="btn-style btn-link" onClick={goBack} type="submit">
              <img src={backarrow} alt="backarrow" style={{ marginBottom: "-6px" }} />
              {" "} Go Back
            </button>
          </div>
          <div>
            <button className="btn-style btn-link" style={{ color: '#E40046' }} onClick={closedTab} type="submit">
              Change Payment Method
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
