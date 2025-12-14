function SummarizeWithGuidance(document: string, guidance: string) -> string {
  client "Generic"
  prompt #"
    You are a research assistant tasked with summarizing a document with
    guidance to as what details are most important to extract or the question to answer.

    Document to summarize: {{ document }}
    Summarize with the following guidance in mind: {{ guidance }}

    {{ ctx.output_format }}
  "#
}



test cessna_summarizewithguidance{
  functions [SummarizeWithGuidance]
  args {
    document #"

    "#
    guidance #" "#
  }
}
