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

/*Breif:Defines a React component called UserTable that displays a table of users using the MUI X Data Grid component.

The component imports several modules and functions from external libraries, including DataGrid and related components from
 "@mui/x-data-grid", getDocs from "firebase/firestore", and useFirestore from "reactfire".

The initialState constant defines an array of user objects with various properties such as docId, userName, email, uid, and role.

Inside the UserTable component, the useFirestore hook is called to retrieve a reference to the Firestore database, 
and the useState hook is used to set the initial state of the users array.

The DataGrid component is then used to display the table of users. 
It takes several props, including the aria-label, rows (which is the users array),
 columns (which are not shown in the code snippet), 
 and loading (which is a component used to show a loading overlay while the table is being populated).

The TableRow component is used to display each row of user data.
 The code snippet also includes a conditional statement to check if userData is null and the status is "success", 
 and if so, the docs array is iterated over and the "Username" property of each object is retrieved using the get method.
 */
 
//However, the code as written has a logical error, where the conditional statement checks for userData being null and then
// immediately short-circuits with null, meaning the code inside the conditional statement is never executed.
//Should Look into this logical error @ later time - 2-15-23 




