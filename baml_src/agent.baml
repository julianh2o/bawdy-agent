class GCalListCalendars {
  intent "gcal_listCalendars"
}

class GCalGetEvents {
  intent "gcal_getEvents"
  calendarId string @description("ID of calendar")
  startDate string @description("Beginning of range in ISO8601 format")
  endDate string @description("End of range in ISO8601 format")
}

class TextResponse {
  intent "textResponse"
  response string
}

class Message {
  role "user" | "assistant"
  content string
}

function SelectTool(messages: Message[]) -> GCalListCalendars | GCalGetEvents | TextResponse {
  client "Generic"
  prompt #"
    Today is December 13th, 2025
    You are a helpful assistant that can select tools based on the user's need in order to answer the user's question or respond to their messages.

    The conversation thus far is:
    {% for message in messages %}
      {{ _.role(message.role) }} 
      {{ message.content }}
    {% endfor %}

    {{ ctx.output_format }}
  "#
}



test TestToolChat {
  functions [SelectTool]
  args {
    messages [
      {
        role "user"
        content "What events do I have on my calendar this week?"
      }
    ]
  }
}