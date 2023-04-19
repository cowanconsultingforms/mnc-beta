import { useState } from "react";
import ReactDOM from "react-dom/client";
import * as React from 'react';
import './styles.css';
import { Checkbox } from '@mui/material';
/*import { setConsent } from "firebase/analytics";*/

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

    const handleChangeAirConditioning =() => {
        setCheckedAirconditioning(!checkedAirConditioning);
    };


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
        value = {checkedPool}
        onChange = {handleChangePool}
        />

        <Checkbox
        label = "Must Have Basement"
        value = {checkedBasement}
        onChange = {handleChangeBasement}
        />
        

        <Checkbox 
        label = "Must Have Elevator"
        value = {checkedElevator}
        onChange = {handleChangeElevator}
        />

        <Checkbox
        label = "Must Have Garage"
        value = {checkedGarage}
        onChange = {handleChangeGarage}
        />


        <Checkbox
        label = "Must Have Waterfront"
        value = {checkedWaterfront}
        onChange = {handleChangeWaterfront}
        />

        <Checkbox
        label= "Must Have Air Conditioning "
        value = {checkedAirConditioning}
        onChange = {handleChangeAirConditioning}
        />

</div>
    );
}

export function NumBedrooms (){
    const [numRooms,setNumRooms] = useState("Min Bedrooms");

    const handleChange = (event) => {
        setNumRooms(event.target.value)
    }
return(
    <form>
        <select value = {numRooms} onChange={handleChange}>
            <option value = "Studio">Studio</option>
            <option value = "1">1</option>
            <option value = "2">2</option>
            <option value = "3">3</option>
            <option value = "4">4</option>
            <option value = "5">5</option>
        </select>
    </form>
)
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<NumBedrooms />);

export function NumBathrooms () {
    const [numBaths, setNumBaths] = useState ("Min Bathrooms");

    const handleChange = (event)=> {
        setNumBaths(event.target.value)
    }
    return(
        <form> 
            <select value = {numBaths} onChange ={handleChange}>
                <option value = "1">1</option>
                <option value = "1.5">1.5</option>
                <option value = "2">2</option>
                <option value = "2.5">2.5</option>
                <option value = "3">3</option>
                <option value = "3.5">3.5</option>
                <option value = "4">4</option>
            </select>
        </form>
    )
}

root.render(<NumBathrooms />);

export function SquareFeet () {
    const [sqFeet, setSqFeet] = useState ("No Min");
    const handleChange = (event)=> {
        setSqFeet(event.target.value)
    }
    return(
        <form>
            <select value = {sqFeet} onChange = {handleChange}>
            <option value = "500">500</option>
            <option value = "750">750</option>
            <option value = "1000">1000</option>
            <option value = "1250">1250</option>
            <option value = "1500">1500</option>
            <option value = "1750">1750</option>
            <option value = "2000">2000</option>
            <option value = "2250">2250</option>
            <option value = "2500">2500</option>
            <option value = "2750">2750</option>
            <option value = "3000">3000</option>
            <option value = "3250">3250</option>
            <option value = "3500">3500</option>
            <option value = "3750">3750</option>
            <option value = "4000">4000</option>
            <option value = "5000">5000</option>
            <option value = "6000">6000</option>
            <option value = "7000">7000</option>
            <option value = "8000">8000</option>
            </select>
        </form>
    )
}

root.render(<SquareFeet />);

export function YearBuilt () {
    const [yrBuilt,setYrBuild] =useState ("No Min");
    const handleChange = (event) =>{
        setYrBuild(event.target.value)
    }
    return(
        <form>
            <select value = {yrBuilt} onChange = {handleChange}>
            <option value = "2023">2023</option>
            <option value = "2022">2022</option>
            <option value = "2021">2021</option>
            <option value = "2020">2020</option>
            <option value = "2019">2019</option>
            <option value = "2018">2018</option>
            <option value = "2017">2017</option>
            <option value = "2016">2016</option>
            <option value = "2015">2015</option>
            <option value = "2010">2010</option>
            <option value = "2005">2005</option>
            <option value = "2000">2000</option>
            <option value = "1995">1995</option>
            <option value = "1990">1990</option>
            <option value = "1985">1985</option>
            <option value = "1980">1980</option>
            <option value = "1970">1970</option>
            <option value = "1960">1960</option>
            <option value = "1950">1950</option>
            <option value = "1940">1940</option>
            <option value = "1930">1930</option>
            <option value = "1920">1920</option>
            </select>
        </form>
    )
}
root.render(<YearBuilt />);
























