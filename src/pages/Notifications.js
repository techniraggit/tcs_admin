import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { TableRow, InputBase, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TablePagination from "@mui/material/TablePagination";
import Filter from '../components/Filter';
import Loader from '../components/Loader';
import dayjs from "dayjs";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getNotificationListing } from '../apis/adminApis';


function createData(sno, subject, description, notificationDate,) {
  return {
    sno,
    subject,
    description,
    notificationDate,
    history: [
      {
        description: description
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell >{row.id}</TableCell>
        <TableCell>{row.title}</TableCell>
        <TableCell>{row.message}</TableCell>
        <TableCell>{dayjs(row.created).format("DD MMMM YYYY hh:mm A")}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className="expand-row">
        <TableCell style={{ padding: 0, height: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  {row.message ? ( // Check if message exists in row
                    <TableRow>
                      <TableCell>{row.message}</TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2}>No history available</TableCell>
                    </TableRow>
                  )}

                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    sno: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    notificationDate: PropTypes.string.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

// const rows = [];

const Notifications = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(14);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const { isLoading, data: notifications } = useQuery(["notifications"], async () => {
    const response = await getNotificationListing();
    // console.log("API Response:", response.data);
    if (response?.data?.status) {
      return response?.data?.push_notifications;
    }
    return [];
  }, {
    retry: false,
  }
  );

  // filter logic
  const filteredNotifications = notifications?.filter((notification) => {
    console.log("Raw notificationDate:", notification.notificationDate);
    const notificationDate = moment(notification.notificationDate); // Assuming notificationDate is a date string
    console.log("parsed notificationDate:", notification.notificationDate);
    if (
      (!fromDate || notificationDate.isSameOrAfter(fromDate)) &&
      (!toDate || notificationDate.isSameOrBefore(toDate))
    ) {
      console.log('data found')
      return true;
    }
    console.log('data not found')
    return false;
  });


  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="head-wrap">
        <Typography variant="font22" mb={4} sx={{ fontWeight: "700" }} component="h1"> Notification </Typography>
        <Button
          className="buttonPrimary small"
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/create-notification");
          }}
        >
          Create notifications
        </Button>
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Paper>

          <Filter
            search={true}
            date={true}
            download={false}
            setSearch={setSearch}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />

        </div>

        <TableContainer component={Paper} className="customTable">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sno.</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Notifications date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {/* {notifications?.map((notification, index) => (
                <Row key={index} row={notification} />
              ))} */}

              {filteredNotifications?.map((notification, index) => (
                <Row key={index} row={notification} />
              ))}

            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* <TablePagination
        className="customTablePagination"
        rowsPerPageOptions={[14, 28, 50]}
        component="div"
        count={notifications.length} 
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}

    </div>
  );
}

export default Notifications