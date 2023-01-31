import React, { useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CustomInputFiled from './CustomInputFiled'

const CustomTipPage = (props: any) => {
  const [, setCustomInputValue] = React.useState(props.customInputValue);
  const [tipValueHigh, setTipValueHigh] = React.useState(false);
  const [focus] = React.useState(true);

  useEffect(() => {
    if (props.customInput) {
      setCustomInputValue(props.customInputValue);
    } else {
      setCustomInputValue(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClick = (event: any) => {
    props.handleChange(event, event.currentTarget.value === undefined ? '4' : event.currentTarget.value);
    props.handelRefMethod();
  };
  const isCharacterALetter = (val: any) => {
    return (/^-?\d*[.,]?\d*$/).test(val)
  }
  const handleOnValueChange = (e: any) => {
    const tripValue = e.target.value.includes('$');
    var convert;
    if (tripValue) {
      convert = e.target.value.substring(1)
    } else {
      convert = e.target.value;
    }
    const checkType = isCharacterALetter(convert);
    if (checkType && convert !==',' && convert !== '.' && convert !== '-') {
      const valueAmount = convert ? convert : '0';
      var value;
      if (valueAmount === "0") {
        value = 0;
      } else {
        value = valueAmount;
      }
      if (value > 500) {
        setTipValueHigh(true);
        setCustomInputValue(0);
        props.customInputChange(value)
      } else {
        setTipValueHigh(false)
        setCustomInputValue(value);
        props.customInputChange(value)
      }
    }
  };
  return (
    <>
      <div>
        <ToggleButtonGroup
          color="primary"
          value={props.tiptype}
          exclusive
          onChange={event => handleClick(event)}
          className={(tipValueHigh === true && props?.customInputValue > 500) ? 'tip-buttons error' : props.enterCutomTip}
        >
          <ToggleButton style={{ 'minWidth': '100px', 'width': '100%' }} color="primary" value="1">${props.keepchange}<small className='smallText'>keep <br></br> The change</small></ToggleButton>
          <ToggleButton style={{ 'width': '100%' }} color="primary" value="2">$1</ToggleButton>
          <ToggleButton style={{ 'width': '100%' }} color="primary" value="3">$2</ToggleButton>
          <ToggleButton style={{ 'width': '100%', 'display': `${props.customInput ? 'none' : 'block'}` }} color="primary" value="4"><span>Custom</span></ToggleButton>
          {props.customInput && focus && (
              <CustomInputFiled props={props} handleOnValueChange={handleOnValueChange} />
          )}
        </ToggleButtonGroup>
      </div>
      {tipValueHigh && props?.customInputValue > 500 && <div>
        <p style={{ color: '#C31B24', fontSize: '12px' }}>We appreciate your generosity, but tips throught the app are limited to $500.</p>
      </div>}
    </>
  );
};
export default CustomTipPage;