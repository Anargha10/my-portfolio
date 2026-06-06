import { CHAT_LIMITS } from "./constants";

const VALID_ROLES = new Set(["user", "assistant"]);

/**
 * @param {unknown} messages
 * @returns {{ ok: true, messages: Array<{ role: "user" | "assistant", content: string }> } | { ok: false, error: string, status: number }}
 */
export function validateMessages(messages) {
  if (!Array.isArray(messages)) {
    return { ok: false, error: "Messages must be an array.", status: 400 };
  }

  if (messages.length === 0) {
    return { ok: false, error: "At least one message is required.", status: 400 };
  }

  if (messages.length > CHAT_LIMITS.MAX_MESSAGES_PER_REQUEST) {
    return {
      ok: false,
      error: `Too many messages. Maximum is ${CHAT_LIMITS.MAX_MESSAGES_PER_REQUEST}.`,
      status: 400,
    };
  }

  const sanitized = [];

  for (const message of messages) {
    if (!message || typeof message !== "object") {
      return { ok: false, error: "Each message must be an object.", status: 400 };
    }

    const { role, content } = message;

    if (!VALID_ROLES.has(role)) {
      return { ok: false, error: "Message role must be user or assistant.", status: 400 };
    }

    if (typeof content !== "string") {
      return { ok: false, error: "Message content must be a string.", status: 400 };
    }

    const trimmed = content.trim();

    if (!trimmed) {
      return { ok: false, error: "Message content cannot be empty.", status: 400 };
    }

    if (trimmed.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH) {
      return {
        ok: false,
        error: `Message exceeds ${CHAT_LIMITS.MAX_MESSAGE_LENGTH} characters.`,
        status: 400,
      };
    }

    sanitized.push({ role, content: trimmed });
  }

  if (sanitized[sanitized.length - 1].role !== "user") {
    return {
      ok: false,
      error: "The last message must be from the user.",
      status: 400,
    };
  }

  return { ok: true, messages: sanitized };
}
