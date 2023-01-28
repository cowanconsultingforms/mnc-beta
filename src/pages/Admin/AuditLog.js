import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Box, Card, CardContent, ListItem } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { Link } from "react-router-dom";
import ListingPage from "pages/Listings";

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
  const displayDocuments = async (e) => {
    e.preventDefault();
    if (status === "success") {
      setDocuments(...docs);
      console.log(documents);
    }

    return (
      <React.Fragment>
        <Card>
          <CardContent>
            {documents.map((doc, idx) => (
              <ListItem key={idx}>
                <Link to={<ListingPage data={doc}></ListingPage>}></Link> {doc}
              </ListItem>
            ))}
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
