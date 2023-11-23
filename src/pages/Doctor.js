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
import Checkbox from '@mui/material/Checkbox';
import DoctorIcon from '../assets/images/doctor.svg';
import DownloadIcon from '../assets/images/download.svg';
import NoDoctorImg from '../assets/images/no-doctor.svg';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { doctorlisting, doctorStatus, DownloadSalaryReport } from '../apis/adminApis';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { saveAs } from 'file-saver';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
const columns = [
  { id: "checkbox", label: "", minWidth: 40, },
  { id: "id", label: "S.no.", minWidth: 40, },
  { id: "drName", label: "Dr. Name", minWidth: 140 },
  { id: "email", label: "Email", minWidth: 110 },
  { id: "mobileNo", label: "Mobile", minWidth: 140 },
  { id: "specification", label: "Specialization", minWidth: 110 },
  { id: "priority", label: "Priority", minWidth: 110 },
  { id: "clinicName", label: "Clinic Name", minWidth: 110 },
  { id: "status", label: "Status", minWidth: 110 },
  { id: "action", label: "Action", minWidth: 140, align: "center" },
];

const Doctor = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(14);
  const [doctorList, setDoctorList] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctorIds, setSelectedDoctorIds] = useState([]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    doctorlisting()
      .then((response) => {
        if ((response.data)) {
          setDoctorList(response.data?.data);
          setRowsPerPage(Math.min(10, response.data?.data.length));
          // console.log("doctorrrrrr *******", response.data)
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


  const handleSwitchChange = async (doctor) => {
    try {
      const updatedStatus = !doctor.active;
      await doctorStatus(doctor.user.id);
      setDoctorList((prevDoctorList) =>
        prevDoctorList.map((item) =>
          item.user.id === doctor.user.id ? { ...item, active: updatedStatus } : item
        )
      );

      setSnackbarMessage("Status updated successfully");
      setSnackbarOpen(true);
      window.location.reload();
    } catch (error) {
      console.error('Error updating doctor status:', error);
      setSnackbarMessage("Failed to update status");
      setSnackbarOpen(true);
    }
  };


  const handleCheckboxChange = (event, doctorId) => {
    if (event.target.checked) {
      // Add the doctor ID to the selectedDoctorIds array
      setSelectedDoctorIds((prevSelectedDoctorIds) => [
        ...prevSelectedDoctorIds,
        doctorId,
      ]);
    } else {
      // Remove the doctor ID from the selectedDoctorIds array
      setSelectedDoctorIds((prevSelectedDoctorIds) =>
        prevSelectedDoctorIds.filter((id) => id !== doctorId)
      );
    }
  };

  const handleSalaryReport = (selectedDoctorIds) => {
    const fileName = 'Salary_Payment_Report.xlsx';

    var myVar2 = selectedDoctorIds.join(', ');  // 'A, B, C'
    console.log(myVar2);

    DownloadSalaryReport(myVar2)
      .then((response) => {
        saveAs(response.data, fileName);
      })
      .catch((error) => {
        console.error("Error downloading XLSX report:", error);
      });
  }

  return (
    <div>
      <Typography variant="font22" mb={4} sx={{ fontWeight: "700" }} component="h1"> Doctor </Typography>
      <div className="top-total-wrap">
        <div className="left">
          <span className="icon-wrap"><img src={DoctorIcon} alt="Doctor" /></span>
          <div className="text-wrap">
            <h6>Total doctors</h6>
            <span>{doctorList.length}</span>
          </div>
        </div>
        <Button onClick={() => handleSalaryReport(selectedDoctorIds)} className="buttonPrimary small" variant="contained"><img src={DownloadIcon} alt='Add Doctor' style={{ marginRight: '8px' }} /> Salary and Payment Reports</Button>
      </div>
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

          <Button className="buttonPrimary small" variant="contained" onClick={() => { navigate('/add-doctor') }}><img src={DoctorIcon} alt='Add Doctor' style={{ width: '15px', marginRight: '8px' }} /> Add Doctor</Button>

        </div>

        <TableContainer className="customTable">
          {doctorList.length > 0 ?
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
                {doctorList
                  .filter((doctor) =>
                    `${doctor.user.first_name} ${doctor.user.last_name}`
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((doctor, index) => (
                    <TableRow
                      key={doctor.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell> <Checkbox {...label} checked={selectedDoctorIds.includes(doctor.user.id)}
                        onChange={(event) => handleCheckboxChange(event, doctor.user.id)} /></TableCell>
                      <TableCell> {page * rowsPerPage + index + 1} </TableCell>
                      <TableCell> <span onClick={() => { navigate('/view-doctor/'+doctor.user.id) }} style={{ cursor: 'pointer' }}>{doctor.user.first_name} {doctor.user.last_name} </span> </TableCell>
                      <TableCell>{doctor.user.email}</TableCell>
                      <TableCell>{doctor.user.phone_number}</TableCell>
                      <TableCell>{doctor.specialization}</TableCell>
                      <TableCell>{doctor.priority}</TableCell>
                      <TableCell>{doctor.clinic_name}</TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={doctor.is_active}
                              onChange={() => handleSwitchChange(doctor)}
                              color="primary"
                            />
                          }
                          label={doctor.is_active ? 'Active' : 'Inactive'}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="action-wrap">
                          <IconButton
                            aria-label="View"
                            size="small"
                            onClick={() => { navigate(`/view-doctor/${doctor.user.id}`) }}
                          >
                            <img src={viewIcon} alt="View" />
                          </IconButton>
                          <IconButton
                            aria-label="Edit"
                            size="small"
                            onClick={() => {
                              navigate(`/add-doctor?id=${doctor.user.id}`);
                            }}
                          >
                            <img src={editIcon} alt="Edit" />
                          </IconButton>
                        </div>

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
      <TablePagination
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
        autoHideDuration={3000} // Adjust the duration as needed
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
      </Snackbar>
    </div>
  )
}

export default Doctor