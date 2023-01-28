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
