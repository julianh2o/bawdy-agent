// Learn more about clients at https://docs.boundaryml.com/docs/snippets/clients/overview
client<llm> Generic {
  provider openai-generic
  options {
    base_url "https://ollama.bawdyshop.space/v1"
    model "qwen:14b"
    default_role "user"
  }
}