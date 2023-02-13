import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Box, Card, CardContent, ListItem } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { Link } from "react-router-dom";

/*This code defines a React functional component called AuditLog which displays audit logs from a Firestore database.
It uses the useFirestore and useFirestoreCollectionData hooks from the reactfire library to retrieve the data from Firestore.

The auditCollection constant is a reference to a Firestore collection with the name "auditLogs". 
The useFirestoreCollectionData hook retrieves the data from the collection and passes it to the docs constant, 
which is then passed to setDocuments to update the documents state.

The displayDocuments function logs the documents state to the console. 
The function is also called in the useEffect hook to display the data on the page.

The component returns a Box component that calls the displayDocuments function.*/
const AuditLog = (props) => {
  const [documents, setDocuments] = useState([]);
  const isCurrent = useRef();
  const firestore = useFirestore();
  const auditCollection = collection(firestore, "auditLogs", [
    "UserID",
    "Action",
    "DateTime",
    "Description",
    "Username",
  ]);
  const { status, data: docs } = useFirestoreCollectionData(auditCollection);

//The displayDocuments function is used to prevent default behavior on submit and to log the documents to the console. 
//Finally, the component returns a Box component with the displayDocuments function as its child.
  const displayDocuments = async (e) => {
    e.preventDefault();


//The data is stored in the docs variable and set to the documents state when the status of the data retrieval is "success".     
    if (status === "success") {
      setDocuments(...docs);
      console.log(documents);
    }

    return (
      <React.Fragment>
        <Card>
          <CardContent>
          
          </CardContent>
        </Card>
      </React.Fragment>
    );
  };
  useEffect(() => {
    displayDocuments();
  });
  return <Box component="div">{displayDocuments}</Box>;
};

export default AuditLog;

/*
This code defines a React component named AuditLog. 
The component uses the useFirestore and useFirestoreCollectionData hooks from the reactfire library 
to retrieve data from a Firebase Firestore database.

The component has a state variable documents and sets it using the useState hook. 
It also creates a reference variable isCurrent using the useRef hook.

The component creates a Firestore collection named auditLogs with columns UserID, Action, DateTime, Description, and Username.

The component defines a function displayDocuments that retrieves data from the auditCollection and sets
 the state documents to the retrieved data.

The displayDocuments function returns a fragment that contains a Card component from the @mui/material library.

The useEffect hook is used to call the displayDocuments function when the component is mounted.

Finally, the component returns a Box component from the @mui/material library that wraps the result of calling displayDocuments.*/