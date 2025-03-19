import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Alert,
  Snackbar,
  Container,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import Base from "./Base";
import { useNavigate, useParams } from "react-router";

interface TimeSlot {
  id: string;
  time: string;
  selected: boolean;
}

export default function BarberSchedule() {
  // Get barber ID from URL params
  const barberId = useParams().barberId;
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigate = useNavigate();

  // Generate time slots from 9am to 6pm with 30-minute intervals
  const generateTimeSlots = (date: Date) => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 18;

    for (let hour = startHour; hour < endHour; hour++) {
      // For each hour, create two 30-minute slots
      ["00", "30"].forEach((minutes) => {
        const timeString = `${hour === 12 ? 12 : hour % 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
        slots.push({
          id: `${hour}-${minutes}`,
          time: timeString,
          selected: false,
        });
      });
    }

    return slots;
  };

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setTimeSlots(generateTimeSlots(date));
    } else {
      setTimeSlots([]);
    }
  };

  // Toggle a time slot selection
  const toggleTimeSlot = (id: string) => {
    setTimeSlots(
      timeSlots.map((slot) =>
        slot.id === id ? { ...slot, selected: !slot.selected } : slot
      )
    );
  };

  // Select all time slots
  const selectAll = () => {
    setTimeSlots(timeSlots.map((slot) => ({ ...slot, selected: true })));
  };

  // Deselect all time slots
  const deselectAll = () => {
    setTimeSlots(timeSlots.map((slot) => ({ ...slot, selected: false })));
  };

  // Submit schedule to API
  const submitSchedule = async () => {
    if (!selectedDate) {
      setSnackbarMessage("Please select a date first.");
      setSnackbarOpen(true);
      return;
    }

    const selectedSlots = timeSlots.filter((slot) => slot.selected);
    if (selectedSlots.length === 0) {
      setSnackbarMessage("Please select at least one time slot.");
      setSnackbarOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      // Format the data to send to the API
      const scheduleData = {
        date: selectedDate.toISOString().split("T")[0],
        timeSlots: selectedSlots.map((slot) => slot.time),
      };

      // API call would go here
      console.log("Submitting schedule:", scheduleData);

      // Mock API response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSnackbarMessage("Schedule created successfully!");
      setSnackbarOpen(true);

      // Reset form after successful submission
      setSelectedDate(null);
      setTimeSlots([]);
    } catch (error) {
      setSnackbarMessage("Error creating schedule. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
      // Redirect to dashboard "schedules" page
      navigate(`/barbers/${barberId}/schedules`);
    }
  };

  return (
    <Base
      children={
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Barber Schedule Creator
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                1. Select Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Schedule Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  disablePast
                />
              </LocalizationProvider>
            </Box>

            {timeSlots.length > 0 && (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    2. Select Available Time Slots
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Button variant="outlined" onClick={selectAll}>
                      Select All Slots
                    </Button>
                    <Button variant="outlined" onClick={deselectAll}>
                      Deselect All Slots
                    </Button>
                  </Box>

                  <Grid container spacing={2}>
                    {timeSlots.map((slot) => (
                      <Grid item xs={6} sm={4} md={3} key={slot.id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={slot.selected}
                              onChange={() => toggleTimeSlot(slot.id)}
                            />
                          }
                          label={slot.time}
                          sx={{
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                            p: 1,
                            width: "100%",
                            bgcolor: slot.selected
                              ? "primary.light"
                              : "background.paper",
                            color: slot.selected
                              ? "primary.contrastText"
                              : "text.primary",
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={submitSchedule}
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Schedule..." : "Create Schedule"}
                  </Button>
                </Box>
              </>
            )}
          </Paper>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={
                snackbarMessage.includes("successfully") ? "success" : "error"
              }
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      }
    />
  );
}
