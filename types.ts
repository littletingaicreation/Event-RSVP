
export interface EventConfig {
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapsLink: string;
  description: string;
  organizerPhone: string;
  organizerName?: string;
}

export enum RSVPStatus {
  ATTENDING = 'attending',
  MAYBE = 'maybe',
  CANT_ATTEND = 'cant-attend'
}
