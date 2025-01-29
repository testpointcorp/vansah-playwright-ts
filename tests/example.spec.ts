import { test, expect } from "@playwright/test";
import vansahnode from "../vansah-binding/vansahTestInit";

let TEST_CASE = "TF-C72"; // Replace with your test case key

test.describe("Example Playwright Test with Vansah Integration", () => {
  
  test.beforeAll(async () => {
    // Create a test run before executing tests
    await vansahnode.addTestRunFromJiraIssue(TEST_CASE);
  });

  test("Verify homepage title", async ({ page }) => {
    try {
      // Navigate to the Playwright homepage
      await page.goto("https://playwright.dev/");

      // Verify the page title contains 'Playwright'
      await expect(page).toHaveTitle(/Playwright/);

      // Log success in Vansah
      await vansahnode.addTestLog(
        "PASSED",
        "Homepage title is correct",
        1, // Test step row number
        "sample/images/passed.png" // Screenshot path
      );
    } catch (error) {
      // Log failure in Vansah
      await vansahnode.addTestLog(
        "FAILED",
        `Homepage title verification failed: ${error.message}`,
        1,
        "sample/images/failed.png"
      );
      throw error; // Ensure test failure is reflected
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
