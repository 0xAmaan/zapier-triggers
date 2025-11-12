import type { EventTemplate } from "@/types/api";

export const eventTemplates: EventTemplate[] = [
  {
    source: "stripe",
    event_type: "payment.succeeded",
    emoji: "💳",
    displayName: "Stripe - Payment Succeeded",
    payload: {
      amount: 4999,
      currency: "usd",
      customer_id: "cus_12345",
    },
  },
  {
    source: "stripe",
    event_type: "payment.failed",
    emoji: "❌",
    displayName: "Stripe - Payment Failed",
    payload: {
      amount: 2999,
      currency: "usd",
      error: "insufficient_funds",
    },
  },
  {
    source: "gmail",
    event_type: "email.received",
    emoji: "📧",
    displayName: "Gmail - Email Received",
    payload: {
      from: "user@example.com",
      subject: "Important Update",
      has_attachment: true,
    },
  },
  {
    source: "slack",
    event_type: "message.sent",
    emoji: "💬",
    displayName: "Slack - Message Sent",
    payload: {
      channel: "#general",
      user: "user123",
      text: "Hello, world!",
    },
  },
  {
    source: "github",
    event_type: "push",
    emoji: "🔀",
    displayName: "GitHub - Push",
    payload: {
      repo: "zapier/triggers-api",
      commits: 3,
      branch: "main",
    },
  },
  {
    source: "github",
    event_type: "pull_request.opened",
    emoji: "🔀",
    displayName: "GitHub - PR Opened",
    payload: {
      repo: "zapier/triggers-api",
      pr_number: 42,
      author: "developer",
    },
  },
  {
    source: "shopify",
    event_type: "order.created",
    emoji: "🛒",
    displayName: "Shopify - Order Created",
    payload: {
      order_id: "ord_12345",
      total: 149.99,
      items: 3,
    },
  },
  {
    source: "twilio",
    event_type: "sms.received",
    emoji: "📱",
    displayName: "Twilio - SMS Received",
    payload: {
      from: "+15551234567",
      body: "Hello from Twilio!",
    },
  },
];
