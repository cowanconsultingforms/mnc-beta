import {
  serverTimestamp,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { styled } from "@mui/system";
import { Paper } from "@mui/material";
import * as React from "react";
import {
  Typography,
  Radio,
  FormControlLabel,
  RadioGroup,
  useRadioGroup,
  FormControl,
  FormLabel,
  Button, 
  ButtonGroup
} from "@mui/material";
import { useEffect, useState, useRef, forwardRef, useReducer } from "react";
import { getValue } from "firebase/remote-config";

export const Item = styled(Paper)({});



export const MyFormControlLabel = (props) => {
  const buttonGroup =  useRadioGroup();

  let checked = false;

  if (buttonGroup) {
    checked = buttonGroup.value === props.value;
  }

  return <Button checked={checked} {...props} />;
};

export const UseButtonGroup = ({ onChange }) => {

  const ACTIONS= {
    BUYCHANGE:'BuyChange',
    SOLDCHANGE:'SoldChange',
    RENTCHANGE:'RentChange',
  }
  function reducer(state, action){
   switch(action.Type)
   {
    case ACTIONS.BUYCHANGE:
      return{Type:'forSale'};
    case ACTIONS.SOLDCHANGE:
    return{Type:'sold'};
    case ACTIONS.RENTCHANGE:
      return{Type:'rentals'}
      default:
        return state
   }
   
  }
  const [isHover, setIsHover] = useState(false);
  const [isHover2, setIsHover2] = useState(false);
  const [isHover3, setIsHover3] = useState(false);
  
  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handleMouseEnter2 = () => {
    setIsHover2(true);
  };
  const handleMouseLeave2 = () => {
    setIsHover2(false);
  };

  const handleMouseEnter3 = () => {
    setIsHover3(true);
  };
  const handleMouseLeave3 = () => {
    setIsHover3(false);
  };
  const [state, dispatch] = useReducer(reducer,{ Type: 'forSale'});


  function BuyChange(){
    dispatch({ change: ACTIONS.BUYCHANGE})
    console.log(dispatch);
    // I tried to check console.log(dispatch) and I got this error;
    /* 
  function dispatchReducerAction(fiber, queue, action) {
  {
    if (typeof arguments[3] === 'function') {
      error("State updates from the useState() and useReducer() Hooks don't support the " + 
      'second callback argument. To execute a side effect after ' + 'rendering, declare it in the component body with useEffect().');
    }
  }*/

  }
  function SoldChange(){
    dispatch({change: ACTIONS.RENTCHANGE})
    console.log(dispatch);
  }
  function RentChange(){
    dispatch({change: ACTIONS.SOLDCHANGE})
    console.log(dispatch);
  }
  return (
    <ButtonGroup
      name="listing-type-group"
      defaultValue={state.Type}
      onChange={onChange}
      sx={{ fontFamily: "Garamond" }}
    >
      <Button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            disableFocusRipple
            className="buy-button"
            //value={"forSale"}
            onClick={BuyChange}
            style={{
              fontSize: "16px",
              color: isHover ? "black" : "white",
              backgroundColor: isHover ? "white" : "#63666A",
              fontWeight: "bold",
              padding: "15px",
              fontFamily: "Garamond",
            }}
          >
            Buy
          </Button>

          <Button
            onMouseEnter={handleMouseEnter2}
            onMouseLeave={handleMouseLeave2}
            disableFocusRipple
            className="rent-button"
            style={{
              fontWeight: "bold",
              padding: "15px",
              fontSize: "16px",
              color: isHover2 ? "black" : "white",
              backgroundColor: isHover2 ? "white" : "#858181",
              fontFamily: "Garamond",
            }}
            //value={"rentals"}
            onClick={RentChange}
          >
            Rent
          </Button>

          <Button
            onMouseEnter={handleMouseEnter3}
            onMouseLeave={handleMouseLeave3}
            className="sold-button"
            style={{
              borderBox: "solid 1px black",
              textAlign: "center",
              padding: "15px",
              fontSize: "16px",
              width: "90px",
              fontFamily: "Garamond",
              backgroundColor: isHover3 ? "white" : "lightgrey",
              color: isHover3 ? "black" : "black",
              fontWeight: "bold",
            }}
            //value={"sold"}
           
            onClick={SoldChange}
          >
            Sold
          </Button>
  
    </ButtonGroup>
  );
};

