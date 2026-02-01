# Git-Mood

Git-Mood is a command-line interface (CLI) tool designed to leverage the power of AI (specifically Gemini) to enhance your Git workflow. It aims to provide intelligent assistance for tasks such as generating commit messages, reviewing code, and even helping with your README documentation.

## Features

*   **AI-Powered Commit Messages:** Generate relevant and descriptive commit messages based on your code changes.
*   **Code Review Assistance:** Get AI-driven feedback and suggestions on your code.
*   **README Generation/Improvement:** Utilize AI to help draft or refine your project's README file.


## Installation

To install Git-Mood, run the following command:

```bash
npm install -g git-mood
```

Or, if you prefer using Yarn:

```bash
yarn global add git-mood
```


1.  **Get your Gemini API Key:** Obtain an API key from Google AI Studio.
2.  **Configure the CLI:** Run the setup command to store your API key.

    ```bash
    git-mood setup
    ```

    This command will prompt you to enter your Gemini API key.

## Usage

Git-Mood provides several commands to integrate AI into your Git workflow.

### `git-mood model`

View or set the AI model to be used.

**Commands:**

*   `git-mood model list`: List available AI models.
*   `git-mood model set <model_name>`: Set the AI model to be used.

**Example:**

```bash
git-mood model list
git-mood model set gemini-pro
```

### `git-mood commit`

Generate an AI-powered commit message based on your staged changes.

**Command:**

```bash
git-mood commit
```

**Example:**

```bash
git add .
git-mood commit
# Follow the prompts to confirm or edit the generated message
```

### `git-mood review`

Get AI feedback on your staged code changes.

**Command:**

```bash
git-mood review
```

**Example:**

```bash
git add .
git-mood review
# The AI will provide review comments and suggestions
```

### `git-mood readme`

Generate or improve your `README.md` file using AI.

**Command:**

```bash
git-mood readme
```

**Example:**

```bash
git-mood readme
# The AI will assist in generating or refining your README.md
```

## Configuration

*   **Gemini API Key:** Stored securely after running `git-mood setup`.
*   **Default Model:** The `git-mood model set` command sets the default AI model.

## Requirements

*   Node.js (version 14 or higher recommended)
*   npm or Yarn

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
