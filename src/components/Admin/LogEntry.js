import React, { useEffect } from "react";
import { useAuth,useFirestore,useFirestoreCollectionData } from "reactfire";
import { Box, Card, CardContent, CardHeader, Grid } from "@mui/material";
import { collection, getDocs, query,where } from "firebase/firestore";
import { useForm, Controller } from "react-hook-form";

const LogEntries = ({children}) => {
  const { action, timestamp, description, userId, userName, docId } = props;
  const auth = useAuth();
  const firestore = useFirestore();
  const {useForm} = useForm({})
  const auditLog = collection(firestore, "auditLogs");
  const q = query(auditLog, where('docId', "!=", null));
  const {data:documentData} = useFirestoreCollectionData(query(auditLog,where(docId,'!=',null)),initialData:{})
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
