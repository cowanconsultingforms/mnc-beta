import {
  collection,
  getDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  setDoc,
  queryEqual,
  getDocs,
} from "firebase/firestore";
import React, { useRef, useEffect, useState, Fragment } from "react";
import {
  Box,
  TextField,
  Button,
  ButtonGroup,
  Typography,
  Table,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  gridRowsLoadingSelector,
} from "@mui/x-data-grid";
import { useFirestoreCollectionData, useFirestore } from "reactfire";
import { async } from "@firebase/util";

export const SearchUser = ({ children }) => {
  const initialValues = {
    email: "",
  };
  const formRef = useRef(initialValues);
  const firestore = useFirestore();
  const [email, setEmail] = useState(initialValues);
  const isMounted = useRef();
  const [userData, setUserData] = useRef();
  const q = query(collection(firestore, "users"), where("email", "!=", null));
  const [dataGrid, setDataGrid] = useState([]);
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      await getDocs(q).then((res) => {
        setDataGrid(...res.docs.push);
      });
    } catch (error) {}
  };
  useEffect(() => {
    if (isMounted.current) {
      return;
    }

    isMounted.current = true;
  }, []);

  return (
    <Fragment>
      <Box
        className="search-user-container"
        component="form"
        ref={formRef}
        onChange={setEmail((e) => e.target.value)}
        onSubmit={handleSearch}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", fontFamily: "Garamond" }}
        >
          Search User
        </Typography>

        <TextField name="search" label="Search" fullWidth />

        <ButtonGroup>
          <Button appearance="primary" variant="contained" type="submit">
            Submit
          </Button>
        </ButtonGroup>
        <Box>
          <DataGrid ref={searchResult.current} rows={dataGrid.size}></DataGrid>
        </Box>
      </Box>
    </Fragment>
  );
};

export default SearchUser;


/*Breif: Exports a component called SearchUser which is a form that allows users to search for user data in a Firestore collection.
 It uses the useFirestoreCollectionData and useFirestore hooks from reactfire to interact with Firestore.

When the form is submitted, it queries the Firestore collection "users" using the where method to filter on non-null "email" fields.
It then retrieves the data using the getDocs method and sets the retrieved data to the dataGrid state using the setDataGrid method.

The component renders a form with a search input field and a submit button. When the form is submitted, the retrieved data is displayed
in a DataGrid component from @mui/x-data-grid. 
The DataGrid is initially rendered with an empty set of rows and the retrieved data is added using the setDataGrid method. */