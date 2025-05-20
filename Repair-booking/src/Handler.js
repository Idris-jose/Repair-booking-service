import { http, HttpResponse } from 'msw';

// Define the stations data as a constant
export const stations = [
  {
    name: 'Autofix garage',
    distance: '2 miles',
    star: 4.5,
    timeSlots: [
      { time: '9:00 AM', available: true },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: false },
      { time: '12:00 PM', available: true },
    ],
  },
  {
    name: 'QuickRepair Center',
    distance: '5 miles',
    star: 4.0,
    timeSlots: [
      { time: '9:30 AM', available: true },
      { time: '10:30 AM', available: false },
      { time: '1:00 PM', available: true },
      { time: '2:00 PM', available: true },
    ],
  },
  {
    name: 'City Motors',
    distance: '10 miles',
    star: 4.2,
    timeSlots: [
      { time: '8:00 AM', available: true },
      { time: '9:00 AM', available: false },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: true },
    ],
  },
  {
    name: 'Urban Repairs',
    distance: '15 miles',
    star: 4.3,
    timeSlots: [
      { time: '12:00 PM', available: true },
      { time: '1:00 PM', available: true },
      { time: '3:00 PM', available: false },
      { time: '4:00 PM', available: true },
    ],
  },
  {
    name: 'Modern Auto',
    distance: '20 miles',
    star: 4.1,
    timeSlots: [
      { time: '8:30 AM', available: true },
      { time: '9:30 AM', available: true },
      { time: '10:30 AM', available: true },
      { time: '11:30 AM', available: false },
    ],
  },
];

export const handlers = [
  http.get('https://example.com/stations', () => {
    return HttpResponse.json(stations);
  }),
];