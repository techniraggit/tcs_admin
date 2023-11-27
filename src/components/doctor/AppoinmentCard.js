import React, { useState } from 'react';
import { TextField, Button, Grid, InputLabel } from '@mui/material';

const AppoinmentCard = () => {
    const [inputFields, setInputFields] = useState([
        {
            start_working_hr: '',
            end_working_hr: '',
            working_days: ''
        }
    ]);

    const handleAddFields = () => {
        setInputFields([...inputFields, { start_working_hr: '', end_working_hr: '', working_days: '' }]);
    };

    const handleRemoveFields = (index) => {
        const updatedFields = [...inputFields];
        updatedFields.splice(index, 1);
        setInputFields(updatedFields);
    };

    const handleChangeInput = (index, field, value) => {
        const updatedFields = [...inputFields];
        updatedFields[index][field] = value;
        setInputFields(updatedFields);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Perform your API call or other form submission logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            {inputFields.map((field, index) => (
                <div key={index}>
                    <Grid key={index} className="addRowOuter" container spacing={4} pb={2}>
                        <Grid item xs={12} md={4}>
                            <InputLabel className="customLabel" htmlFor={`hourStart-${index}`}>
                                Working hours start
                            </InputLabel>
                            <div className="twoInputWrap">
                                <TextField
                                    className="customField"
                                    fullWidth
                                    type="time"

                                    label="Start Working Hour"
                                    value={field.start_working_hr}
                                    onChange={(newValue) => handleChangeInput(index, 'start_working_hr', newValue)}
                                />
                            </div>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <InputLabel className="customLabel" htmlFor={`hourStart-${index}`}>
                                Working hours end
                            </InputLabel>
                            <div className="twoInputWrap">
                                <TextField
                                    className="customField"
                                    fullWidth
                                    label="End Working Hour"
                                    type="time"

                                    value={field.end_working_hr}
                                    onChange={(newValue) => handleChangeInput(index, 'end_working_hr', newValue)}
                                />
                            </div>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <InputLabel className="customLabel" htmlFor={`hourStart-${index}`}>
                                Working Days
                            </InputLabel>
                            <div className="twoInputWrap">
                                <TextField
                                    className="customField"
                                    fullWidth
                                    label="Working Days"
                                    value={field.working_days}
                                    onChange={(event) => handleChangeInput(index, 'working_days', event.target.value)}
                                />
                            </div></Grid>
                        <Button type="button" variant="contained" onClick={() => handleRemoveFields(index)}>
                            Remove
                        </Button>
                    </Grid>
                </div>
            ))}
            <Button type="button" variant="contained" onClick={handleAddFields}>
                Add More
            </Button>
            <Button type="submit" variant="contained">
                Submit
            </Button>
        </form>
    );
};

export default AppoinmentCard;
