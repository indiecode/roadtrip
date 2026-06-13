import { test, expect } from '@playwright/test'

test('loads the homepage', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('🚗 Boston → The West → Boston')
  await expect(page.getByRole('main')).toBeVisible()
})

test('switches between Map, Plan, Journey tabs', async ({ page }) => {
  await page.goto('/')

  // Verify Plan tab is active by default
  await expect(page.getByTestId('view-plan')).toBeVisible()
  await expect(page.getByTestId('tab-plan')).toHaveAttribute('aria-selected', 'true')

  // Switch to Map
  await page.getByRole('tab', { name: /Map/i }).click()
  await expect(page.getByTestId('view-map')).toBeVisible()
  await expect(page.getByTestId('tab-plan')).toHaveAttribute('aria-selected', 'false')
  await expect(page.getByTestId('tab-map')).toHaveAttribute('aria-selected', 'true')

  // Switch to Journey
  await page.getByRole('tab', { name: /Journey/i }).click()
  await expect(page.getByTestId('view-journey')).toBeVisible()
  await expect(page.getByTestId('tab-map')).toHaveAttribute('aria-selected', 'false')
  await expect(page.getByTestId('tab-journey')).toHaveAttribute('aria-selected', 'true')

  // Switch back to Plan
  await page.getByRole('tab', { name: /Plan/i }).click()
  await expect(page.getByTestId('view-plan')).toBeVisible()
  await expect(page.getByTestId('tab-journey')).toHaveAttribute('aria-selected', 'false')
  await expect(page.getByTestId('tab-plan')).toHaveAttribute('aria-selected', 'true')
})

test('Map tab renders markers', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('tab', { name: /Map/i }).click()

  // Wait for map to render then verify some markers are visible
  await page.waitForSelector('.leaflet-container', { timeout: 10000 })
  // Leaflet CircleMarker renders as SVG within the map
  const markers = page.locator('.leaflet-container svg')
  await markers.first().waitFor({ timeout: 10000 })
  const markerCount = await markers.count()
  expect(markerCount).toBeGreaterThan(0)
})

test('Plan tab renders day cards', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('tab', { name: /Plan/i }).click()

  // PlanView shows one stage at a time
  const dayCardCount = await page.locator('[data-testid="day-card"]').count()
  expect(dayCardCount).toBeGreaterThan(0)
})

test('Journey slider advances and highlights the active day', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('tab', { name: /Journey/i }).click()

  // Get initial active day label
  const initialLabel = await page.getByTestId('journey-active-day').textContent()
  expect(initialLabel).toContain('Day 1')

  // Press ArrowRight 3 times to advance to day 4
  const slider = page.getByTestId('journey-slider')
  await slider.press('ArrowRight')
  await slider.press('ArrowRight')
  await slider.press('ArrowRight')

  // Check that the active day is now Day 4
  const newLabel = await page.getByTestId('journey-active-day').textContent()
  expect(newLabel).toContain('Day 4')
})
