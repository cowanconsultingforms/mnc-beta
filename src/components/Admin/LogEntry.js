import React, { useEffect } from "react";
import { useAuth,useFirestore,useFirestoreCollectionData } from "reactfire";
import { Box, Card, CardContent, CardHeader, Grid } from "@mui/material";
import { collection, getDocs, query,where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { useForm, Controller } from "react-hook-form";

const LogEntries = ({children}) => {
  const { action, timestamp, description, userId, userName, docId } = props;
  const auth = useAuth();
  const firestore = useFirestore();
  const {useForm} = useForm({})
  const auditLog = collection(firestore, "auditLogs");
  const q = query(auditLog, where('docId', "!=", null));
  const {data:documentData} = useFirestoreCollectionData(query(auditLog,where(docId,'!=',null)),initialData,{})
  const pullLogs = async (e) => {
    e.preventDefault();
    try {
      await getDocs(q).then(res => documentData.push(res.docs));

    } catch (e) {
      
    }
    
  };
  useEffect(() => {
    if(documentData.length!==0){
      return documentData;
    }else{
      
    }
  });

  return (
    <Box component="div" className="Listing">
      <Card className="audit-card">
        <CardHeader>
          <span> {action}</span>
          <span>{timestamp}</span>
        </CardHeader>
        <CardContent>
          <Grid container={true}>
            <Grid item></Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LogEntry;

/*Breif: Defines a component called LogEntries.
This component receives some props related to a log entry and then uses some React hooks to retrieve and display the audit logs.
Specifically, the component uses useAuth and useFirestore hooks from the reactfire library to authenticate the user and access
Firestore, respectively. It also uses the useForm hook from the react-hook-form library.

The component creates a Firestore collection called auditLogs and creates a query to retrieve all the documents that have a non-null docId.
The component also uses useFirestoreCollectionData hook to retrieve the collection data and stores the data in documentData.

The component defines a function called pullLogs that uses the getDocs function to retrieve the query data and then pushes
the result into the documentData array. Finally, the component renders a Box component with a Card inside that displays the action 
and timestamp props received by the component, as well as the documentData.*/

//the useEffect hook is incomplete, and it's not clear what it is intended to do.  - Need to Review Code 2-15-23
