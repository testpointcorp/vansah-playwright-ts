<div align="center">
   <a href="https://vansah.com"><img src="https://vansah.com/app/logo/vansahjira-logo.svg" /></a><br>
</div>

<p align="center">This repository provides an integration between Playwright and <a href="https://vansah.com">Vansah Test Management for Jira</a> using TypeScript. It enables automated test logging, execution tracking, and Jira issue association directly from Playwright test scripts.</p>

<p align="center">
    <a href="https://vansah.com/"><b>Website</b></a> •
    <a href="https://vansah.com/connect-integrations/"><b>More Connect Integrations</b></a>
</p>

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Running Tests](#running-tests)
  - [VansahNode.ts Functions](#vansahnodets-functions)
  - [vansahTestInit.ts Usage](#vansahtestinitts-usage)
  - [Example Test Case](#example-test-case)
  - [Explanation](#explanation)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [Developed By](#developed-by)


## Features

- Seamless integration with Vansah Test Management API.
- Automated test run creation linked to Jira issues and test folders.
- Real-time test logging with screenshots and step-by-step execution details.
- Environment and release tracking for test runs.


## Installation

Before starting, ensure you have [Node.js](https://nodejs.org/) installed.

```sh
npm install
```

## Configuration

1. Create a `.env` file in the project root and add your Vansah authentication token:
   ```sh
   VANSAH_TOKEN=your_vansah_api_token_here
   ```
2. Update `vansahTestInit.ts` with your Vansah API URL and relevant details.


## Project Structure

```
.
├── vansahTestInit.ts  # Initializes VansahNode with API details
├── VansahNode.ts      # API client for interacting with Vansah
├── example.spec.ts    # Sample Playwright test with Vansah integration
├── package.json       # Project dependencies and metadata
├── .env               # Environment variables (ignored in Git)
└── README.md          # Project documentation
```

## Usage

### Running Tests

Execute the following command to run Playwright tests with Vansah integration:

```sh
npx playwright test
```

### VansahNode.ts Functions

The `VansahNode.ts` file contains multiple functions to interact with Vansah API:

- **setVansahUrl(url: string)** – Sets the Vansah API base URL.
- **setVansahToken(token: string)** – Sets the authentication token for Vansah API.
- **setSprintName(sprintName: string)** – Sets the sprint name associated with test cases.
- **setEnvironmentName(environmentName: string)** – Sets the environment name for test runs.
- **setReleaseName(releaseName: string)** – Sets the release name for test cases.
- **setJiraIssueKey(jiraIssueKey: string)** – Associates a Jira issue with test runs.
- **setTestFoldersId(testFoldersId: string)** – Sets the test folder identifier.
- **addTestRunFromJiraIssue(testCase: string)** – Creates a test run linked to a Jira issue.
- **addTestRunFromTestFolder(testCase: string)** – Creates a test run linked to a test folder.
- **addQuickTestFromJiraIssue(testCase: string, result: string)** – Adds a quick test execution linked to a Jira issue.
- **addQuickTestFromTestFolder(testCase: string, result: string)** – Adds a quick test execution linked to a test folder.
- **addTestLog(result: string, comment: string, testStepRow: number, imagePath?: string)** – Logs a test result with optional image attachment.

### vansahTestInit.ts Usage

The `vansahTestInit.ts` file initializes `VansahNode` with API credentials and relevant details. You must create this file and configure it as follows:

```ts
import dotenv from "dotenv";
import VansahNode from "./VansahNode";

dotenv.config();

const vansahnode = new VansahNode();
const token: string | undefined = process.env["VANSAH_TOKEN"];

if (!token) {
  throw new Error("VANSAH_TOKEN is not set. Please configure it in your environment or .env file.");
}

// Set the Vansah API base URL
vansahnode.setVansahUrl("https://prod.vansah.com"); //The base URL for your Vansah instance (e.g., `https://prod.vansah.com`) or Obtain your [Vansah Connect URL](https://help.vansah.com/en/articles/10407923-vansah-api-connect-url) from Vansah API Tokens

// Assign the API token for authentication
vansahnode.setVansahToken(token);

// Define the sprint name in Vansah where test cases will be linked
vansahnode.setSprintName("TF Sprint 1");

// Specify the testing environment (e.g., UAT, Production, Staging)
vansahnode.setEnvironmentName("UAT");

// Define the release name for organizing test cases
vansahnode.setReleaseName("TestingTRUNK");

// Link the configuration to a Jira issue key for tracking test execution
vansahnode.setJiraIssueKey("TF-4");

export default vansahnode;
```

This ensures that `VansahNode` is configured correctly and can be imported into test files.

### Example Test Case

The `example.spec.ts` file demonstrates how to log test executions into Vansah:

```ts
import { test, expect } from "@playwright/test";
import vansahnode from "../vansah-binding/vansahTestInit";

let TEST_CASE = "TF-C72"; // Replace with your test case key

test.describe("Example Playwright Test with Vansah Integration", () => {
  
  test.beforeAll(async () => {
    
    await vansahnode.addTestRunFromJiraIssue(TEST_CASE); // Create a test run before executing tests

  });

  test("Verify homepage title", async ({ page }) => {
    try {
      try {
      // Navigate to the Playwright homepage
      await page.goto("https://playwright.dev/");

      // Verify the page title contains 'Playwright'
      await expect(page).toHaveTitle(/Playwright/);
      
      await vansahnode.addTestLog("PASSED", "Homepage title is correct", 1, "sample/images/passed.png");   // Log success in Vansah

    } catch (error) {
      await vansahnode.addTestLog("FAILED", `Homepage title verification failed: ${error.message}`, 1, "sample/images/failed.png");  // Log failure in Vansah
      throw error;
    }
  });

  test("Check link navigation", async ({ page }) => {
    try {
      // Navigate to the Playwright homepage
      await page.goto("https://playwright.dev/");

      // Click the 'Get started' link
      await page.getByRole("link", { name: "Get started" }).click();

      // Verify the 'Installation' heading is visible
      await expect(
        page.getByRole("heading", { name: "Installation" })
      ).toBeVisible();

      // Log success in Vansah
      await vansahnode.addTestLog(
        "PASSED",
        "Link navigation is correct",
        2,
        "sample/images/passed.png"
      );
    } catch (error) {
      // Log failure in Vansah
      await vansahnode.addTestLog(
        "FAILED",
        `Link navigation failed: ${error.message}`,
        2,
        "sample/images/failed.png"
      );
      throw error;
    }
  });
});
```

### Explanation

- **Before running tests**, a test run is created and linked to a Jira issue.
- **Each test** logs the execution result (PASSED/FAILED) in Vansah.
- **Screenshots** are attached as evidence in case of failure.
- **Assertions** ensure that expected elements are visible and correct.


## Dependencies

- [Playwright](https://playwright.dev/) (`@playwright/test`)
- [Axios](https://axios-http.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)

## Contributing

Feel free to open issues or submit pull requests to enhance this integration.

## Developed By

[Vansah](https://vansah.com/)

