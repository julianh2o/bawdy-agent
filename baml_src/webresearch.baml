// Defining a data model.
class WebsearchResponse {
  queryString string
  summarizationGuidance string
}

function FormulateWebResearch(researchQuestion: string) -> WebsearchResponse {
  client "Generic"
  prompt #"
    You are a search professional leading a team of web researchers.
    You are given a research question and you must come up with a brief search query to search the web with.
    In addition, you must provide a short piece of text describing what details or information should be extracted from the results.
    The research question is: {{ researchQuestion }}

    {{ ctx.output_format }}
  "#
}



test cessna_formulatewebresearch{
  functions [FormulateWebResearch]
  args {
    researchQuestion #"How much does a cessna 172 cost?"#
  }
}
