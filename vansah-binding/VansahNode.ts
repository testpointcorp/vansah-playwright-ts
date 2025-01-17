import axios from "axios";

class VansahNode {
  private static API_VERSION: string = "v1";
  private static VANSAH_URL: string = "https://prod.vansahnode.app";
  private VANSAH_TOKEN: string = "Your Token Here";
  private headers: { [key: string]: string };
  private TEST_RUN_IDENTIFIER?: string;
  private TEST_LOG_IDENTIFIER?: string;
  private SPRINT_NAME?: string;
  private ENVIRONMENT_NAME?: string;
  private RELEASE_NAME?: string;
  private JIRA_ISSUE_KEY?: string;
  private TESTFOLDERS_ID?: string;
  private CASE_KEY?: string;

  setVansahUrl(vansahUrl: string): void {
    VansahNode.VANSAH_URL = vansahUrl;
  }

  setVansahToken(vansahToken: string): void {
    this.VANSAH_TOKEN = vansahToken;
  }

  setSprintName(sprintName: string): void {
    this.SPRINT_NAME = sprintName;
  }

  setEnvironmentName(environmentName: string): void {
    this.ENVIRONMENT_NAME = environmentName;
  }

  setReleaseName(releaseName: string): void {
    this.RELEASE_NAME = releaseName;
  }

  setJiraIssueKey(jiraIssueKey: string): void {
    this.JIRA_ISSUE_KEY = jiraIssueKey;
  }

  setTestFoldersId(testFoldersId: string): void {
    this.TESTFOLDERS_ID = testFoldersId;
  }

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
            file: imageResult
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

  private resultToId(result: string): number {
    const resultMapping: { [key: string]: number } = {
      NA: 0,
      FAILED: 1,
      PASSED: 2,
      UNTESTED: 3,
    };
    return resultMapping[result.toUpperCase()] || 0;
  }

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
