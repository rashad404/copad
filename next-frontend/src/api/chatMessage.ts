import api from "./axios";
export async function postChatMessage(
  sessionId: string,
  chatId: string,
  message: string,
  language: string,
  fileIds: string[],
  memberId?: number,
) {
  return api.post(
    `/guest/chat/${encodeURIComponent(sessionId)}/${encodeURIComponent(chatId)}`,
    { message, language, fileIds },
    {
      params: {
        specialty: "general",
        ...(memberId !== undefined ? { memberId } : {}),
      },
      headers: { "X-Guest-Session-Id": sessionId },
    },
  );
}
