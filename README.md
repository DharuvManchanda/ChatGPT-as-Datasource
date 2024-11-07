
# godspeed-custom-datasource-chatgpt
Welcome to the [Godspeed](https://www.godspeed.systems/) ChatGPT Custom Data Source! 

**Easily integrate OpenAI's ChatGPT within your Godspeed project for dynamic, conversational AI responses.**

This custom data source allows you to send prompts directly to ChatGPT and retrieve intelligent, human-like responses in your application, enhancing interactivity and user engagement.

## Features

- **Quick Integration**: Get ChatGPT up and running in your Godspeed project with minimal setup.
- **Configurable Responses**: Customize responses by setting parameters like model type, temperature, and maximum tokens.
- **Reliable API Management**: Enjoy dependable API interactions with built-in error handling.
- **Scalable Integration**: Designed to seamlessly scale with your application as your need for AI-driven interactions grows.

Ideal for applications that need conversational support, content generation, or interactive user experiences powered by AI. Enhance your application’s intelligence today!

## How to Use

1. **Set Up Your Godspeed Project**:
   - **Clone the Project**: Clone your existing Godspeed project or repository where you want to add ChatGPT integration.
     ```bash
     git clone <your-repo-url>
     cd <project-directory>
     ```
   - **Install Dependencies**: Once inside the project directory, install the necessary dependencies.
     ```bash
     npm install
     ```
   - **Set Up Environment Variables**: Add your OpenAI API key to the environment variables by including the following in your `.env` file:
     ```plaintext
     OPENAI_API_KEY="Enter_Your_OpenAI_API_Key"
     ```

2. **Add ChatGPT Custom Data Source Configuration**:
   - Inside the `src/datasources/` directory, add a `chatgpt.yaml` file with the following configuration:
   ```yaml
   type: chatgpt
   model: gpt-4o
   temperature: 1
   max_tokens: 200
   ```

## Example Usage:

#### ChatGPT Event Schema (src/events/chatgpt_event.yaml)

```yaml
http.post./chatgpt:
  summary: "Generate response from ChatGPT"
  description: "Endpoint to send a user prompt to ChatGPT and retrieve the AI-generated response."
  fn: prompt
  authn: false
  body:
    content:
      application/json:
        schema:
          type: object
          properties:
            prompt:
              type: string
              description: "The user's prompt or question for ChatGPT to respond to."
          required:
            - prompt
  responses:
    200:
      description: "Successful response from ChatGPT"
      content:
        application/json:
          schema:
            type: string
```

#### ChatGPT Workflow (src/functions/prompt.yaml)

```yaml
summary: "Get AI-driven response from ChatGPT with configurations from YAML file"
tasks:
  - id: request_chatgpt
    fn: datasource.chatgpt.execute
    args:
      prompt: <% inputs.body.prompt %>
```

### Thank You for Using Godspeed
This ChatGPT custom data source is here to power your project with cutting-edge conversational AI. Enjoy the possibilities of OpenAI with the flexibility of Godspeed!
