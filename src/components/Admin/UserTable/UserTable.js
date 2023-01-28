import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridRowParams,
  useGridApiRef,
} from "@mui/x-data-grid";
import { getDocs } from "firebase/firestore";
import { useFirestore } from "reactfire";
import { GridLoadingOverlay } from "@mui/x-data-grid";
import { useInsertionEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
const initialState = [
  {
    docId: "",
    userName: "",
    email: "",
    uid: "",
    role: "",
  },
];
export const UserTable = ({ children }) => {
  const firestore = useFirestore();
  const [users, setUsers] = useState(initialState);
  const gridRef = useRef();

  useGridApiRef();
  return (
    <GridToolbarContainer ref={gridRef}>
      <DataGrid
        aria-label="User Table"
        rows={users}
        columns={columns}
        loading={GridLoadingOverlay}
        initialState={users}
      >
        <TableRow>
          {userData
            ? null && status === "success"
            : docs.forEach((data) => {
                data.get("Username");
              })}
        </TableRow>
      </DataGrid>
    </GridToolbarContainer>
  );
};
