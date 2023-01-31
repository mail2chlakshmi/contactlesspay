import TextField from '@mui/material/TextField';

const CustomInputFiled = (props: any) => {
    return (
        <div
        className={props.props?.customInputValue ? props.props?.customInputValue > 500 ? 'cust-bg-invalid' : 'cust-bg' : 'cust-tip'}
      >
        <TextField
          className={(props.props.tipValueHigh === true && props.props?.customInputValue > 500) ? 'customer-input' : props.props.enterCutomInputTip}
          value={props.props?.customInputValue ? '$' + props.props?.customInputValue : ''}
          placeholder='$'
          inputProps={{ maxLength : 7 }}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          inputRef={(input) => {
            if (input != null && !props.props.focusInput && props.props.handelRef) {
              input.focus();
            }
          }}
          onChange={(e: any) => props.handleOnValueChange(e)}
        />
        <span className='smallText'>Custom</span>
      </div>
    );
};

export default CustomInputFiled;