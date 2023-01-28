import React from 'react';
import { styled } from '@mui/material/styles';
import { Form } from 'rsuite';
import {Box,Button} from '@mui/material';
import { BasicButtons } from './Buttons';
export const TextFieldLogin = React.forwardRef((props, ref) => {
  const { name, label, accepter, ...rest } = props;
  return (
    <Form.Group controlId={`${name}-4`} ref={ref}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} {...rest} />
    </Form.Group>
  );
});
const TextLabel = styled.label`
  font-size: 20px;
`;
const TextInput = styled.input`
  display: block;
  margin-top: 10px;
  padding: 10px;
  font-size: 17px;
  width: 87%;
  border: 1px solid rgb(197, 197, 197);
  height: 28px;
  left: 5%;
`;
const ReadOnlyTextBox = styled.input`
  pointer-events: none;
  color: white;
  background-color: rgb(158, 158, 158);
  border: 1px solid rgb(197, 197, 197);
  height: 28px;
  display: block;
  margin-top: 10px;
  padding: 10px;
  font-size: 17px;
  width: 87%;
`;

 const StyledTextArea = styled.textarea`
  width: 100%;
  border: 2px solid rgba(0, 0, 0, 0);
  outline: none;
  background-color: rgba(230, 230, 230, 0.6);
  padding: 0.5rem 1rem;
  font-size: 1.1rem;
  margin-bottom: 22px;
  transition: 0.3s;
`;
export const TextArea = ({ label, value, onChange, placeholder =''}) => { 
  const renderTextArea = () => {
      return <StyledTextArea value={value} onChange={onChange} placeholder={placeholder}/>
    }
    return (
      <React.Fragment>
        <TextLabel>{label}</TextLabel>
          {renderTextArea()}
        </React.Fragment>
    );
}
  const TextField = ({ label, value, onChange, canEdit, placeholder = '' }) => {

    const renderTextBox = () => {
        if (canEdit) {
            return <TextInput value={value} onChange={onChange} placeholder={placeholder}/>
        }
        return <ReadOnlyTextBox value={value} />
    }

    return (
        <React.Fragment>
            <TextLabel>{label}</TextLabel>
            {renderTextBox()}
        </React.Fragment>
    );
}
export const BasicTextFields =({title,setPassword,setEmail,handleAction}) => {
    return (
        <div>
            <div className="heading-container">
                <h3>
                    {title} Form
                </h3>
            </div>

            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField id="email" label="Enter the Email" variant="outlined" onChange={(e)=>setEmail(e.target.value)} />
                <TextField id="password" label="Enter the Password" variant="outlined" />
            </Box>

            <Button title={title}/>
        </div>
    );
}
export default TextField;