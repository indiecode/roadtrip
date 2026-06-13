import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // 1. Block tile images to neutralize async tile loading
  await page.route('**/*.{png,jpg,jpeg,webp}', async (route, request) => {
    const url = request.url()
    if (url.includes('tile')) {
      await route.abort()
    } else {
      await route.continue()
    }
  })

  // 2. Inject CSS to color the tile area
  await page.addStyleTag({
    content: '.leaflet-tile-pane { background: #ddeeff !important; }',
  })
})

const screenshots = [
  { name: 'map-tab', tab: 'Map' },
  { name: 'plan-tab', tab: 'Plan' },
  { name: 'journey-tab', tab: 'Journey' },
]

for (const { name, tab } of screenshots) {
  test(`matches ${name} snapshot`, async ({ page }) => {
    await page.goto('/')
    await page.getByRole('tab', { name: new RegExp(`^${tab}$`) }).click()

    // Wait for tab content
    if (name === 'map-tab') {
      await page.waitForSelector('.leaflet-container svg', { timeout: 10000 })
    } else if (name === 'plan-tab') {
      await page.waitForSelector('[data-testid="day-card"]', { timeout: 10000 })
    } else if (name === 'journey-tab') {
      await page.waitForSelector('[data-testid="journey-active-day"]', { timeout: 10000 })
    }

    // Wait for network idle before screenshot
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot(`visual-${name}.png`, {
      maxDiffPixelRatio: 0.01,
    })
  })
}
