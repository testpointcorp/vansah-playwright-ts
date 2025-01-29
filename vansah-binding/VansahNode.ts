import axios from "axios";

/**
 * VansahNode class for integrating Playwright tests with Vansah Test Management.
 * Provides methods to create test runs, log test results, and interact with Vansah's API.
 */

class VansahNode {
  /**
   * API version used for Vansah API calls
   */
  private static API_VERSION: string = "v1";

  /**
   * Base URL for Vansah API
   */
  private static VANSAH_URL: string = "https://prod.vansahnode.app";

  /**
   * Authentication token for Vansah API requests
   */
  private VANSAH_TOKEN: string = "Your Token Here";

  /**
   * Headers used in API requests
   */
  private headers: { [key: string]: string };

  /**
   * Identifier for the current test run
   */
  private TEST_RUN_IDENTIFIER?: string;

  /**
   * Identifier for the current test log
   */
  private TEST_LOG_IDENTIFIER?: string;

  /**
   * Name of the sprint associated with test cases
   */
  private SPRINT_NAME?: string;

  /**
   * Name of the environment associated with test cases
   */
  private ENVIRONMENT_NAME?: string;

  /**
   * Name of the release associated with test cases
   */
  private RELEASE_NAME?: string;

  /**
   * Jira issue key to associate with test cases
   */
  private JIRA_ISSUE_KEY?: string;

  /**
   * Identifier for the test folder
   */
  private TESTFOLDERS_ID?: string;

  /**
   * Key of the test case being executed
   */
  private CASE_KEY?: string;

  /**
   * Sets the Vansah API base URL
   * @param vansahUrl - The URL to be set as the Vansah API base URL
   */
  setVansahUrl(vansahUrl: string): void {
    VansahNode.VANSAH_URL = vansahUrl;
  }

  /**
   * Sets the authentication token for Vansah API
   * @param vansahToken - The token used for authentication
   */
  setVansahToken(vansahToken: string): void {
    this.VANSAH_TOKEN = vansahToken;
  }

  /**
   * Sets the sprint name
   * @param sprintName - The sprint name to be associated with test cases
   */
  setSprintName(sprintName: string): void {
    this.SPRINT_NAME = sprintName;
  }

  /**
   * Sets the environment name
   * @param environmentName - The environment name to be associated with test cases
   */
  setEnvironmentName(environmentName: string): void {
    this.ENVIRONMENT_NAME = environmentName;
  }

  /**
   * Sets the release name
   * @param releaseName - The release name to be associated with test cases
   */
  setReleaseName(releaseName: string): void {
    this.RELEASE_NAME = releaseName;
  }

  /**
   * Sets the Jira issue key
   * @param jiraIssueKey - The Jira issue key to associate test runs with
   */
  setJiraIssueKey(jiraIssueKey: string): void {
    this.JIRA_ISSUE_KEY = jiraIssueKey;
  }

  /**
   * Sets the test folder identifier
   * @param testFoldersId - The identifier of the test folder
   */
  setTestFoldersId(testFoldersId: string): void {
    this.TESTFOLDERS_ID = testFoldersId;
  }

  /**
   * Connects to the Vansah REST API
   * @param endpoint - API endpoint to interact with
   * @param method - HTTP method (GET, POST, PUT, DELETE)
   * @param payload - Optional data payload for the request
   * @returns Response from the API
   */
  async connectToVansahRest(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    payload?: object
  ): Promise<any> {
    const url = `${VansahNode.VANSAH_URL}/api/${VansahNode.API_VERSION}/${endpoint}`;

    const config = {
      method: method,
      url: url,
      headers: (this.headers = {
        Authorization: this.VANSAH_TOKEN,
        "Content-Type": "application/json",
      }),
      data: payload,
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error: any) {
      if (error.errno == -3008) {
        console.log(
          `ERROR Code: ${error.errno} Provide correct Vansah URL : ${error.hostname}`
        );
      }
      if (error.code === "ERR_BAD_REQUEST") {
        console.error(
          "Error connecting to Vansah API:",
          error.response.data.message
        );
      }
    }
  }

  /**
   * Adds a test run linked to a Jira issue.
   * @param testCase - The test case key to be included in the test run.
   * Associates the test run with a Jira issue key stored in JIRA_ISSUE_KEY.
   * Stores the generated test run identifier for future reference.
   */
  async addTestRunFromJiraIssue(testCase: string): Promise<void> {
    this.CASE_KEY = testCase;
    const payload = {
      case: { key: this.CASE_KEY },
      asset: { type: "issue", key: this.JIRA_ISSUE_KEY },
      properties: this.getProperties(),
    };

    const response = await this.connectToVansahRest("run", "POST", payload);
    if (response?.data?.run?.identifier) {
      this.TEST_RUN_IDENTIFIER = response.data.run.identifier;
      console.log("Test Run Identifier:", this.TEST_RUN_IDENTIFIER);
    }
  }

  /**
   * Adds a test run linked to a test folder.
   * @param testCase - The test case key to be included in the test run.
   * Associates the test run with a test folder identifier stored in TESTFOLDERS_ID.
   * Stores the generated test run identifier for future reference.
   */
  async addTestRunFromTestFolder(testCase: string): Promise<void> {
    this.CASE_KEY = testCase;
    const payload = {
      case: { key: this.CASE_KEY },
      asset: { type: "folder", identifier: this.TESTFOLDERS_ID },
      properties: this.getProperties(),
    };

    const response = await this.connectToVansahRest("run", "POST", payload);
    if (response?.data?.run?.identifier) {
      this.TEST_RUN_IDENTIFIER = response.data.run.identifier;
      console.log("Test Run Identifier:", this.TEST_RUN_IDENTIFIER);
    }
  }

  /**
   * Adds a quick test execution linked to a Jira issue.
   * @param testCase - The test case key to be included in the test run.
   * @param result - The result of the test case execution (PASSED, FAILED, etc.).
   * Associates the test run with a Jira issue key stored in JIRA_ISSUE_KEY.
   * Stores the generated test run identifier for future reference.
   */
  async addQuickTestFromJiraIssue(
    testCase: string,
    result: string
  ): Promise<void> {
    this.CASE_KEY = testCase;
    const payload = {
      case: { key: this.CASE_KEY },
      asset: { type: "issue", key: this.JIRA_ISSUE_KEY },
      properties: this.getProperties(),
      result: { id: this.resultToId(result) },
    };

    const response = await this.connectToVansahRest("run", "POST", payload);
    if (response?.data?.run?.identifier) {
      this.TEST_RUN_IDENTIFIER = response.data.run.identifier;
      console.log("Quick Test Run Identifier:", this.TEST_RUN_IDENTIFIER);
    }
  }

  /**
   * Adds a quick test execution linked to a test folder.
   * @param testCase - The test case key to be included in the test run.
   * @param result - The result of the test case execution (PASSED, FAILED, etc.).
   * Associates the test run with a test folder identifier stored in TESTFOLDERS_ID.
   * Stores the generated test run identifier for future reference.
   */
  async addQuickTestFromTestFolder(
    testCase: string,
    result: string
  ): Promise<void> {
    this.CASE_KEY = testCase;
    const payload = {
      case: { key: this.CASE_KEY },
      asset: { type: "folder", identifier: this.TESTFOLDERS_ID },
      properties: this.getProperties(),
      result: { id: this.resultToId(result) },
    };

    const response = await this.connectToVansahRest("run", "POST", payload);
    if (response?.data?.run?.identifier) {
      this.TEST_RUN_IDENTIFIER = response.data.run.identifier;
      console.log("Quick Test Run Identifier:", this.TEST_RUN_IDENTIFIER);
    }
  }

  /**
   * Adds a test log to an existing test run.
   * @param result - The test result (PASSED, FAILED, etc.).
   * @param comment - A textual description of the test result.
   * @param testStepRow - The step number in the test case.
   * @param imagePath - (Optional) Path to an image file to attach as evidence.
   * Ensures that a test run identifier is available before proceeding.
   * Converts an image file to base64 format for attachment, if provided.
   * Stores the generated test log identifier for future reference.
   */
  async addTestLog(
    result: string,
    comment: string,
    testStepRow: number,
    imagePath?: string
  ): Promise<void> {
    if (!this.TEST_RUN_IDENTIFIER) {
      console.error("TEST_RUN_IDENTIFIER is not set. Create a test run first.");
    }

    const payload: any = {
      run: { identifier: this.TEST_RUN_IDENTIFIER },
      step: { number: testStepRow },
      result: { id: this.resultToId(result) },
      actualResult: comment,
    };

    if (imagePath) {
      let imageResult = "";
      const fs = await import("fs/promises");
      try {
        const fileData = await fs.readFile(imagePath);
        imageResult = fileData.toString("base64");
        payload.attachments = [
          {
            name: "screenshot",
            extension: "png",
            file: imageResult,
          },
        ];
      } catch (error: any) {
        console.error(`Please provide the correct Image Path : ${error}`);
      }
    }

    const response = await this.connectToVansahRest("logs", "POST", payload);
    if (response?.data?.log?.identifier) {
      this.TEST_LOG_IDENTIFIER = response.data.log.identifier;
      console.log("Test Log Identifier:", this.TEST_LOG_IDENTIFIER);
    }
  }

  /**
   * Converts a test result status string into an ID used by Vansah API
   * @param result - The result string (PASSED, FAILED, UNTESTED, NA)
   * @returns Corresponding numeric ID
   */
  private resultToId(result: string): number {
    const resultMapping: { [key: string]: number } = {
      NA: 0,
      FAILED: 1,
      PASSED: 2,
      UNTESTED: 3,
    };
    return resultMapping[result.toUpperCase()] || 0;
  }

  /**
   * Retrieves properties such as sprint, release, and environment names
   * @returns Object containing properties
   */
  private getProperties(): object {
    const properties: any = {};
    if (this.SPRINT_NAME) {
      properties.sprint = { name: this.SPRINT_NAME };
    }
    if (this.RELEASE_NAME) {
      properties.release = { name: this.RELEASE_NAME };
    }
    if (this.ENVIRONMENT_NAME) {
      properties.environment = { name: this.ENVIRONMENT_NAME };
    }
    return properties;
  }
}

export default VansahNode;
