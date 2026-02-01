# Git-Mood

Git-Mood is a command-line interface (CLI) tool designed to enhance your Git workflow by integrating AI-powered assistance for common Git tasks. It leverages the power of AI to help you generate commit messages, review code, and even draft README files.

## Features

*   **AI-powered commit message generation:** Get intelligent and context-aware commit messages.
*   **Code review assistance:** Receive AI-driven feedback on your code changes.
*   **README generation:** Automate the creation of your project's README file.
*   **Model selection:** Choose and configure the AI model you want to use.

## Installation

To install Git-Mood globally on your system, run the following command:

```bash
npm install -g git-mood
```

or

```bash
yarn global add git-mood
```

## Setup

### Gemini API Key Configuration

Git-Mood uses the Gemini API for its AI functionalities. You need to obtain a Gemini API key and configure it for Git-Mood.

1.  **Get your Gemini API Key:**
    *   Visit the Google AI Studio: [https://aistudio.google.com/](https://aistudio.google.com/)
    *   Sign in with your Google account.
    *   Click on "Get API key".
    *   Follow the prompts to create a new API key.

2.  **Configure the API Key:**
    Open your terminal and run the setup command:

    ```bash
    git-mood setup
    ```

    The CLI will prompt you to enter your Gemini API key. Paste your key and press Enter. The key will be stored securely for future use.

## Usage

Git-Mood provides several commands to integrate AI into your Git workflow.

### `git-mood model`

This command allows you to view and set the AI model to be used by Git-Mood.

*   **View current model:**
    ```bash
    git-mood model
    ```
*   **Set a specific model:**
    (Replace `[model_name]` with the desired model, e.g., `gemini-pro`)
    ```bash
    git-mood model set [model_name]
    ```

### `git-mood commit`

Generate an AI-powered commit message for your staged changes.

```bash
git-mood commit
```

This command will analyze your staged changes and suggest a commit message. You will have the option to accept, edit, or regenerate the message.

### `git-mood review`

Initiate an AI-powered code review for your staged changes.

```bash
git-mood review
```

This command will provide feedback and suggestions on your code.

### `git-mood readme`

Generate a draft of your project's README.md file using AI.

```bash
git-mood readme
```

This command will create a `README.md` file in your project's root directory with an AI-generated content.

## Configuration

Git-Mood's configuration is primarily managed through environment variables or the `git-mood setup` command for sensitive information like API keys. The AI model can be set using the `git-mood model` command.

## Requirements

*   Node.js (version 14 or higher)
*   npm or yarn

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
