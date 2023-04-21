import { useState } from "react";
import { Button, Grid } from "@mui/material";
import AddListing from "./addListing";
import EditListing from "./editListing";
import DeleteListing from "./deleteListing";

const AdminPage = () => {
  const [activeComponent, setActiveComponent] = useState("");

  const handleButtonClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "add":
        return <AddListing />;
      case "edit":
        return <EditListing />;
      case "delete":
        return <DeleteListing />;
      default:
        return null;
    }
  };

  return (
    <Grid container direction="column" justify="center" alignItems="center" spacing={2} sx={{marginTop:"10px"}}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Button variant="contained" onClick={() => handleButtonClick("add")} sx={{marginLeft:"10px", backgroundColor:"#a3a3a3"}}>
          Add listings
        </Button>
        <Button variant="contained" color="primary" onClick={() => handleButtonClick("edit")} sx={{marginLeft:"10px", backgroundColor:"#a3a3a3"}}>
          Edit listings
        </Button>
        <Button variant="contained" onClick={() => handleButtonClick("delete")} sx={{marginLeft:"10px", backgroundColor:"#a3a3a3"}}>
          Delete listings
        </Button>
      </div>
      <Grid item>
        {renderActiveComponent()}
      </Grid>
    </Grid>
  );
};

export default AdminPage;

/*
This is a functional component in React that renders an admin page with buttons to add, edit, and delete listings.

The component uses the useState hook to manage the active component state, and a switch statement to determine which
component to render based on the activeComponent state.

The buttons are styled using Material-UI's Button component, and are placed in a row using a div with flexbox properties.
 The buttons also call the handleButtonClick function to set the activeComponent state when clicked.

Finally, the component returns a Grid container with a column direction, and a centered and spaced out layout using 
Material-UI's Grid component. The renderActiveComponent function is called to render the appropriate component based on the activeComponent state.
*/