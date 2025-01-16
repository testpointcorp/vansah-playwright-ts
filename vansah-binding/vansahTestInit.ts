import dotenv from "dotenv";
import VansahNode from "./VansahNode"; // Adjust the path based on your project structure

// Load environment variables
dotenv.config();

const vansahnode = new VansahNode();
const token: string | undefined = process.env["VANSAH_TOKEN"];

// Validate token
if (!token) {
  throw new Error("VANSAH_TOKEN is not set. Please configure it in your environment or .env file.");
}

// Configure VansahNode
vansahnode.setVansahUrl("https://vtrunk.vansahnode.app"); // Replace with your Vansah URL
vansahnode.setVansahToken(token);
vansahnode.setSprintName("TF Sprint 1");
vansahnode.setEnvironmentName("UAT");
vansahnode.setReleaseName("TestingTRUNK");
vansahnode.setJiraIssueKey("TF-4");

// Export the configured instance
export default vansahnode;
