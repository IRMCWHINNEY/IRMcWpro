import { Doctor, Specialty } from './types';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Jenning',
    specialty: Specialty.CARDIOLOGIST,
    bio: 'Experienced cardiologist specializing in preventive care and heart health management. Committed to patient education and long-term wellness.',
    location: 'New York, NY',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/200/200?random=1',
    yearsExperience: 12,
    calendarSynced: true,
    availability: [
      { day: 'Mon', startTime: '09:00', endTime: '10:00', isBooked: false },
      { day: 'Mon', startTime: '10:00', endTime: '11:00', isBooked: true },
      { day: 'Wed', startTime: '14:00', endTime: '15:00', isBooked: false },
    ]
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: Specialty.DERMATOLOGIST,
    bio: 'Board-certified dermatologist with a focus on holistic skin treatments and early detection of skin conditions.',
    location: 'San Francisco, CA',
    rating: 4.8,
    imageUrl: 'https://picsum.photos/200/200?random=2',
    yearsExperience: 8,
    calendarSynced: false,
    availability: [
      { day: 'Tue', startTime: '11:00', endTime: '12:00', isBooked: false },
      { day: 'Thu', startTime: '09:00', endTime: '10:00', isBooked: false },
    ]
  },
  {
    id: '3',
    name: 'Dr. Emily Rose',
    specialty: Specialty.PEDIATRICIAN,
    bio: 'Compassionate pediatrician dedicated to the health and happiness of children from infancy through adolescence.',
    location: 'Chicago, IL',
    rating: 5.0,
    imageUrl: 'https://picsum.photos/200/200?random=3',
    yearsExperience: 15,
    calendarSynced: true,
    availability: [
      { day: 'Mon', startTime: '08:00', endTime: '09:00', isBooked: false },
      { day: 'Fri', startTime: '13:00', endTime: '14:00', isBooked: false },
    ]
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: Specialty.ORTHOPEDIST,
    bio: 'Sports medicine specialist helping athletes and active individuals recover from injuries and improve performance.',
    location: 'Austin, TX',
    rating: 4.7,
    imageUrl: 'https://picsum.photos/200/200?random=4',
    yearsExperience: 20,
    calendarSynced: true,
    availability: [
      { day: 'Wed', startTime: '10:00', endTime: '11:00', isBooked: false },
      { day: 'Thu', startTime: '15:00', endTime: '16:00', isBooked: false },
    ]
  }
];

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
