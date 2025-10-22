import { test, expect } from '@playwright/test';

// This is a placeholder for a full E2E test.
// A real test would require mocking Clerk authentication, which is complex.
// This demonstrates the structure and key assertions.

test.describe('Core User Flow', () => {
  test('should allow a user to create and analyze a quote request', async ({ page }) => {
    // This test assumes the user is already logged in.
    // In a real scenario, you would programmatically log in via the UI or by setting auth state.
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // 1. Navigate to the new quote request page
    await page.getByRole('button', { name: 'New Quote' }).click();
    await expect(page.getByRole('heading', { name: 'New AI Quote Request' })).toBeVisible();

    // 2. Fill out the form
    await page.getByLabel('Street').fill('123 Main St');
    await page.getByLabel('City').fill('Anytown');
    await page.getByLabel('State').fill('CA');
    await page.getByLabel('ZIP Code').fill('12345');

    // 3. Upload a file (mocking the file chooser)
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('Click to upload').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'tree.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('test'),
    });

    // Wait for the upload to "complete" (in a real test, you'd mock the S3 upload response)
    await expect(page.getByText('tree.jpg')).toBeVisible();

    // 4. Submit for analysis
    await page.getByRole('button', { name: 'Analyze & Get Quote' }).click();

    // 5. Land on the task polling page
    await expect(page.getByRole('heading', { name: 'Analyzing Your Trees...' })).toBeVisible();

    // 6. Be redirected to the quote details page (mocking the redirect)
    // In a real test, you would wait for the polling to complete and the navigation to happen.
    // For this placeholder, we'll navigate directly.
    await page.goto('/quotes/mock-quote-id-123'); // Use a mock ID
    await expect(page.getByRole('heading', { name: /Quote #/ })).toBeVisible();
    await expect(page.getByText('AI Analysis & Findings')).toBeVisible();
    await expect(page.getByText(/Total: \$/)).toBeVisible();
  });
});