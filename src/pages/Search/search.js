
import * as React from 'react';
import './styles.css';
import { Checkbox } from '@mui/material';

export function PropertyType ()  {
    const [checkedOne, setCheckedOne] = React.useState(false); //House//
    const [checkedTwo, setCheckedTwo] = React.useState(false); //Condo//
    const [checkedThree, setCheckedThree] = React.useState(false); //Townhouse//
    const [checkedFour, setCheckedFour] = React.useState(false); //Co-Op//
    const [checkedFive, setCheckedFive] = React.useState(false); //Multi-Family//
    const [checkedSix, setCheckedSix] = React.useState(false); //Land//
    const [checkedSeven, setCheckedSeven] = React.useState(false); //Other types//



    const handleChangeOne =() => {
        setCheckedOne(!checkedOne);
    };
    const handleChangeTwo = () => {
        setCheckedTwo(!checkedTwo);
    };

const handleChangeThree =() => {
    setCheckedThree(!checkedThree);
};


const handleChangeFour =() => {
    setCheckedFour(!checkedFour);
};


const handleChangeFive =() => {
    setCheckedFive(!checkedFive);
};


const handleChangeSix =() => {
    setCheckedSix(!checkedSix);
};


const handleChangeSeven =() => {
    setCheckedSeven(!checkedSeven);
};





    return (
        <div>
            <Checkbox
            label= "House"
            value ={checkedOne}
            onChange={handleChangeOne}
            />
               <Checkbox
               label = "Condo"
               value = {checkedTwo}
               onChange = {handleChangeTwo}
               />

               <Checkbox 
               label = "Townhouse"
               value = {checkedThree}
               onChange = {handleChangeThree}
               />

               <Checkbox 
               label = "Co-Op"
               value = {checkedFour}
               onChange = {handleChangeFour}
               />

            <Checkbox
            label = "Multi-Family"
            value = {checkedFive}
            onChange = {handleChangeFive}
        />
            <Checkbox
            label = "Land"
            value = {checkedSix}
            onChange = {handleChangeSix}
            />

            <Checkbox 
            label = "Other"
            value= {checkedSeven}
            onChange = {handleChangeSeven}
            />
        </div>
 );
    };
  

    


export function ListingStatus (){
    const [checkedComingSoon, setCheckedComingSoon] = React.useState(false);  //Coming Soon//
    const [checkedActive, setCheckedActive] = React.useState(false); //Active//
    const [checkedPending, setCheckedPending] = React.useState(false);  //Pending//
    const [checkedSold, setCheckedSold] = React.useState(false);  //sold//



    const handleChangeComingSoon =() => {
        setCheckedComingSoon(!checkedComingSoon);
    };

    const handleChangeActive =() => {
        setCheckedActive(!checkedActive);
    };

    const handleChangePending =() => {
        setCheckedPending(!checkedPending);
    };
    const handleChangeSold =() => {
        setCheckedSold(!checkedSold);
    };

    return (
        <div>
            <Checkbox
            label= "Coming Soon"
            value ={checkedComingSoon}
            onChange={handleChangeComingSoon}
            />

            <Checkbox
            label = "Active"
            value = {checkedActive}
            onChange= {handleChangeActive}
            />

            <Checkbox 
            label = "Pending"
            value = {checkedPending}
            onChange = {handleChangePending}
            />

            <Checkbox 
            label = "Sold"
            value = {checkedSold}
            onChange = {handleChangeSold}
            />
            </div>

    );
};

export function ListingType () {
    const [checkedListings, setCheckedListings] = React.useState(false);
    const [checkedComingSoons, setCheckedComingSoons] = React.useState(false);
    const [checkedExclusives, setCheckedExclusives] = React.useState(false);
    const [checkedNewConstruction, setCheckedNewConstruction] = React.useState(false);

    const handleChangeListings =() => {
        setCheckedListings(!checkedListings);
    };

    const handleChangeComingSoons =() => {
        setCheckedComingSoons(!checkedComingSoons);
    };

    const handleChangeExclusives =() => {
        setCheckedExclusives(!checkedExclusives);
    };

    const handleChangeNewConstruction =() => {
        setCheckedNewConstruction(!checkedNewConstruction);
    };

    return(
        <div>
            <Checkbox
            label= "MNC Listings"
            value ={checkedListings}
            onChange={handleChangeListings}
/>
            <Checkbox
            label = "Coming Soon"
            value = {checkedComingSoons}
            onChange ={handleChangeComingSoons}
            />

            <Checkbox
            label = "Exlusives"
            value = {checkedExclusives}
            onChange ={handleChangeExclusives}
            />

            <Checkbox 
            label = "New Construction"
            value = {setCheckedNewConstruction}
            onChange = {handleChangeNewConstruction}
            />


        </div>
    )
}


/*
export function OtherAmenities (){
    const [checkedLaundry, setCheckedLaundry] = React.useState(false);
    const [checkedDoorman, setCheckedDoorman] = React.useState(false);
    const [checkedOutdoor, setCheckedOutdoor] = React.useState(false);
    const [checkedPool, setCheckedPool] = React.useState(false);
    const [checkedBasement, setCheckedBasement] = React.useState(false);
    const [checkedElevator, setCheckedElevator] = React.useState(false);
    const [checkedGarage, setCheckedGarage] = React.useState(false);
    const [checkedWaterfront, setCheckedWaterfront] = React.useState(false);
    const [checkedAirConditioning, setCheckedAirconditioning] = React.useState(false);
   

    const handleChangeLaundry =() => {
        setCheckedLaundry(!checkedLaundry);
    };

    const handleChangeOutdoor =() => {
        setCheckedOutdoor(!checkedOutdoor);
    };

    const handleChangeDoorman =() => {
        setCheckedDoorman(!checkedDoorman);
    };

    const handleChangePool =() => {
        setCheckedPool(!checkedPool);
    };

    const handleChangeBasement =() => {
        setCheckedBasement(!checkedBasement);
    };

    const handleChangeElevator =() => {
        setCheckedElevator(!checkedElevator);
    };

    const handleChangeGarage =() => {
        setCheckedGarage(!checkedGarage);
    };

    const handleChangeWaterfront =() => {
        setCheckedWaterfront(!checkedWaterfront);
    };

    const handleAirConditioning =() => {
        setCheckedAirconditioning(!checkedAirConditioning);
    };

/*
    return(
        <div>
            <Checkbox
            label= "Must Have Washer/ Dryer"
            value ={checkedLaundry}
            onChange={handleChangeLaundry}
/>
            <Checkbox
            label = "Must Have Doorman"
            value = {checkedDoorman}
            onChange = {handleChangeDoorman}
            />

        <Checkbox 
        label = " Must Have Private Outdoor Space"
        value = {checkedOutdoor}
        onChange = {handleChangeOutdoor}
        />

        <Checkbox
        label = " Must Have Pool"
        value = {checkedBasement}
        onChange = {handleChangeBasement}
        />

        <Checkbox



</div>


*/






















