import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import FaTimes from "./failure.png";
import FaExclamation from "./exclam.png";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const FailurePage = (props: any) => {
  let history = useHistory();
  const [getState] = useState(props.location.state);
  const [errorText] = useState(getState?.responseData?.response?.message)
  const [open, setOpen] = React.useState(false);
  const [button] = React.useState(getState?.button);
  const [subText] = React.useState(getState?.subtext);
  const [icon] = React.useState(getState?.icon ? getState?.icon : false);
  const [mainTitle] = React.useState(getState?.url === 'payment' ? 'Whoops!' : 'Sorry, Payment Failed');


  const onCancel = () => {
    let path = "/ordercancel";
    history.push(path, getState);
  };

  const onTryAgain = () => {
    setOpen(true);
    axios.get(`https://appsrv-sonic-dev01-contactless-payment-dpp-be.azurewebsites.net/api/payment/renew/${getState?.getState?.paymentTransactionId}`).then((response) => {
      console.log('tryagain renewAPI', response.data);
      localStorage.setItem('newPaymentTransactionId', response.data.paymentTransactionId)
      if (response.status === 200) {
        setTimeout(
          () => {
            let path = "/orderpayment";
            response.data.subTotalOrderAmt = getState?.getState?.subTotalOrderAmt
            response.data.customerEmail = getState?.getState?.customerEmail
            history.push(path, response.data);
          },
          1000
        );
      } else {
        console.log('error');
      }
    }).catch(err => { })

  }

  const onRefreshPage = () => {
    setOpen(true);

    axios.post(`https://appsrv-sonic-dev01-contactless-payment-dpp-be.azurewebsites.net/api/payment/renew/${getState?.getState?.paymentTransactionId}`, getState?.responseData).then((response) => {
      console.log('renewAPI', response.data);
      if (response.status === 200) {
        setTimeout(
          () => {
            let path = "/orderpayment";
            response.data.subTotalOrderAmt = getState?.getState?.subTotalOrderAmt
            response.data.customerEmail = getState?.getState?.customerEmail
            history.push(path, response.data);
          },
          2000
        );
      } else {
        console.log('error');
      }
    }).catch(err => { })

  }
  const gotIt = () => {
    setOpen(true)
    axios.get(`https://appsrv-sonic-dev01-contactless-payment-dpp-be.azurewebsites.net/api/payment/close/${getState?.getState?.paymentTransactionId}`).then((response) => {
      console.log('gotItAPI One', response.data);
      if (response.data) {
        setTimeout(
          () => {
            localStorage.setItem("closedBrowser", "closedBrowser");
            setOpen(false)
            window.open("https://order.sonicdrivein.com/", "_self");
          },
          2000
        );
      } else {
        setTimeout(
          () => {
            setOpen(false)
          },
          2000
        );
      }
    }).catch(err => {
      setOpen(false)
    })
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
        {/* success page */}
        <div className="contactlessPayForm failurepage">
          <div className="failurepage-text">
            <div className="failurepage-icon">
              <img src={icon ? FaExclamation : FaTimes} alt="logo" />
            </div>
            <h1>{mainTitle}</h1>
            <p>Looks like there was a problem </p>
            <p>{errorText}</p>
            {button && (<p className="sub-text">
              Please refresh page to continue
            </p>)}
            {!button && (<p className="sub-text">
              {subText}
            </p>)}
          </div>
          <div className="bottm-alin-btn">
            {!button && !(getState?.responseData?.counter >= 3) && (<button onClick={onTryAgain} className="btn-style">Try Again</button>)}
            {button && (<button onClick={onRefreshPage} className="btn-style">Refresh Page</button>)}
            {button && (<button className="btn-style btn-link" style={{ color: '#E40046', lineHeight: '80px' }} onClick={onCancel} type="submit">Change Payment Method</button>)}
            {!button && (getState?.responseData?.counter >= 3) && (<button onClick={gotIt} className="btn-style">Got It</button>)}
            {!button && !(getState?.responseData?.counter >= 3) && (<button className="btn-style btn-link" onClick={onCancel}>Cancel</button>)}
          </div>
        </div>
      </div>
    </>
  );
};
export default FailurePage;
