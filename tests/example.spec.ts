import { test, expect } from "@playwright/test";
import vansahnode from "../vansah-binding/vansahTestInit";
let i =0;
let TEST_CASE = "TF-C72"; // Replace with your test case key
test.describe("Example Playwright Test with Vansah Integration", () => {
  test.beforeAll(async () => {
    // Create a test run before executing tests
    await vansahnode.addTestRunFromJiraIssue(TEST_CASE);
  });

  test("Verify homepage title", async ({ page }) => {
    try {
      // Navigate to the page
      await page.goto("https://playwright.dev/");

      // Expect a title "to contain" a substring.
      await expect(page).toHaveTitle(/Playwright/);

      // Log the test result as passed
      await vansahnode.addTestLog(
        "PASSED",
        "Homepage title is correct",
        1, // Test step row number
        "sample\\images\\passed.png" // Provide your screenshot path
      );
    } catch (error) {
      // Log the test result as failed
      await vansahnode.addTestLog(
        "FAILED",
        `Homepage title verification failed: ${error.message}`,
        1, // Test step row number
        "sample\images\\failed.png" // Provide your screenshot path
      );
      throw error; // Re-throw the error to ensure test failure
    }
  });

  test("Check link navigation", async ({ page }) => {
    try {
      // Navigate to the page
      await page.goto("https://playwright.dev/");

      // Click the get started link.
      await page.getByRole("link", { name: "Get started" }).click();

      // Expects page to have a heading with the name of Installation.
      await expect(
        page.getByRole("heading", { name: "Installation" })
      ).toBeVisible();

      // Log the test result as passed
      await vansahnode.addTestLog(
        "PASSED",
        "Link navigation is correct",
        2, // Test step row number
        "sample\\images\\passed.png" // Provide your screenshot path
      );
    } catch (error) {
      // Log the test result as failed
      await vansahnode.addTestLog(
        "FAILED",
        `Link navigation failed: ${error.message}`,
        2, // Test step row number,
        "sample\\images\\failed.png" // Provide your screenshot path
      );
      throw error; // Re-throw the error to ensure test failure
    }
  });
});
