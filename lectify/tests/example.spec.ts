import { test, expect } from '@playwright/test';

test('has correct app bar', async ({ page }) => {
  await page.goto('http://localhost:4173');

  await expect(page.getByTestId('app-bar')).toBeVisible();
  await expect(page.getByText('Lectify')).toHaveRole('button');
  await expect(page.getByText('History')).toHaveRole('button');
});

test('has correct headings', async ({ page }) => {
  await page.goto('http://localhost:4173');

  await expect(page.getByText('Convert lecture to summary')).toHaveRole('heading');
  await expect(page.getByText('Transcription Quality')).toBeVisible();
  await expect(page.getByText('Summary Type')).toBeVisible();
});

test('has correct form fields', async ({ page }) => {
  await page.goto('http://localhost:4173');

  await expect(page.getByTestId('file-dropzone')).toBeVisible();
  await expect(page.getByTestId('radio-group')).toHaveCount(2);
  await expect(page.getByText('Convert', {exact: true})).toHaveRole('button');
});