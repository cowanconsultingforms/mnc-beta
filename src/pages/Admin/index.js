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