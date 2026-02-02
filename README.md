# Git-Mood

Git-Mood is a command-line interface (CLI) tool designed to leverage the Gemini API to analyze your Git commit history and provide insights into your development patterns. It aims to offer a unique perspective on your coding journey by interpreting commit messages and potentially suggesting improvements or highlighting trends.

## Features

*   **Commit Analysis:** Analyzes commit messages to extract sentiment and potential themes.
*   **Model Configuration:** Allows you to select and configure the Gemini model for analysis.
*   **Review Generation:** Can generate summaries or reviews based on commit history.
*   **README Generation Assistance:** May offer suggestions or content generation for your README files based on project activity.

## Installation

You can install Git-Mood globally using npm:

```bash
npm install -g git-mood
```

## Setup

Before using Git-Mood, you need to configure it with your Gemini API key.

1.  **Get your Gemini API Key:** Obtain an API key from the Google AI Studio.
2.  **Run the setup command:**

    ```bash
    git-mood setup
    ```
    This command will prompt you to enter your Gemini API key. It will then be securely stored for future use.

## Usage

Git-Mood provides several CLI commands to interact with the tool:

*   **`git-mood setup`**: Configure your Gemini API key.
*   **`git-mood model`**: Configure the Gemini model to be used for analysis.
*   **`git-mood commit`**: Analyze your recent commit history.
*   **`git-mood review`**: Generate a review of your commit history.
*   **`git-mood readme`**: Get assistance in generating or updating your README file.

### Examples

**Analyze recent commits:**

```bash
git-mood commit
```

**Generate a review of your commit history:**

```bash
git-mood review
```

**Get help with your README:**

```bash
git-mood readme
```

## Configuration

The primary configuration involves setting your Gemini API key via the `git-mood setup` command. Model selection can be done using `git-mood model`. Specific details about available models and their configurations will be provided by the `git-mood model` command.

## Requirements

*   Node.js (version X.X.X or higher recommended)
*   npm (or yarn)
*   A valid Google Cloud Project with the Gemini API enabled and an API key.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
