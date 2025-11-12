export interface Event {
  event_id: string;
  source: string;
  event_type: string;
  payload: Record<string, any>;
  status: "pending" | "acknowledged";
  created_at: string;
  acknowledged_at: string | null;
}

export interface InboxResponse {
  events: Event[];
  total: number;
}

export interface CreateEventRequest {
  source: string;
  event_type: string;
  payload: Record<string, any>;
}

export interface CreateEventResponse {
  event_id: string;
  status: string;
  created_at: string;
  message: string;
}

export interface AcknowledgeEventResponse {
  event_id: string;
  status: string;
  acknowledged_at: string;
}

export interface EventTemplate {
  source: string;
  event_type: string;
  emoji: string;
  displayName: string;
  payload: Record<string, any>;
}
