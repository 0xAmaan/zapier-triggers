import type {
  Event,
  InboxResponse,
  CreateEventRequest,
  CreateEventResponse,
  AcknowledgeEventResponse,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class APIError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred",
    }));
    throw new APIError(response.status, error.message || error.detail);
  }
  return response.json();
};

export const api = {
  /**
   * Get events from the inbox
   */
  getInbox: async (params?: {
    status?: "pending" | "acknowledged";
    limit?: number;
  }): Promise<InboxResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const url = `${API_BASE_URL}/api/v1/inbox${
      searchParams.toString() ? `?${searchParams}` : ""
    }`;

    const response = await fetch(url);
    return handleResponse<InboxResponse>(response);
  },

  /**
   * Get a single event by ID
   */
  getEvent: async (eventId: string): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/events/${eventId}`);
    return handleResponse<Event>(response);
  },

  /**
   * Create a new event
   */
  createEvent: async (
    data: CreateEventRequest,
  ): Promise<CreateEventResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<CreateEventResponse>(response);
  },

  /**
   * Acknowledge/delete an event
   */
  acknowledgeEvent: async (
    eventId: string,
  ): Promise<AcknowledgeEventResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/events/${eventId}`, {
      method: "DELETE",
    });
    return handleResponse<AcknowledgeEventResponse>(response);
  },

  /**
   * Check API health
   */
  healthCheck: async (): Promise<{ status: string; service: string }> => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  },
};
