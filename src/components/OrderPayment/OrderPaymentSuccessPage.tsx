import React, { useState, useEffect } from "react";
import FaCheck from "./success.png";
import axios from "axios";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function Component(props: any) {
  const [getState] = useState(props.location.state);
  const [open, setOpen] = React.useState(false);

  const gotIt = () => {
    setOpen(true)
    axios.get(`https://appsrv-sonic-dev01-contactless-payment-dpp-be.azurewebsites.net/api/payment/close/${getState?.paymentTransactionId}`).then((response) => {
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
        sx={{ background: '#FFF', color: '#E40046', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="App">
        <div className="contactlessPayForm successPage">
          <div className="successpage-text">
            <div className="successpage-icon">
              <img src={FaCheck} alt="logo" />
            </div>
            <h1>Thank You!</h1>
            <p>we'll race your order out quickly!</p>
          </div>
          <div className="bottm-alin-btn">
            <button className="btn-style" onClick={gotIt}>
              Got It
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
