import { useTheme } from "@emotion/react";
import { Button, Grid, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import { useState } from "react"



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const weekDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

function getStyles(name, weekDay, theme) {
  return {
    fontWeight:
      weekDay.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
function AddRemoveMultipleInputFields() {
    const theme = useTheme();

    const [inputFields, setInputFields] = useState([{
        start_working_hr: '',
        end_working_hr: '',
        working_days: ''
    }]);

    const addInputField = () => {
        console.log('submit');
        setInputFields([...inputFields, {
            start_working_hr: '',
            end_working_hr: '',
            working_days: ''
        }])

    }
    const removeInputFields = (index) => {
        const rows = [...inputFields];
        rows.splice(index, 1);
        setInputFields(rows);
    }
    const handleChange = (index, evnt) => {
        // console.log(index,evnt);

        const { name, value } = evnt.target;
        const list = [...inputFields];
        list[index][name] = value;
        setInputFields(list);



    }
    return (

        <div className="container">
            <div className="row">
                <div className="col-sm-8">
                    {
                        inputFields.map((data, index) => {
                            const { start_working_hr, end_working_hr, working_days } = data;
                            return (
                                <>
                                
                                

                <Grid key={index} className="addRowOuter" container spacing={4} pb={2}>
              <Grid item xs={12} md={4}>
                    <InputLabel className="customLabel" htmlFor={`hourStart-${index}`}>
                      Working hours start
                    </InputLabel>
                    <div className="twoInputWrap">
                      <TextField
                        className="customField"
                        fullWidth
                        id={`hourStart-${index}`}
                        type="time"
                        autoComplete="off"
                        name="start_working_hr"
                        value={start_working_hr}
                        onChange={(evnt) => handleChange(index, evnt)}                      />
                      <span className="to-text">to</span>
                    </div>
                    {/* {errors.start_working_hr && <span className="error">{errors.start_working_hr}</span>} */}
                    {/* {errors[`start_working_hr_${index}`] && (
                  <span className="error">{errors[`start_working_hr_${index}`]}</span>
                )} */}
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <InputLabel className="customLabel" htmlFor={`hourEnd-${index}`}>
                      Working hours end
                    </InputLabel>
                    <div className="twoInputWrap" style={{ padding: '0' }}>
                      <TextField
                        className="customField"
                        placeholder="Enter Clinic Name"
                        fullWidth
                        id={`hourEnd-${index}`}
                        type="time"
                        autoComplete="off"
                        name="end_working_hr"
                        value={end_working_hr}
                        onChange={(evnt) => handleChange(index, evnt)}                      />
                    </div>
                    {/* {errors.end_working_hr && <span className="error">{errors.end_working_hr}</span>} */}
                    {/* {errors[`end_working_hr_${index}`] && (
                  <span className="error">{errors[`end_working_hr_${index}`]}</span>
                )} */}
                  </Grid>
                  <Grid item xs={12} md={4} style={{ paddingRight: '20px' }}>
                    <InputLabel className="customLabel">Working Days</InputLabel>
                    <Select
                      className="customField"
                      labelId={`demo-multiple-name-label-${index}`}
                      id={`demo-multiple-name-${index}`}
                      multiple
                      name="working_days"
                      value={working_days}
                      onChange={(evnt) => handleChange(index, evnt)}                      input={<OutlinedInput label="Name" />}
                      MenuProps={MenuProps}
                    >
                      {weekDays.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, working_days, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* {errors.working_days && <span className="error">{errors.working_days}</span>} */}
                    {/* {errors[`working_days_${index}`] && (
                  <span className="error">{errors[`working_days_${index}`]}</span>
                )} */}
                  </Grid>
                  </Grid>
                                
                                <div className="row my-3" key={index}>
                                    <div className="col">
                                        <div className="form-group">
                                            <input type="text" onChange={(evnt) => handleChange(index, evnt)} value={start_working_hr} 
                                            name="start_working_hr" className="form-control" placeholder="Full Name" />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <input type="email" onChange={(evnt) => handleChange(index, evnt)} value={end_working_hr} name="end_working_hr" className="form-control" placeholder="Email Address" />
                                    </div>
                                    <div className="col">
                                        <input type="text" onChange={(evnt) => handleChange(index, evnt)} value={working_days} name="working_days" className="form-control" placeholder="Salary" />
                                    </div>
                                    <div className="col">



                                        {(inputFields.length !== 1) ? <button className="btn btn-outline-danger" onClick={removeInputFields}>Remove</button> : ''}


                                    </div>
                                </div>
                                </>

                            )
                        })
                    }

                    <div className="row">
                        <div className="col-12">

                            <Button className="btn btn-outline-success " onClick={addInputField}>Add New</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-sm-4">

            </div>
        </div>

    )
}
export default AddRemoveMultipleInputFields