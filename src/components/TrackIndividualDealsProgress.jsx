import {
  doc,
  serverTimestamp,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { DateRangePicker } from "react-date-range";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Component } from "react";
import { getAuth } from "firebase/auth";
import emailjs from "@emailjs/browser";
import React from "react";
// import "../css/dealProgress.css";
import imagee from "../assets/img/check.jpg";
import "../css/dealProgress.css"

const TrackIndividualDealsProgress = () => {
  const { uid } = useParams();
  const [customer, setCustomer] = useState("");
  const [user, setCurrentCustomer] = useState("");
  const [select, setSelect] = useState(false);
  const [status1, setStatus1] = useState("");
  const [timeLine1, setTimeLine1] = useState("");
  const [dueDate1, setDueDate1] = useState("");
  const [notes1, setNotes1] = useState("");
  const [lastUpdated1, setLastUpdated1] = useState("");
  const dateRangePickerRef = useRef(null);
  const dateRangePickerRef2 = useRef(null);
  const dateRangePickerRef3 = useRef(null);
  const dateRangePickerRef4 = useRef(null);
  const dateRangePickerRef5 = useRef(null);
  const dateRangePickerRef6 = useRef(null);
  const dateRangePickerRef7 = useRef(null);
  const specificInputRef = useRef(null);
  const specificInputRef2 = useRef(null);
  const specificInputRef3 = useRef(null);
  const specificInputRef4 = useRef(null);
  const specificInputRef5 = useRef(null);
  const specificInputRef6 = useRef(null);
  const specificInputRef7 = useRef(null);
  const [rangeSelected, setRangeSelected] = useState(false);
  const [rangeSelected2, setRangeSelected2] = useState(false);
  const [rangeSelected3, setRangeSelected3] = useState(false);
  const [rangeSelected4, setRangeSelected4] = useState(false);
  const [rangeSelected5, setRangeSelected5] = useState(false);
  const [rangeSelected6, setRangeSelected6] = useState(false);
  const [rangeSelected7, setRangeSelected7] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [status2, setStatus2] = useState("");
  const [timeLine2, setTimeLine2] = useState("");
  const [dueDate2, setDueDate2] = useState("");
  const [notes2, setNotes2] = useState("");
  const [lastUpdated2, setLastUpdated2] = useState("");
  const [status3, setStatus3] = useState("");
  const [timeLine3, setTimeLine3] = useState("");
  const [dueDate3, setDueDate3] = useState("");
  const [notes3, setNotes3] = useState("");
  const [lastUpdated3, setLastUpdated3] = useState("");

  const [status4, setStatus4] = useState("");
  const [timeLine4, setTimeLine4] = useState("");
  const [dueDate4, setDueDate4] = useState("");
  const [notes4, setNotes4] = useState("");
  const [lastUpdated4, setLastUpdated4] = useState("");

  const [status5, setStatus5] = useState("");
  const [timeLine5, setTimeLine5] = useState("");
  const [dueDate5, setDueDate5] = useState("");
  const [notes5, setNotes5] = useState("");
  const [lastUpdated5, setLastUpdated5] = useState("");

  const [status6, setStatus6] = useState("");
  const [timeLine6, setTimeLine6] = useState("");
  const [dueDate6, setDueDate6] = useState("");
  const [notes6, setNotes6] = useState("");
  const [lastUpdated6, setLastUpdated6] = useState("");

  const [status7, setStatus7] = useState("");
  const [timeLine7, setTimeLine7] = useState("");
  const [dueDate7, setDueDate7] = useState("");
  const [notes7, setNotes7] = useState("");
  const [lastUpdated7, setLastUpdated7] = useState("");
  const [userDocRef2, setUserDocRef2] = useState("");

  const handleSelect2 = async () => {
    setSelect(!select);
    const userDocRef = doc(db, "users", uid);
    setUserDocRef2(userDocRef);
    const docSnap = await getDoc(userDocRef);
    setCurrentCustomer(docSnap.data());
    const currentCustomer = docSnap.data();
    setCustomer(currentCustomer);
    setStatus1(currentCustomer.deal[0].prospecting[0].status || "");
    setStatus2(currentCustomer.deal[1].qualification[0].status || "");
    setStatus3(currentCustomer.deal[2].quotation[0].status || "");
    setStatus4(currentCustomer.deal[3].negotiation[0].status || "");
    setStatus5(currentCustomer.deal[4].contractSent[0].status || "");
    setStatus6(currentCustomer.deal[5].closing[0].status || "");
    setStatus7(currentCustomer.deal[6].postClosureFollowup[0].status || "");

    // Set TimeLine
    setTimeLine1(currentCustomer.deal[0].prospecting[0].timeLiine || "");
    setTimeLine2(currentCustomer.deal[1].qualification[0].timeLiine || "");
    setTimeLine3(currentCustomer.deal[2].quotation[0].timeLiine || "");
    setTimeLine4(currentCustomer.deal[3].negotiation[0].timeLiine || "");
    setTimeLine5(currentCustomer.deal[4].contractSent[0].timeLiine || "");
    setTimeLine6(currentCustomer.deal[5].closing[0].timeLiine || "");
    setTimeLine7(
      currentCustomer.deal[6].postClosureFollowup[0].timeLiine || ""
    );

    // Set DueDate
    setDueDate1(currentCustomer.deal[0].prospecting[0].dueDate || "");
    setDueDate2(currentCustomer.deal[1].qualification[0].dueDate || "");
    setDueDate3(currentCustomer.deal[2].quotation[0].dueDate || "");
    setDueDate4(currentCustomer.deal[3].negotiation[0].dueDate || "");
    setDueDate5(currentCustomer.deal[4].contractSent[0].dueDate || "");
    setDueDate6(currentCustomer.deal[5].closing[0].dueDate || "");
    setDueDate7(currentCustomer.deal[6].postClosureFollowup[0].dueDate || "");

    // Set Notes
    setNotes1(currentCustomer.deal[0].prospecting[0].Notes || "");
    setNotes2(currentCustomer.deal[1].qualification[0].Notes || "");
    setNotes3(currentCustomer.deal[2].quotation[0].Notes || "");
    setNotes4(currentCustomer.deal[3].negotiation[0].Notes || "");
    setNotes5(currentCustomer.deal[4].contractSent[0].Notes || "");
    setNotes6(currentCustomer.deal[5].closing[0].Notes || "");
    setNotes7(currentCustomer.deal[6].postClosureFollowup[0].Notes || "");

    // Set Last Updated
    setLastUpdated1(currentCustomer.deal[0].prospecting[0].lastUpdated || "");
    setLastUpdated2(currentCustomer.deal[1].qualification[0].lastUpdated || "");
    setLastUpdated3(currentCustomer.deal[2].quotation[0].lastUpdated || "");
    setLastUpdated4(currentCustomer.deal[3].negotiation[0].lastUpdated || "");
    setLastUpdated5(currentCustomer.deal[4].contractSent[0].lastUpdated || "");
    setLastUpdated6(currentCustomer.deal[5].closing[0].lastUpdated || "");
    setLastUpdated7(
      currentCustomer.deal[6].postClosureFollowup[0].lastUpdated || ""
    );
  };

  useEffect(() => {
    const fetchUser = async () => {
      handleSelect2();
    };
    fetchUser();
  }, [uid]);

  const handleInputChange = async (stage, field, value) => {
    const currentDate = new Date();
    const formattedDate =
      currentDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }) +
      " " +
      currentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

    if (stage === "Prospecting") {
      user.deal[0].prospecting[0].lastUpdated = formattedDate;
      setLastUpdated1(formattedDate);
    }
    if (stage === "Qualification") {
      user.deal[1].qualification[0].lastUpdated = formattedDate;
      setLastUpdated2(formattedDate);
    }
    if (stage === "Quotation") {
      user.deal[2].quotation[0].lastUpdated = formattedDate;
      setLastUpdated3(formattedDate);
    }
    if (stage === "Negotiation") {
      user.deal[3].negotiation[0].lastUpdated = formattedDate;
      setLastUpdated4(formattedDate);
    }
    if (stage === "ContractSent") {
      user.deal[4].contractSent[0].lastUpdated = formattedDate;
      setLastUpdated5(formattedDate);
    }
    if (stage === "Closing") {
      user.deal[5].closing[0].lastUpdated = formattedDate;
      setLastUpdated6(formattedDate);
    }
    if (stage === "Postclosing followup") {
      user.deal[6].postClosureFollowup[0].lastUpdated = formattedDate;
      setLastUpdated7(formattedDate);
    }

    if (stage === "Prospecting" && field === "status") {
      user.deal[0].prospecting[0].status = value;
      setStatus1(value);
    }
    if (stage === "Quotation" && field === "status") {
      user.deal[2].quotation[0].status = value;
      setStatus3(value);
    }
    if (stage === "Qualification" && field === "status") {
      user.deal[1].qualification[0].status = value;
      setStatus2(value);
    }
    if (stage === "Negotiation" && field === "status") {
      user.deal[3].negotiation[0].status = value;
      setStatus4(value);
    }
    if (stage === "ContractSent" && field === "status") {
      user.deal[4].contractSent[0].status = value;
      setStatus5(value);
    }
    if (stage === "Closing" && field === "status") {
      user.deal[5].closing[0].status = value;
      setStatus6(value);
    }
    if (stage === "Postclosing followup" && field === "status") {
      user.deal[6].postClosureFollowup[0].status = value;
      setStatus7(value);
    }

    if (stage === "Prospecting" && field === "dueDate") {
      user.deal[0].prospecting[0].dueDate = value;
      setDueDate1(value);
    }
    if (stage === "Quotation" && field === "dueDate") {
      user.deal[2].quotation[0].dueDate = value;
      setDueDate3(value);
    }
    if (stage === "Qualification" && field === "dueDate") {
      user.deal[1].qualification[0].dueDate = value;
      setDueDate2(value);
    }
    if (stage === "Negotiation" && field === "dueDate") {
      user.deal[3].negotiation[0].dueDate = value;
      setDueDate4(value);
    }
    if (stage === "ContractSent" && field === "dueDate") {
      user.deal[4].contractSent[0].dueDate = value;
      setDueDate5(value);
    }
    if (stage === "Closing" && field === "dueDate") {
      user.deal[5].closing[0].dueDate = value;
      setDueDate6(value);
    }
    if (stage === "Postclosing followup" && field === "dueDate") {
      user.deal[6].postClosureFollowup[0].dueDate = value;
      setDueDate7(value);
    }
    if (stage === "Prospecting" && field === "timeLiine") {
      user.deal[0].prospecting[0].timeLiine = value;
      setTimeLine1(value);
    }
    if (stage === "Quotation" && field === "timeLiine") {
      user.deal[2].quotation[0].timeLiine = value;
      setTimeLine3(value);
    }
    if (stage === "Qualification" && field === "timeLiine") {
      user.deal[1].qualification[0].timeLiine = value;
      setTimeLine2(value);
    }
    if (stage === "Negotiation" && field === "timeLiine") {
      user.deal[3].negotiation[0].timeLiine = value;
      setTimeLine4(value);
    }
    if (stage === "ContractSent" && field === "timeLiine") {
      user.deal[4].contractSent[0].timeLiine = value;
      setTimeLine5(value);
    }
    if (stage === "Closing" && field === "timeLiine") {
      user.deal[5].closing[0].timeLiine = value;
      setTimeLine6(value);
    }
    if (stage === "Postclosing followup" && field === "timeLiine") {
      user.deal[6].postClosureFollowup[0].timeLiine = value;
      setTimeLine7(value);
    }

    if (stage === "Prospecting" && field === "Notes") {
      user.deal[0].prospecting[0].Notes = value;
      setNotes1(value);
    }
    if (stage === "Quotation" && field === "Notes") {
      user.deal[2].quotation[0].Notes = value;
      setNotes3(value);
    }
    if (stage === "Qualification" && field === "Notes") {
      user.deal[1].qualification[0].Notes = value;
      setNotes2(value);
    }
    if (stage === "Negotiation" && field === "Notes") {
      user.deal[3].negotiation[0].Notes = value;
      setNotes4(value);
    }
    if (stage === "ContractSent" && field === "Notes") {
      user.deal[4].contractSent[0].Notes = value;
      setNotes5(value);
    }
    if (stage === "Closing" && field === "Notes") {
      user.deal[5].closing[0].Notes = value;
      setNotes6(value);
    }
    if (stage === "Postclosing followup" && field === "Notes") {
      user.deal[6].postClosureFollowup[0].Notes = value;
      setNotes7(value);
    }

    if (stage === "Prospecting" && field === "lastUpdated") {
      user.deal[0].prospecting[0].lastUpdated = value;
      setLastUpdated1(value);
    }
    if (stage === "Quotation" && field === "lastUpdated") {
      user.deal[2].quotation[0].lastUpdated = value;
      setLastUpdated3(value);
    }
    if (stage === "Qualification" && field === "lastUpdated") {
      user.deal[1].qualification[0].lastUpdated = value;
      setLastUpdated2(value);
    }
    if (stage === "Negotiation" && field === "lastUpdated") {
      user.deal[3].negotiation[0].lastUpdated = value;
      setLastUpdated4(value);
    }
    if (stage === "ContractSent" && field === "lastUpdated") {
      user.deal[4].contractSent[0].lastUpdated = value;
      setLastUpdated5(value);
    }
    if (stage === "Closing" && field === "lastUpdated") {
      user.deal[5].closing[0].lastUpdated = value;
      setLastUpdated6(value);
    }
    if (stage === "Postclosing followup" && field === "lastUpdated") {
      user.deal[6].postClosureFollowup[0].lastUpdated = value;
      setLastUpdated7(value);
    }

    await updateDoc(userDocRef2, { deal: user.deal });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // setFormData({});
  };

  const toggleSelectRange = () => {
    setRangeSelected(!rangeSelected);
  };

  const toggleSelectRange2 = () => {
    setRangeSelected2(!rangeSelected2);
  };

  const toggleSelectRange3 = () => {
    setRangeSelected3(!rangeSelected3);
  };
  const toggleSelectRange4 = () => {
    setRangeSelected4(!rangeSelected4);
  };
  const toggleSelectRange5 = () => {
    setRangeSelected5(!rangeSelected5);
  };
  const toggleSelectRange6 = () => {
    setRangeSelected6(!rangeSelected6);
  };
  const toggleSelectRange7 = () => {
    setRangeSelected7(!rangeSelected7);
  };

  const handleClickOutside = (event) => {
    if (
      dateRangePickerRef.current &&
      !dateRangePickerRef.current.contains(event.target) &&
      specificInputRef.current &&
      !specificInputRef.current.contains(event.target)
    ) {
      setRangeSelected(false);
    }
    if (
      dateRangePickerRef2.current &&
      !dateRangePickerRef2.current.contains(event.target) &&
      specificInputRef2.current &&
      !specificInputRef2.current.contains(event.target)
    ) {
      setRangeSelected2(false);
    }
    if (
      dateRangePickerRef2.current &&
      !dateRangePickerRef2.current.contains(event.target) &&
      specificInputRef2.current &&
      !specificInputRef2.current.contains(event.target)
    ) {
      setRangeSelected2(false);
    }
    if (
      dateRangePickerRef3.current &&
      !dateRangePickerRef3.current.contains(event.target) &&
      specificInputRef3.current &&
      !specificInputRef3.current.contains(event.target)
    ) {
      setRangeSelected3(false);
    }
    if (
      dateRangePickerRef4.current &&
      !dateRangePickerRef4.current.contains(event.target) &&
      specificInputRef4.current &&
      !specificInputRef4.current.contains(event.target)
    ) {
      setRangeSelected4(false);
    }
    if (
      dateRangePickerRef5.current &&
      !dateRangePickerRef5.current.contains(event.target) &&
      specificInputRef5.current &&
      !specificInputRef5.current.contains(event.target)
    ) {
      setRangeSelected5(false);
    }
    if (
      dateRangePickerRef6.current &&
      !dateRangePickerRef6.current.contains(event.target) &&
      specificInputRef6.current &&
      !specificInputRef6.current.contains(event.target)
    ) {
      setRangeSelected6(false);
    }
    if (
      dateRangePickerRef7.current &&
      !dateRangePickerRef7.current.contains(event.target) &&
      specificInputRef7.current &&
      !specificInputRef7.current.contains(event.target)
    ) {
      setRangeSelected7(false);
    }
  };

  const cellStyle = {
    padding: "10px",
    border: "1px solid #dddddd",
    textAlign: "left",
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSelectRange = (ranges, stage, field, toggle) => {
    if (ranges.selection.endDate !== "") {
      if (ranges.selection.startDate !== ranges.selection.endDate) {
        const startMonth = ranges.selection.startDate.toLocaleString(
          "default",
          {
            month: "short",
          }
        );
        const startDate = ranges.selection.startDate.getDate();
        const endMonth = ranges.selection.endDate.toLocaleString("default", {
          month: "short",
        });
        const endDate = ranges.selection.endDate.getDate();
        const finalRange = `${startMonth} ${startDate} - ${endMonth} ${endDate}`;
        handleInputChange(stage, field, finalRange);

        setDateRange([ranges.selection]);
        if (toggle === "1") {
          toggleSelectRange();
        } else if (toggle === "2") {
          toggleSelectRange2();
        } else if (toggle === "3") {
          toggleSelectRange3();
        } else if (toggle === "4") {
          toggleSelectRange4();
        } else if (toggle === "5") {
          toggleSelectRange5();
        } else if (toggle === "6") {
          toggleSelectRange6();
        } else if (toggle === "7") {
          toggleSelectRange7();
        }
      }
    }
  };

  return (
    <div className="relative">
      <div
        className="absolute inset-0 bg-white backdrop-filter backdrop-blur-md"
        style={{
          height: "100%",
          backgroundColor: "gray",
          opacity: 0.8,
          backgroundImage: `url(${imagee})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "100%",
          top: 0,
          left: 0,
          zIndex: -1,
          position: "fixed",
        }}
      ></div>
      <div><p style={{fontSize: "40px"}} className="ml-5 fixed text-gray-700 font-semibold ">Deal Tracker</p></div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      > 
        <div style={{marginTop: "90px"}} className="font-semibold  text-gray-700 mb-2 text-xl mt-20">
          Client: {customer.name}
        </div>
        <div className="font-semibold  text-gray-700 mb-10 text-xl">
          Category: {customer.interested}
        </div>
        <div className="table-container">
        <table
          style={{ borderCollapse: "collapse", maxWidth: "100%" }}
          className="table bg-gray-700 border font-semibold"
        >
          <thead className="text-white">
            <tr>
              <th className="p-2 ">Task</th>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #dddddd",
                  textAlign: "center",
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #dddddd",
                  textAlign: "center",
                }}
              >
                Due Date
              </th>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #dddddd",
                  textAlign: "center",
                }}
              >
                Time Line
              </th>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #dddddd",
                  textAlign: "center",
                }}
              >
                Notes
              </th>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #dddddd",
                  textAlign: "center",
                }}
              >
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #dddddd",
                  textAlign: "center",
                }}
                className="pl-2 pr-3 text-white"
              >
                Prospecting
              </td>
              <td style={{ padding: "0px"}}>
                <select
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  onChange={(e) =>
                    handleInputChange("Prospecting", "status", e.target.value)
                  }
                >
                  <option value={status1}>{status1}</option>
                  <option value="Done">Done</option>
                  <option value="Working on it">Working on it</option>
                  <option value="Stuck">Stuck</option>
                  <option value="Not started">Not started</option>
                </select>
              </td>

              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="date"
                  value={dueDate1}
                  onChange={(e) =>
                    handleInputChange("Prospecting", "dueDate", e.target.value)
                  }
                />
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  ref={specificInputRef}
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={timeLine1}
                  onClick={() => {
                    toggleSelectRange();
                  }}
                  onChange={(e) => {
                    handleInputChange(
                      "Prospecting",
                      "timeLiine",
                      e.target.value
                    );
                  }}
                />
                <div
                  ref={dateRangePickerRef}
                  style={{ position: "absolute", zIndex: 9999 }}
                >
                  {rangeSelected && (
                    <>
                      <div>
                        <DateRangePicker
                        style={{filter: "grayscale(100%) "}}
                          ranges={dateRange || ""}
                          onChange={(ranges) =>
                            handleSelectRange(
                              ranges,
                              "Prospecting",
                              "timeLiine",
                              "1"
                            )
                          }
                        />
                      </div>
                    </>
                  )}{" "}
                </div>
              </td>

              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={notes1}
                  onChange={(e) =>
                    handleInputChange("Prospecting", "Notes", e.target.value)
                  }
                />
              </td>
              <td style={{ padding: "0px"}}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={lastUpdated1}
                  onChange={(e) =>
                    handleInputChange(
                      "Prospecting",
                      "lastUpdated",
                      e.target.value
                    )
                  }
                  disabled
                />
              </td>
            </tr>

            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #dddddd",
                  textAlign: "center",
                }}
                className="pl-2 pr-3 text-white"
              >
                Qualification
              </td>
              <td style={{ padding: "0px" }}>
                <select
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  onChange={(e) =>
                    handleInputChange("Qualification", "status", e.target.value)
                  }
                >
                  <option value={status2}>{status2}</option>
                  <option value="Done">Done</option>
                  <option value="Working on it">Working on it</option>
                  <option value="Stuck">Stuck</option>
                  <option value="Not started">Not started</option>
                </select>
              </td>

              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="date"
                  value={dueDate2}
                  onChange={(e) =>
                    handleInputChange(
                      "Qualification",
                      "dueDate",
                      e.target.value
                    )
                  }
                />
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  ref={specificInputRef2}
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={timeLine2}
                  onClick={() => {
                    toggleSelectRange2();
                  }}
                  onChange={(e) => {
                    handleInputChange(
                      "Qualification",
                      "timeLiine",
                      e.target.value
                    );
                  }}
                />
                <div
                  ref={dateRangePickerRef2}
                  style={{ position: "absolute", zIndex: 9999 }}
                >
                  {rangeSelected2 && (
                    <>
                      <div>
                        <DateRangePicker
                        style={{filter: "grayscale(100%) "}}
                          ranges={dateRange || ""}
                          onChange={(ranges) =>
                            handleSelectRange(
                              ranges,
                              "Qualification",
                              "timeLiine",
                              "2"
                            )
                          }
                        />
                      </div>
                    </>
                  )}{" "}
                </div>
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={notes2}
                  onChange={(e) =>
                    handleInputChange("Qualification", "Notes", e.target.value)
                  }
                />
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={lastUpdated2}
                  onChange={(e) =>
                    handleInputChange(
                      "Qualification",
                      "lastUpdated",
                      e.target.value
                    )
                  }
                  disabled
                />
              </td>
            </tr>

            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #dddddd",
                  textAlign: "center",
                }}
                className="pl-2 pr-3 text-white"
              >
                Quotation
              </td>
              <td style={{ padding: "0px" }}>
                <select
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  onChange={(e) =>
                    handleInputChange("Quotation", "status", e.target.value)
                  }
                >
                  <option value={status3}>{status3}</option>
                  <option value="Done">Done</option>
                  <option value="Working on it">Working on it</option>
                  <option value="Stuck">Stuck</option>
                  <option value="Not started">Not started</option>
                </select>
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="date"
                  value={dueDate3}
                  onChange={(e) =>
                    handleInputChange("Quotation", "dueDate", e.target.value)
                  }
                />
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  ref={specificInputRef3}
                  style={{ width: "100%", padding: "9px" , textAlign: "center"}}
                  type="text"
                  value={timeLine3}
                  onClick={() => {
                    toggleSelectRange3();
                  }}
                  onChange={(e) => {
                    handleInputChange("Quotation", "timeLiine", e.target.value);
                  }}
                />
                <div
                  ref={dateRangePickerRef3}
                  style={{ position: "absolute", zIndex: 9999 }}
                >
                  {rangeSelected3 && (
                    <>
                      <div>
                        <DateRangePicker
                        style={{filter: "grayscale(100%) "}}
                          ranges={dateRange || ""}
                          onChange={(ranges) =>
                            handleSelectRange(
                              ranges,
                              "Quotation",
                              "timeLiine",
                              "3"
                            )
                          }
                        />
                      </div>
                    </>
                  )}{" "}
                </div>
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={notes3}
                  onChange={(e) =>
                    handleInputChange("Quotation", "Notes", e.target.value)
                  }
                />
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={lastUpdated3}
                  onChange={(e) =>
                    handleInputChange(
                      "Quotation",
                      "lastUpdated",
                      e.target.value
                    )
                  }
                  disabled
                />
              </td>
            </tr>

            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #dddddd",
                  textAlign: "center",
                }}
                className="pl-2 pr-3 text-white"
              >
                Negotiation
              </td>
              <td style={{ padding: "0px" }}>
                <select
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  onChange={(e) =>
                    handleInputChange("Negotiation", "status", e.target.value)
                  }
                >
                  <option value={status4}>{status4}</option>
                  <option value="Done">Done</option>
                  <option value="Working on it">Working on it</option>
                  <option value="Stuck">Stuck</option>
                  <option value="Not started">Not started</option>
                </select>
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="date"
                  value={dueDate4}
                  onChange={(e) =>
                    handleInputChange("Negotiation", "dueDate", e.target.value)
                  }
                />
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  ref={specificInputRef4}
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={timeLine4}
                  onClick={() => {
                    toggleSelectRange4();
                  }}
                  onChange={(e) => {
                    handleInputChange(
                      "Negotiation",
                      "timeLiine",
                      e.target.value
                    );
                  }}
                />
                <div
                  ref={dateRangePickerRef4}
                  style={{ position: "absolute", zIndex: 9999 }}
                >
                  {rangeSelected4 && (
                    <>
                      <div>
                        <DateRangePicker
                        style={{filter: "grayscale(100%) "}}
                          ranges={dateRange || ""}
                          onChange={(ranges) =>
                            handleSelectRange(
                              ranges,
                              "Negotiation",
                              "timeLiine",
                              "4"
                            )
                          }
                        />
                      </div>
                    </>
                  )}{" "}
                </div>
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={notes4}
                  onChange={(e) =>
                    handleInputChange("Negotiation", "Notes", e.target.value)
                  }
                />
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px" , textAlign: "center"}}
                  type="text"
                  value={lastUpdated4}
                  onChange={(e) =>
                    handleInputChange(
                      "Negotiation",
                      "lastUpdated",
                      e.target.value
                    )
                  }
                  disabled
                />
              </td>
            </tr>

            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #dddddd",
                  textAlign: "center",
                }}
                className="pl-2 pr-3 text-white"
              >
                ContractSent
              </td>
              <td style={{ padding: "0px" }}>
                <select
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  onChange={(e) =>
                    handleInputChange("ContractSent", "status", e.target.value)
                  }
                >
                  <option value={status5}>{status5}</option>
                  <option value="Done">Done</option>
                  <option value="Working on it">Working on it</option>
                  <option value="Stuck">Stuck</option>
                  <option value="Not started">Not started</option>
                </select>
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="date"
                  value={dueDate5}
                  onChange={(e) =>
                    handleInputChange("ContractSent", "dueDate", e.target.value)
                  }
                />
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  ref={specificInputRef5}
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={timeLine5}
                  onClick={() => {
                    toggleSelectRange5();
                  }}
                  onChange={(e) => {
                    handleInputChange(
                      "ContractSent",
                      "timeLiine",
                      e.target.value
                    );
                  }}
                />
                <div
                  ref={dateRangePickerRef5}
                  style={{ position: "absolute", zIndex: 9999 }}
                >
                  {rangeSelected5 && (
                    <>
                      <div>
                        <DateRangePicker
                        style={{filter: "grayscale(100%) "}}
                          ranges={dateRange || ""}
                          onChange={(ranges) =>
                            handleSelectRange(
                              ranges,
                              "ContractSent",
                              "timeLiine",
                              "5"
                            )
                          }
                        />
                      </div>
                    </>
                  )}{" "}
                </div>
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={notes5}
                  onChange={(e) =>
                    handleInputChange("ContractSent", "Notes", e.target.value)
                  }
                />
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={lastUpdated5}
                  onChange={(e) =>
                    handleInputChange(
                      "ContractSent",
                      "lastUpdated",
                      e.target.value
                    )
                  }
                  disabled
                />
              </td>
            </tr>

            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #dddddd",
                  textAlign: "center",
                }}
                className="pl-2 pr-3 text-white"
              >
                Closing
              </td>
              <td style={{ padding: "0px" }}>
                <select
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  onChange={(e) =>
                    handleInputChange("Closing", "status", e.target.value)
                  }
                >
                  <option value={status6}>{status6}</option>
                  <option value="Done">Done</option>
                  <option value="Working on it">Working on it</option>
                  <option value="Stuck">Stuck</option>
                  <option value="Not started">Not started</option>
                </select>
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="date"
                  value={dueDate6}
                  onChange={(e) =>
                    handleInputChange("Closing", "dueDate", e.target.value)
                  }
                />
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  ref={specificInputRef6}
                  style={{ width: "100%", padding: "9px" , textAlign: "center"}}
                  type="text"
                  value={timeLine6}
                  onClick={() => {
                    toggleSelectRange6();
                  }}
                  onChange={(e) => {
                    handleInputChange("Closing", "timeLiine", e.target.value);
                  }}
                />
                <div
                  ref={dateRangePickerRef6}
                  style={{ position: "absolute", zIndex: 9999 }}
                >
                  {rangeSelected6 && (
                    <>
                      <div>
                        <DateRangePicker
                        style={{filter: "grayscale(100%) "}}
                          ranges={dateRange || ""}
                          onChange={(ranges) =>
                            handleSelectRange(
                              ranges,
                              "Closing",
                              "timeLiine",
                              "6"
                            )
                          }
                        />
                      </div>
                    </>
                  )}{" "}
                </div>
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px" , textAlign: "center"}}
                  type="text"
                  value={notes6}
                  onChange={(e) =>
                    handleInputChange("Closing", "Notes", e.target.value)
                  }
                />
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px" , textAlign: "center"}}
                  type="text"
                  value={lastUpdated6}
                  onChange={(e) =>
                    handleInputChange("Closing", "lastUpdated", e.target.value)
                  }
                  disabled
                />
              </td>
            </tr>

            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #dddddd",
                  textAlign: "center",
                }}
                className="pl-2 pr-3 text-white"
              >
                {" "}
                PostClosureFollowUp
              </td>
              <td style={{ padding: "0px" }}>
                <select
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  onChange={(e) =>
                    handleInputChange(
                      "Postclosing followup",
                      "status",
                      e.target.value
                    )
                  }
                >
                  <option value={status7}>{status7}</option>
                  <option value="Done">Done</option>
                  <option value="Working on it">Working on it</option>
                  <option value="Stuck">Stuck</option>
                  <option value="Not started">Not started</option>
                </select>
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="date"
                  value={dueDate7}
                  onChange={(e) =>
                    handleInputChange(
                      "Postclosing followup",
                      "dueDate",
                      e.target.value
                    )
                  }
                />
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  ref={specificInputRef7}
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={timeLine7}
                  onClick={() => {
                    toggleSelectRange7();
                  }}
                  onChange={(e) => {
                    handleInputChange(
                      "Postclosing followup",
                      "timeLiine",
                      e.target.value
                    );
                  }}
                />
                <div
                  ref={dateRangePickerRef7}
                  style={{ position: "absolute", zIndex: 9999 }}
                >
                  {rangeSelected7 && (
                    <>
                      <div>
                        <DateRangePicker
                        style={{filter: "grayscale(100%) "}}
                          ranges={dateRange || ""}
                          onChange={(ranges) =>
                            handleSelectRange(
                              ranges,
                              "Postclosing followup",
                              "timeLiine",
                              "7"
                            )
                          }
                        />
                      </div>
                    </>
                  )}{" "}
                </div>
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={notes7}
                  onChange={(e) =>
                    handleInputChange(
                      "Postclosing followup",
                      "Notes",
                      e.target.value
                    )
                  }
                />
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  style={{ width: "100%", padding: "9px", textAlign: "center" }}
                  type="text"
                  value={lastUpdated7}
                  onChange={(e) =>
                    handleInputChange(
                      "Postclosing followup",
                      "lastUpdated",
                      e.target.value
                    )
                  }
                  disabled
                />
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default TrackIndividualDealsProgress;
