import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    InputBase,
    Typography,
    Paper,
    IconButton,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import NoDataImg from '../assets/images/no-data.png';
import { AppointmentListing, saveCancelAppointment } from '../apis/adminApis';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import RescheduleDialog from "../components/RescheduleDialog";
import axios from "../apis/axiosConfig";

const columns = [
    { id: "id", label: "S.no.", minWidth: 40, },
    { id: "patientName", label: "Patient Name", minWidth: 140 },
    { id: "patientAge", label: "Date & Time", minWidth: 110 },
    { id: "patientAge", label: "Doctor Name", minWidth: 110 },
    { id: "email", label: "Email", minWidth: 110 },
    { id: "mobileNo", label: "Mobile", minWidth: 140 },
    { id: "status", label: "Status", minWidth: 140 },
];

const Appointments = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(14);
    const [appointmentListing, setAppointmentListing] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState({});
    const [openRecheduleDialog, setRescheduleDialog] = useState({open:false});

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };
      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };

    const handleTypeChange = (event, appointmentId) => {
        const { value } = event.target;
        setSelectedType((prevSelectedType) => ({
            ...prevSelectedType,
            [appointmentId]: value,
        }));
    };

    useEffect(() => {
        AppointmentListing()
            .then((response) => {
                if (response.data) {
                    //   console.log("pppp data", response.data.data);
                    setAppointmentListing(response?.data?.data);
                    const initialSelectedType = {};
                    response?.data?.data.forEach((data) => {
                        initialSelectedType[data.id] = data.status;
                    });

                    setSelectedType(initialSelectedType);
                    setRowsPerPage(Math.min(10, response?.data?.data.length));
                } else {
                    console.error("API response is not an array:", response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleCancelAppointment = (appointmentId) => {
        const cancelData = {
            appointment_id: appointmentId,
        };
    
        saveCancelAppointment(cancelData)
            .then((response) => {
                if (response.data) {
                   console.log('Appointment cancel successfully.')
                } else {
                    console.error("API response is not as expected:", response.data);
                }
            })
            .catch((error) => {
                console.error("Error canceling appointment:", error);
            });
    };

    const handleOpenRescheduleDialog = (appointmentId) => {
        const previouslySelectedValue = selectedType[appointmentId];
        setRescheduleDialog({ open: true, appointmentId, previouslySelectedValue });

        logSelectedType();
    };

    // Callback function to log the current selectedType
    const logSelectedType = () => {
        console.log("SelectedType updated:", selectedType);
    };

    const handleCloseRescheduleDialog = () => {
        if (openRecheduleDialog.previouslySelectedValue) {
            setSelectedType((prevSelectedType) => ({
                ...prevSelectedType,
                [openRecheduleDialog.appointmentId]: openRecheduleDialog.previouslySelectedValue,
            }));
            console.log('previous value', openRecheduleDialog.previouslySelectedValue)
        }
       
        setRescheduleDialog({open: false});
    };
      

    const handleSelectedTypeChange = (appointmentId, newValue) => {
        setSelectedType((prevSelectedType) => ({
            ...prevSelectedType,
            [appointmentId]: newValue,
        }));
        console.log("SelectedType updated:", selectedType);
    };

    return (
        <div>
            <Typography variant="font22" mb={4} sx={{ fontWeight: "700" }} component="h1"> Appointments </Typography>
            <Paper className="tableMainWrap">
                <div className="head-wrap">
                    <Paper component="form" className="headerSearchWrap">
                        <IconButton
                            type="button"
                            sx={{ p: "0px", fontSize: "18px", color: "#2B7DCD" }}
                            aria-label="search"
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </IconButton>
                        <InputBase
                            placeholder="Search..."
                            inputProps={{ "aria-label": "Search..." }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Paper>

                </div>

                <TableContainer className="customTable">
                    {appointmentListing.length > 0 ?
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointmentListing
                                    // .filter((doctor) =>
                                    //     `${doctor.user.first_name} ${doctor.user.last_name}`
                                    //         .toLowerCase()
                                    //         .includes(searchQuery.toLowerCase())
                                    // )
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((data, index) => (
                                        <TableRow
                                            key={data.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell> {page * rowsPerPage + index + 1} </TableCell>
                                            <TableCell>{data.patient.name}</TableCell>
                                            <TableCell>{new Date(data.schedule_date).toLocaleTimeString()} {new Date(data.schedule_date).toDateString()}</TableCell>
                                            <TableCell>{data.doctor.user.first_name} {data.doctor.user.last_name}</TableCell>
                                            <TableCell>{data.patient.email}</TableCell>
                                            <TableCell>{data.patient.phone}</TableCell>
                                            <TableCell>
                                                <Select
                                                    className="select-field status"
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={selectedType[data.id]}
                                                    onChange={(event) => {
                                                        handleTypeChange(event, data.appointment_id);
                                                        handleSelectedTypeChange(data.appointment_id, event.target.value); // Call the callback to update selectedType
                                                        // axios.put(axios.defaults.baseURL+"/admin/appointment-list",{"id":data.appointment_id,"status":event.target.value})
                                                        var myHeaders = new Headers();
                                                        myHeaders.append("Authorization", "Bearer "+ localStorage.getItem('token'));
                                                        debugger;
                                                        myHeaders.append("Content-Type", "application/json");

                                                        var raw = JSON.stringify({
                                                        "id": data.appointment_id,
                                                        "status": event.target.value
                                                        });

                                                        var requestOptions = {
                                                        method: 'PUT',
                                                        headers: myHeaders,
                                                        body: raw,
                                                        redirect: 'follow'
                                                        };

                                                        fetch(axios.defaults.baseURL+"admin/appointment-list", requestOptions)
                                                        .then(response => response.text())
                                                        .then(result => console.log(result))
                                                        .catch(error => console.log('error', error));
                                                    }}
                                                    name="status"
                                                    fullWidth
                                                >
                                                    {selectedType[data.id] && (
                                                        <MenuItem value={selectedType[data.id]}>
                                                            {selectedType[data.id]}
                                                        </MenuItem>
                                                    )}
                                                    <MenuItem value="Reschedule" onClick={() => { 
                                                        handleOpenRescheduleDialog(data.id);
                                                        logSelectedType();
                                                        }}>
                                                        Reschedule
                                                    </MenuItem>
                                                    <MenuItem value="Cancel" onClick={() => handleCancelAppointment(data.id)}>Cancel</MenuItem>
                                                </Select>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        :
                        <div className="no-data-wrap">
                            <img src={NoDataImg} alt="No Data" />
                            <h5>No data found!</h5>
                            <p>Lorem ipsum dolor sit amet consectetur.</p>
                        </div>
                    }
                </TableContainer>
            </Paper>
            <TablePagination
                className="customTablePagination"
                rowsPerPageOptions={[10, 20, 30]}
                component="div"
                count={appointmentListing.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {openRecheduleDialog.open && (
                <RescheduleDialog
                    open={openRecheduleDialog.open}
                    onClose={handleCloseRescheduleDialog}
                    appointmentId={openRecheduleDialog.appointmentId}
                    onSelectedTypeChange={handleSelectedTypeChange}
                    selectedType={selectedType}
                    logSelectedType={logSelectedType}
                />
            )}
        </div>


    )
}

export default Appointments