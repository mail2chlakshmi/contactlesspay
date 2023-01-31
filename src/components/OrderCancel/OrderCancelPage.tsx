import React, { useState } from "react";
import FaExclamation from "./cancel.png";
import axios from "axios";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Cancel = (props: any) => {
  const [getData] = useState(props.location.state);
  const [open, setOpen] = React.useState(false);
  
  const gotIt = () => {
    setOpen(true)
    axios.get(`https://appsrv-sonic-dev01-contactless-payment-dpp-be.azurewebsites.net/api/payment/close/${getData?.getState?.paymentTransactionId ? getData?.getState?.paymentTransactionId : getData?.paymentTransactionId}`).then((response) => {
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
        <div className="contactlessPayForm cancelpage">
          <div className="cancelpage-text">
            <div className="failurepage-icon">
              <img src={FaExclamation} alt="logo" />
            </div>
            <p>Please Select an Alternative Payment Method on the Stall Screen</p>
          </div>
          <div className="bottm-alin-btn">
            <button onClick={gotIt} className="btn-style">
              Got It
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Cancel;
