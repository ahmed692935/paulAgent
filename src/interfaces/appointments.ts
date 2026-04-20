export interface Appointment {
  id: number;
  user_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  attendee_email: string;
  attendee_name: string;
  title: string;
  description: string;
  status: string;
  notes: string;
  created_at: string;
  owner_email: string;
  owner_username: string;
}

export interface AppointmentsResponse {
  success: boolean;
  appointments: Appointment[];
}
