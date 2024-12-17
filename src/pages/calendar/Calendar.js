import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
//
import { useState, useRef, useEffect } from 'react';
// @mui
import { Card, Button, DialogTitle, Grid2 as Grid, Dialog, Skeleton } from '@mui/material';
import axios from 'axios';
import moment from 'moment';

// routes
import { PATH_DASHBOARD } from '../../router/paths';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/common/Page';
import Iconify from '../../components/common/Iconify';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
// sections
import { CalendarForm, CalendarStyle, CalendarToolbar } from '../../components/pages/calendar';
import EventItem from '../../components/pages/calendar/EventItem';

// ----------------------------------------------------------------------

const INITIAL_EVENT = {
  attendees: [],
  start: null,
  color: '#6D53A5',
  allDay: true,
  end: null,
  title: '',
  description: '',
};

export default function Calendar() {
  const isDesktop = useResponsive('up', 'sm');

  const calendarRef = useRef(null);

  const [date, setDate] = useState(new Date());
  const [isReady, setIsReady] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(INITIAL_EVENT);

  const [view, setView] = useState(isDesktop ? 'dayGridMonth' : 'listWeek');

  const [events, setEvents] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getCalendarEvents();
  }, [date]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };
  const getCalendarEvents = () => {
    var url = `employee/calendar/?date=${moment(date).format('YYYY-MM')}`;
    axios.get(url).then(({ data }) => {
      setEvents(data);
      setIsReady(true);
    });
  };

  const handleAddEvent = () => {
    setIsCreating(true);
    setSelectedEvent(INITIAL_EVENT);
    setIsOpenModal(true);
  };

  const handleDelete = (id) => {
    setDeleting(true);
    const url = 'employee/calendar/?id=' + id;

    axios
      .delete(url)
      .then(() => {
        getCalendarEvents();
        setDeleting(false);
        setIsOpenModal(false);
        setSelectedEvent(INITIAL_EVENT);
      })
      .catch(() => {
        setDeleting(false);
        setIsOpenModal(false);
      });
  };

  const handleSubmit = (event, isEdit) => {
    setSubmitting(true);
    const url = 'employee/calendar/';
    var fetch = axios.post;

    if (!isCreating || isEdit) {
      fetch = axios.put;
    }

    fetch(url, { data: event })
      .then(() => {
        getCalendarEvents();
        setSubmitting(false);
        setIsOpenModal(false);
        setSelectedEvent(INITIAL_EVENT);
      })
      .catch(() => {
        setSubmitting(false);
        setIsOpenModal(false);
      });
  };

  return (
    <Page title="Calendar" roleBased role={{ name: 'Calendar', type: 'read' }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading="Calendar"
            hideBack
            links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Calendar' }]}
            action={
              <Button
                variant="contained"
                startIcon={<Iconify icon="mynaui:plus-solid" />}
                color={'text'}
                onClick={handleAddEvent}
              >
                New Event
              </Button>
            }
          />
          {isReady ? (
            <Card>
              <CalendarStyle>
                <CalendarToolbar
                  date={date}
                  view={view}
                  onNextDate={handleClickDateNext}
                  onPrevDate={handleClickDatePrev}
                  onToday={handleClickToday}
                  onChangeView={handleChangeView}
                />
                <FullCalendar
                  weekends
                  editable
                  droppable
                  selectable
                  events={events}
                  ref={calendarRef}
                  rerenderDelay={10}
                  initialDate={date}
                  initialView={view}
                  dayMaxEventRows={3}
                  eventDisplay="block"
                  headerToolbar={false}
                  allDayMaintainDuration
                  eventResizableFromStart
                  select={(val) => {
                    const data = {
                      ...INITIAL_EVENT,
                      start: moment(val.start).format('YYYY-MM-DD HH:mm:ss'),
                      end: moment(val.end).format('YYYY-MM-DD HH:mm:ss'),
                      allDay: val.allDay,
                    };
                    setIsCreating(true);
                    setSelectedEvent(data);
                    setIsOpenModal(true);
                  }}
                  eventDrop={(val) => {
                    setIsCreating(false);
                    const data = {
                      title: val.event.title,
                      start: moment(val.event.start).format('YYYY-MM-DD HH:mm:ss'),
                      end: moment(val.event.end).format('YYYY-MM-DD HH:mm:ss'),
                      allDay: val.event.allDay,
                      id: val.event.id,
                      color: val.event.backgroundColor,
                      ...val.event.extendedProps,
                    };
                    handleSubmit(data, true);
                  }}
                  eventClick={(val) => {
                    setSelectedEvent({
                      title: val.event.title,
                      start: moment(val.event.start).format('YYYY-MM-DD HH:mm:ss'),
                      end: moment(val.event.end).format('YYYY-MM-DD HH:mm:ss'),
                      allDay: val.event.allDay,
                      id: val.event.id,
                      color: val.event.backgroundColor,
                      ...val.event.extendedProps,
                    });
                    setIsCreating(false);
                    setIsOpenModal(true);
                  }}
                  height={isDesktop ? 720 : 'auto'}
                  plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                  eventContent={(arg) => <EventItem key={arg.event.id} event={arg.event} />}
                />
              </CalendarStyle>
            </Card>
          ) : (
            <Skeleton variant="rounded" height={700} />
          )}

          <Dialog
            open={isOpenModal}
            onClose={() => {
              setIsOpenModal(false);
            }}
            maxWidth={'sm'}
            id="event-dialog"
            aria-labelledby="event"
            aria-describedby="event"
          >
            <DialogTitle variant="subtitle1">{isCreating ? 'New Event' : 'Edit Event'}</DialogTitle>
            <CalendarForm
              initialData={selectedEvent}
              deleting={deleting}
              loading={submitting}
              isCreating={isCreating}
              onDelete={(id) => {
                handleDelete(id);
              }}
              onSubmit={(data) => {
                handleSubmit(data);
              }}
              onCancel={() => {
                setIsOpenModal(false);
              }}
            />
          </Dialog>
        </Grid>
      </Grid>
    </Page>
  );
}
