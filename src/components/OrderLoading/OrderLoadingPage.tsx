import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";

const baseURL = "https://appsrv-sonic-dev01-contactless-payment-dpp-be.azurewebsites.net/api/payment/initialization";

const OrderLoadingDetails = (props: any) => {
  let history = useHistory();
  const [open] = React.useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(props.location.search);
    const params = {
      storeId: Number(urlParams.get('storeId')),
      stallId: Number(urlParams.get('stallId')),
      orderId: (urlParams.get('ticketId')),
      subTicketId: Number(urlParams.get('subTicketId')),
      subTotalOrderAmt: Number(urlParams.get('subTotalWithoutTax')),
      tax: Number(urlParams.get('tax')),
      orderAmount: Number(urlParams.get('amountDue')),
     };
    
      axios.post(baseURL, params).then((response) => {
      console.log('initialization API');
      if (response.status === 200) {
        setTimeout(
          () => {
            let path = `/orderdetails`;
            let state = response.data;

            let data = params;
            let sendData = {
              ...state, ...data
            }
            history.push(path, sendData);
          },
          2000
        );
      } else {
        let path = '/orderfailure';
        let errorData = {
        };
        history.push(path, errorData);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      <Backdrop
        sx={{ background: '#FFF', color: '#E40046', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};
export default OrderLoadingDetails;
