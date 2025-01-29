import dotenv from "dotenv";
import VansahNode from "./VansahNode"; // Adjust the path based on your project structure

// Load environment variables from a .env file into process.env
dotenv.config();

// Create an instance of VansahNode
const vansahnode = new VansahNode();

// Retrieve the Vansah authentication token from environment variables
const token: string | undefined = process.env["VANSAH_TOKEN"];

// Obtain your [API token](https://help.vansah.com/en/articles/9824979-generate-a-vansah-api-token-from-jira) from your Jira workspace.
// Validate if the token is set; throw an error if missing
if (!token) {
  throw new Error("VANSAH_TOKEN is not set. Please configure it in your environment or .env file.");
}

// Configure VansahNode instance with required parameters

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

// Export the configured instance for use in other modules
export default vansahnode;
