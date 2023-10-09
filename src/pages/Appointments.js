import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    InputBase,
    Typography,
    Paper,
    IconButton,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import editIcon from "../assets/images/editIcon.svg";
import viewIcon from "../assets/images/eye.svg";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import DoctorIcon from '../assets/images/doctor.svg';
import DownloadIcon from '../assets/images/download.svg';
import NoDoctorImg from '../assets/images/no-doctor.svg';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { AppointmentListing } from '../apis/adminApis';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const columns = [
    { id: "id", label: "S.no.", minWidth: 40, },
    { id: "patientName", label: "Patient Name", minWidth: 140 },
    { id: "patientAge", label: "Age", minWidth: 110 },
    { id: "email", label: "Email", minWidth: 110 },
    { id: "mobileNo", label: "Mobile", minWidth: 140 },
    { id: "status", label: "Status", minWidth: 140 },
];


const Appointments = () => {
    const navigate = useNavigate();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(14);
    const [appointmentListing, setAppointmentListing] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState('');
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    useEffect(() => {
        AppointmentListing()
            .then((response) => {
                if ((response.data)) {
                    console.log("pppp data", response.data.data)
                    setAppointmentListing(response?.data?.data);
                    setRowsPerPage(Math.min(10, response?.data?.data.length));
                } else {
                    console.error("API response is not an array:", response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
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
                                            <TableCell>{data.patient.age}</TableCell>
                                            <TableCell>{data.patient.email}</TableCell>
                                            <TableCell>{data.patient.phone}</TableCell>
                                            <TableCell>{data.status}
                                                <Select
                                                    className="select-field"
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={selectedType}
                                                    onChange={handleTypeChange}
                                                    name="notificationType"
                                                    fullWidth
                                                >
                                                    <MenuItem value="">Pending  </MenuItem>
                                                    <MenuItem value="">Reschedule </MenuItem>
                                                    <MenuItem value="">Completed</MenuItem>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        :
                        <div className="no-doc-list">
                            <img src={NoDoctorImg} alt="No Doctor" />
                            <h5>No doctor added yet</h5>
                            <p>Lorem ipsum dolor sit amet consectetur.</p>
                        </div>
                    }
                </TableContainer>
            </Paper>
            {/* <TablePagination
        className="customTablePagination"
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={doctorList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarMessage.includes("successfully") ? "success" : "error"}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar> */}
        </div>
    )
}

export default Appointments