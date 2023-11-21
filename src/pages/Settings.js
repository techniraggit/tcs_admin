import React, { useState, useEffect } from "react";
import {
    InputBase,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    InputLabel,
    Stack,
    IconButton
} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';

function createData(id, aptcharges, createdDate) {
    return { id, aptcharges, createdDate };
}

// const initialRows = [
//   createData(1, "2000", "12/03/2023"),
//   createData(2, "2050", "12/03/2023"),
//   createData(3, "2090", "12/03/2023"),
// ];

const Settings = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [rows, setRows] = useState([]);
    const [appointmentCharges, setAppointmentCharges] = useState("");

    // Load rows from local storage on component mount
    useEffect(() => {
        const storedRows = JSON.parse(localStorage.getItem("appointmentRows")) || [];
        setRows(storedRows);
    }, []);

    // Save rows to local storage whenever the rows state changes
    useEffect(() => {
        localStorage.setItem("appointmentRows", JSON.stringify(rows));
    }, [rows]);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleAddAppointmentCharges = () => {
        if (appointmentCharges) {
            const newRow = createData(
                rows.length + 1,
                appointmentCharges,
                new Date().toLocaleDateString()
            );
            setRows([...rows, newRow]);
            setAppointmentCharges("");
            handleCloseDialog();
        }
    };

    return (
        <div className="setting">
            <div className="head-wrap">
                <Typography variant="font22" mb={4} sx={{ fontWeight: "700" }} component="h1"> Settings </Typography>
            </div>

            <Paper className="tableMainWrap" style={{ padding: '30px', width: '650px' }}>
                <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                    <Button
                        className="buttonPrimary small"
                        variant="contained"
                        color="primary"
                        onClick={handleOpenDialog}
                    >
                        Add Appointment Charges
                    </Button>
                </div>
                <TableContainer className="customTable">
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell> Appointment Charges </TableCell>
                                <TableCell> Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell>{row.aptcharges}</TableCell>
                                    <TableCell>{row.createdDate}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Dialog for adding appointment charges */}
            <Dialog open={openDialog} onClose={handleCloseDialog} className="md-dialog ">
                <div style={{ width: 475 }}>
                    <Stack className='popupHeader'>
                        <DialogTitle>Add Appointment Charges</DialogTitle>
                        <IconButton disableRipple type="button" onClick={handleCloseDialog} sx={{ p: '0px', color: '#000' }}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </IconButton>
                    </Stack>
                    <DialogContent>
                        <form className="customForm">
                            <InputLabel className="customLabel">Appointment charges</InputLabel>
                            <TextField
                                className="customField"
                                placeholder="Enter Appointment charges"
                                fullWidth
                                type="number"
                                name="appointment_charges"
                                value={appointmentCharges}
                                onChange={(e) => setAppointmentCharges(e.target.value)}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions style={{ justifyContent: 'center', marginBottom: '20px' }}>
                        <Button className='buttonPrimary small uppercase' variant="contained" onClick={handleAddAppointmentCharges} style={{ color: '#fff' }}>
                            Add Charges
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>

        </div>
    )
}

export default Settings