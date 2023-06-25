import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Box } from "@mui/material";

export const localizer = momentLocalizer(moment);
const CalendarPage = () => {
  const [eventsData, setEventsData] = useState([]);

  const handleSelect = ({ start, end }) => {
    const title = window.prompt("New Event name");
    if (title)
      setEventsData([
        ...eventsData,
        {
          start,
          end,
          title,
        },
      ]);
  };

  const generateRecurringEvents = (startDate, endDate) => {
    const recurringEvents = [];
    let currentDate = moment(startDate).startOf('day');

    while (currentDate.isSameOrBefore(endDate)) {
      if (currentDate.day() === 5) { // Friday (0 is Sunday, 1 is Monday, and so on)
        const eventStartDate = moment(currentDate).set({ hour: 9, minute: 0 }).toDate();
        const eventEndDate = moment(currentDate).set({ hour: 9, minute: 30 }).toDate();
        recurringEvents.push({
          title: 'Meeting',
          start: eventStartDate,
          end: eventEndDate,
        });
      }
      currentDate.add(1, 'day');
    }

    return recurringEvents;
  };

  const startDate = moment().startOf('month').toDate();
  const endDate = moment().endOf('month').toDate();
  const recurringEvents = generateRecurringEvents(startDate, endDate);
  return (
    <Box>
      <Calendar
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={[...recurringEvents, ...eventsData]}
        style={{ height: "80vh"}}
        onSelectEvent={(event) => alert(event.title)}
        onSelectSlot={handleSelect}
      />
    </Box>
  );
};

export default CalendarPage;
