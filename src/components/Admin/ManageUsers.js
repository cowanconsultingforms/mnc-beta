import React from "react";
import { useFirestore, useFirestoreCollection } from "reactfire";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  Paper,
  TableContainer,
  TableRow,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  useGridApiContext,
  useGridApiMethod,
} from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
const columnHeaders = [
  "uid",
  "userName",
  "role",
  "portfolioMin",
  "portfolioMax",
  "email",
];
export const ManageUsers = () => {
  const methods = useForm();
  const onSubmit = (data) => console.log(data);
  const firestore = useFirestore();
  const collectionRef = collection(firestore, "users");
  const q = query(collectionRef, orderBy("userName", "asc"));
  const { status, data: docs } = useFirestoreCollection(q);
  const [columns, setColumns] = useState(columnHeaders);
  const [rows, setRows] = useState([]);
  const [userData, setUserData] = useState({
    email: "",
    role: "",
    registerDate: "",
    dissplayName: "",
  });
  const displayUsers = async (e) => {
    const users = userData;
    e.preventDefault();
    try {
      if (users !== null) {
        return users.map((item, i) => {
          <TableBody key={i}>{item}</TableBody>;
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (status === "success" && status !== "error") {
      setUserData(...docs);
      setColumns(...docs.docs.keys());
    }
    if (docs !== null) {
      console.log(docs);
    }
  }, [status, docs]);
  return (
    <Box component={Paper}>
      <DataGrid
        aria-label="User Table"
        rows={rows}
        columns={columns}
        loading=""
      >
        <TableRow>
          {userData
            ? null && status === "success"
            : docs.forEach((data) => {
                data.get("Username");
              })}
        </TableRow>
      </DataGrid>
    </Box>
  );
};
