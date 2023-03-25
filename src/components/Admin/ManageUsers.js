import React from "react";
import { useFirestore, useFirestoreCollection } from "reactfire";
import { collection, orderBy, query } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  Paper,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";

export const ManageUsers = () => {
  const firestore = useFirestore();
  const collectionRef = collection(firestore, "users");
  const q = query(collectionRef, orderBy("userName", "asc"));
  const { status, data: docs } = useFirestoreCollection(q);
  const [users, setUsers] = useState([]);
  const displayUsers = async (e) => {
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
    if (status === "success") {
      setUsers(docs);
    }
    if (docs !== null) {
      console.log(docs);
    }
  }, [status, docs]);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="User Table">
        <TableHead>
          <TableRow>
            <TableCell>UserName</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>RegisterDate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {users
              ? null && status === "success"
              : docs.forEach((data) => {
                  data.get("Username");
                })}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
