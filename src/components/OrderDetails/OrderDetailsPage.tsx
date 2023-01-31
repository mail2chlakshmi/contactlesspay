import React, { SetStateAction, useState, useEffect } from "react";
import { Form, Formik, Field } from "formik";
import urlLogoDesktop from "./Logo.png";
import frontarrow from "./FrontArrow.png";
import TipChoicer from "../CustomTip/CustomTipPage";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function Component(props: any) {
  let history = useHistory();
  const [orderDetails] = useState(props.location.state);
  const [errors, setErrors] = useState(false);
  const [handelRef, setHandelRef] = useState(false);
  const [totalAmount] = useState(
    orderDetails?.orderAmountDue ? orderDetails?.orderAmountDue : orderDetails?.orderAmount
  );
  const [taxAmount] = useState(orderDetails?.tax);
  const [tipAmount, SetTipAmount] = useState(orderDetails?.tip || 0);
  const [email, setEmail] = useState(orderDetails?.customerEmail || "");
  const [keepchange] = useState(
    (Math.ceil(totalAmount) - totalAmount).toFixed(2)
  );
  const [customInput, setCustomInput] = useState(
    orderDetails?.tipOptions === 4 ? true : false
  );
  const [tiptype, setTiptype] = useState(orderDetails?.tipOptions?.toString());
  const [paymentTransactionId] = useState(orderDetails.paymentTransactionId);
  const [tipOptions, setTipOptions] = useState(
    orderDetails?.tipOptions?.toString() || 0
  );
  const [open, setOpen] = React.useState(false);
  const [empty, setEmpty] = React.useState(orderDetails?.tip);
  const [enterCutomTip, setEnterCutomTip] = React.useState(false);
  const [btnDisabled, setBtnDisabled] = React.useState(false);
  const [, setFocusInput] = React.useState(false);

  useEffect(() => {}, []);
  const handleBlurEmail = (e: any) => {
    const expression = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var validEmail = expression.test(String(email).toLowerCase());
    setHandelRef(false);
    if (validEmail) {
      setErrors(false);
      if(!(empty > 500)) {
        setBtnDisabled(false)
      }
    } else {
      if (email !== "") {
        setErrors(true);
        setBtnDisabled(true);
      } else {
        if (email === "") {
          setErrors(false);
          if(!(empty > 500)) {
            setBtnDisabled(false)
          }
        } else {
          setErrors(false);
          setBtnDisabled(true);
       }
      }
    }
  };

  const handelRefMethod = () => {
    setHandelRef(true);
  };

  var isOnIOS = navigator.userAgent.match(/iPad/i)|| navigator.userAgent.match(/iPhone/i);
  var eventName = isOnIOS ? "pagehide" : "pagehide"; 
  window.addEventListener(eventName, unloadPage, false);
  function unloadPage() {
    const TransactionId =
      localStorage.getItem("newPaymentTransactionId") !== ""
        ? localStorage.getItem("newPaymentTransactionId")
        : orderDetails?.paymentTransactionId;
    if (
      localStorage.getItem("closedBrowser") === null ||
      localStorage.getItem("closedBrowser") === ""
    ) {
      var data = "test";
      var url = `https://appsrv-sonic-dev01-contactless-payment-dpp-be.azurewebsites.net/api/payment/close/${TransactionId}`;
      var makeApi = navigator.sendBeacon(url, data);
      var responce = axios.get(
        `https://appsrv-sonic-dev01-contactless-payment-dpp-be.azurewebsites.net/api/payment/close/${TransactionId}`
      );
      for (var i = 0; i < 500; i++) {
        console.log(makeApi, responce, i);
      }
      localStorage.setItem("closedBrowser", "closedBrowser");
      return undefined;
    }
  }

  const customInputChange = (value: any) => {
    if (value) {
      if (value > 500) {
        SetTipAmount(0);
        setEmpty(value);
        setBtnDisabled(true);
      } else {
        SetTipAmount(parseFloat(value));
        setEmpty(value);
        setEnterCutomTip(true);
        if (errors) {
          setBtnDisabled(true);
        } else {
          setBtnDisabled(false);
        }
      }
    } else {
      SetTipAmount(0);
      setEmpty("");
    }
  };
  const enterMethod = () => {
    setEnterCutomTip(true);
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    tiptype: string
  ) => {
    setEnterCutomTip(false);
    setTiptype(tiptype);
    if (tiptype === "4") {
      setCustomInput(true);
      if (orderDetails?.tip) {
        SetTipAmount(0);
      }
      setTipOptions(4);
      setEmpty("");
      SetTipAmount(0);
      setFocusInput(true);
    } else {
      setCustomInput(false);
    }
    if (tiptype === "2") {
      setTipOptions(2);
      SetTipAmount(1);
      setEmpty("");
    }
    if (tiptype === "3") {
      setTipOptions(3);
      SetTipAmount(2);
      setEmpty("");
    }
    if (tiptype === "1") {
      const value = (Math.ceil(totalAmount) - totalAmount).toFixed(2);
      setTipOptions(1);
      SetTipAmount(Number(value));
      setEmpty("");
    }
    if (tiptype === null) {
      setTipOptions(0);
      SetTipAmount(0);
    }
    if(errors) {  
    setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
 };

  const next = () => {
    setOpen(true);
    const params = {
      orderId: orderDetails?.orderId,
      tax: taxAmount,
      orderAmount: totalAmount,
      tipOptions: parseInt(tipOptions),
      tip: tipAmount,
      totalAmount:
        Math.round((totalAmount + tipAmount + Number.EPSILON) * 100) / 100,
      customerEmail: email,
    };
    const getConfigData = {
      ...orderDetails,
      ...params,
    };
    axios
      .post(
        `https://appsrv-sonic-dev01-contactless-payment-dpp-be.azurewebsites.net/api/payment/customerInfo/${paymentTransactionId}`,
        params
      )
      .then((response) => {
        console.log("customerInfo", response.data);
        if (response.data.status === "SUCCESS") {
          let path = "/orderpayment";
          history.push(path, getConfigData);
        } else {
          let path = "/orderfailure";
          let errorData = {};
          history.push(path, errorData);
        }
      });
  };

  const closedTab = () => {
    let path = "/ordercancel";
    history.push(path, orderDetails);
  }

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
          <h1 className="amount">${(totalAmount + tipAmount).toFixed(2)}</h1>
        </div>
        {/* customer info */}
        <div className="contactlessPayForm">
          <div className="formFields">
            <section aria-label="Customer Info Section" className="section">
              <div className="customerInfo">
                <h2>
                  Would you like to receive an email receipt? Enter your email
                  below
                </h2>
                <Formik
                  initialValues={{}}
                  onSubmit={(values, actions) => {
                    setTimeout(() => {
                      alert(JSON.stringify(values, null, 2));
                      actions.setSubmitting(false);
                    }, 1000);
                  }}
                >
                  <Form className="field">
                    <div className="display-flex">
                      <label htmlFor="email">
                        EMAIL <span className="optional">(OPTIONAL)</span>
                      </label>
                      <Field
                        id="email"
                        name="email"
                        onKeyPress={handleBlurEmail}
                        onBlur={handleBlurEmail}
                        value={email}
                        onChange={(e: {
                          target: { value: SetStateAction<string> };
                        }) => setEmail(e.target.value)}
                        className={errors ? "invalid" : "valid"}
                        placeholder="Enter email"
                        maxLength={256}
                      />
                      {errors && (
                        <div className="error-wrapper">
                          <p>Please enter valid email address</p>
                        </div>
                      )}
                    </div>
                    <p>Your email address will not be used for...</p>
                  </Form>
                </Formik>
              </div>
            </section>
          </div>
          <hr></hr>
          {/* Add tips */}
          <div className="addTips">
            <section aria-label="Add Tip Section" className="section">
              <h6 className="formSectionTip">Add a Tip?</h6>
              <div>
                <TipChoicer
                  // eslint-disable-next-line no-mixed-operators
                  enterCutomTip={
                    (tipOptions === 4 && enterCutomTip && orderDetails.tip) ||
                    empty > 0
                      ? "tip-buttons enter-color"
                      : "tip-buttons"
                  }
                  enterCutomInputTip={"customer-input"}
                  enterMethod={enterMethod}
                  customInputValue={empty}
                  customInputChange={customInputChange}
                  tiptype={tiptype}
                  customInput={customInput}
                  keepchange={keepchange}
                  handleChange={handleChange}
                  // ref={ref}
                  focusInput={orderDetails.tip > 0 && empty > 0}
                  handelRef={handelRef}
                  handelRefMethod={handelRefMethod}
                />
              </div>
            </section>
          </div>
          <hr></hr>
          <div className="order-total">
            <div>
              <p>Subtotal</p>
              <p>${(totalAmount - taxAmount).toFixed(2)} </p>
            </div>
            <div>
              <p>Tip</p>
              <p>${tipAmount.toFixed(2)}</p>
            </div>
            <div>
              <p>Tax</p>
              <p>${taxAmount.toFixed(2)}</p>
            </div>
            <div>
              <p>Total</p>
              <p>${(totalAmount + tipAmount).toFixed(2)}</p>
            </div>
          </div>
          <div>
            <button
              disabled={btnDisabled}
              className="btn-style"
              type="submit"
              onClick={next}
            >
              Next{" "}
              <img
                src={frontarrow}
                alt="frontarrow"
                style={{ marginLeft: "10px", marginBottom: "-6px" }}
              />
            </button>
          </div>
          <div>
            <button className="btn-style btn-link" style={{color:'#E40046', lineHeight: '80px'}} onClick={closedTab} type="submit">
              Change Payment Method
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
