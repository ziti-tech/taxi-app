import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const widths = [320, 375, 430, 768, 1024, 1440, 1920];
const brand = "namma oneway drop taxi";
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

function futureDate(days = 3) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(Date.now() + days * 86_400_000));
}
function tripQuery(extra: Record<string, string> = {}) {
  return new URLSearchParams({ tripType: "one-way", pickup: "Villupuram", drop: "Chennai", date: futureDate(), time: "08:30", passengers: "2", ...extra }).toString();
}
async function openRides(page: Page, extra: Record<string, string> = {}) {
  await page.goto(`/?${tripQuery(extra)}#book`);
  const widget = page.locator("#book");
  await expect(widget.getByLabel("Drop location", { exact: true })).toHaveValue(extra.drop ?? "Chennai");
  await widget.getByRole("button", { name: "Check fare", exact: true }).click();
  await expect(page.locator("#booking-details").getByRole("heading", { name: "Choose your ride", exact: true })).toBeVisible();
}
async function noAxeViolations(page: Page) {
  const result = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))).toEqual([]);
}

test.describe("homepage responsiveness", () => {
  for (const width of widths) {
    test(`homepage fits ${width}px and exposes usable navigation`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto("/");
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(new RegExp(brand));
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const brandBox = await page.locator("header strong").boundingBox();
      const callBox = await page.locator('header a[href^="tel:"]').boundingBox();
      expect(brandBox!.x + brandBox!.width).toBeLessThanOrEqual(callBox!.x);
      for (const removed of ["Ways to travel", "Airport transfers", "How it works", "Customer stories", "Helpful answers", "Before you book"]) {
        await expect(page.getByText(removed, { exact: true })).toHaveCount(0);
      }
      if (width < 1280) await expect(page.getByRole("button", { name: "Open menu", exact: true })).toBeVisible();
      else await expect(page.getByRole("navigation", { name: "Primary navigation", exact: true })).toBeVisible();
    });
  }
});

test("mobile navigation traps focus, closes on Escape/resize and preserves the current trip", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto(`/?${tripQuery()}#book`);
  const trigger = page.getByRole("button", { name: "Open menu", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu", exact: true });
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 10; index++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("navigation", { name: "Mobile navigation", exact: true }).getByRole("link", { name: "Our Fleet", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  expect(new URL(page.url()).searchParams.get("drop")).toBe("Chennai");
  await expect(page.locator("#book").getByLabel("Drop location", { exact: true })).toHaveValue("Chennai");
  await trigger.click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(dialog).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});

test("route/fleet selection and the full enquiry stay in one document without sending a message", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.open = (url?: string | URL) => { (window as Window & { auditHandoff?: string }).auditHandoff = String(url); return null; };
  });
  await page.goto(`/?${tripQuery()}`);
  await page.locator("#routes article").first().getByRole("link", { name: "Check fare", exact: true }).click();
  await page.getByRole("link", { name: "Select Innova Crysta", exact: true }).click();
  const widget = page.locator("#book");
  await expect(widget.getByLabel("Drop location", { exact: true })).toHaveValue("Chennai");
  await widget.getByRole("button", { name: "Check fare", exact: true }).click();
  const flow = page.locator("#booking-details");
  await expect(flow.getByRole("radio", { name: /Innova Crysta/ })).toHaveAttribute("aria-checked", "true");
  await flow.getByRole("button", { name: "Continue to details", exact: true }).click();
  await flow.getByLabel("Full name", { exact: true }).fill("Audit Test Passenger");
  await flow.getByLabel("Mobile number", { exact: true }).fill("9876543210");
  await flow.getByLabel("Pickup note (optional)", { exact: true }).fill("Near the station entrance");
  await flow.getByRole("button", { name: "Review booking", exact: true }).click();
  await noAxeViolations(page);
  await flow.getByRole("button", { name: "Continue to WhatsApp", exact: true }).click();
  await expect(flow.getByRole("heading", { name: "Your WhatsApp enquiry is ready", exact: true })).toBeVisible();
  const href = await flow.getByRole("link", { name: "Open WhatsApp to send enquiry", exact: true }).getAttribute("href");
  const handoff = new URL(href!);
  expect(handoff.origin).toBe("https://wa.me");
  expect(handoff.pathname).toBe("/919884744218");
  expect(handoff.searchParams.get("text")).toContain("Audit Test Passenger");
  expect(handoff.searchParams.get("text")).toContain("Innova Crysta");
  expect(handoff.searchParams.get("text")).toContain("Chennai");
  expect(await page.evaluate(() => (window as Window & { auditHandoff?: string }).auditHandoff)).toBe(href);
  await expect(flow.getByText(/enquiry has not been sent by this website/)).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/");
  expect(await page.evaluate(() => performance.getEntriesByType("navigation").length)).toBe(1);
  expect(errors).toEqual([]);
  await noAxeViolations(page);
});

test("trip edits, capacity checks and draft restoration retain the latest journey", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openRides(page, { vehicle: "sedan" });
  const flow = page.locator("#booking-details");
  await flow.getByRole("button", { name: "Back", exact: true }).click();
  await flow.getByLabel("Drop location", { exact: true }).fill("Madurai");
  await flow.getByLabel("Passengers", { exact: true }).selectOption("7");
  await flow.getByRole("button", { name: "Continue to rides", exact: true }).click();
  await expect(flow.getByRole("radio", { name: /^Sedan/ })).toBeDisabled();
  await expect(flow.getByRole("button", { name: "Continue to details", exact: true })).toBeDisabled();
  await flow.getByRole("radio", { name: "Innova", exact: true }).click();
  await flow.getByRole("button", { name: "Back to trip form", exact: true }).first().click();
  await expect(page.locator("#book").getByLabel("Drop location", { exact: true })).toHaveValue("Madurai");
  await page.evaluate(() => window.history.replaceState(null, "", "/"));
  await page.reload();
  const widget = page.locator("#book");
  await expect(widget.getByLabel("Drop location", { exact: true })).toHaveValue("Madurai");
  await expect(widget.getByLabel("Passengers", { exact: true })).toHaveValue("7");
  await widget.getByRole("button", { name: "Check fare", exact: true }).click();
  await expect(flow.getByRole("radio", { name: "Innova", exact: true })).toHaveAttribute("aria-checked", "true");
});

test("validation and keyboard date/time dialogs work at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 850 });
  await page.goto("/");
  const widget = page.locator("#book");
  await widget.getByRole("button", { name: "Check fare", exact: true }).click();
  await expect(widget.getByText("Enter a pickup location", { exact: true })).toBeVisible();
  await expect(widget.getByLabel("Pickup location", { exact: true })).toHaveAttribute("aria-invalid", "true");
  const dateTrigger = widget.locator('[data-picker-label="Pickup date"]');
  await dateTrigger.click();
  const dateDialog = page.getByRole("dialog", { name: "Choose pickup date", exact: true });
  await expect(dateDialog).toBeVisible();
  expect(await dateDialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await noAxeViolations(page);
  await page.keyboard.press("Escape");
  await expect(dateTrigger).toBeFocused();
  await dateTrigger.click();
  await dateDialog.getByRole("button", { name: "Tomorrow", exact: true }).click();
  const timeTrigger = widget.locator('[data-picker-label="Pickup time"]');
  await timeTrigger.click();
  const timeDialog = page.getByRole("dialog", { name: "Choose pickup time", exact: true });
  await timeDialog.getByRole("button", { name: /^8:00\s*am$/i }).click();
  await expect(timeTrigger).toContainText(/8:00\s*am/i);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("reduced motion avoids downloading autoplay video; video remains an explicit action", async ({ page }) => {
  const videos: string[] = [];
  page.on("request", (request) => { if (request.url().endsWith(".mp4")) videos.push(request.url()); });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: "Play taxi video", exact: true })).toBeVisible();
  expect(videos).toEqual([]);
  await expect(page.locator("h1")).toHaveCSS("opacity", "1");
});

test("homepage and 404 have no automated WCAG AA violations", async ({ page }) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await noAxeViolations(page);
  }
  const response = await page.goto("/a-page-that-does-not-exist");
  expect(response?.status()).toBe(404);
  await noAxeViolations(page);
  await page.getByRole("link", { name: "Book taxi", exact: true }).click();
  await expect(page.locator("#book")).toBeVisible();
});

test("legacy URLs preserve queries and redirect to the relevant homepage section", async ({ request }) => {
  for (const [path, hash] of [["/book?pickup=Villupuram&drop=Trichy", "#book"], ["/tariff", "#fleet"], ["/services", "#book"], ["/services/one-way-taxi", "#book"], ["/routes", "#routes"], ["/routes/villupuram-to-chennai", "#routes"], ["/about", "#home"], ["/contact", "#contact"]]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    const destination = new URL(response.headers().location, "http://127.0.0.1:3100");
    expect(destination.pathname).toBe("/");
    expect(destination.hash).toBe(hash);
    if (path.startsWith("/book")) expect(destination.searchParams.get("drop")).toBe("Trichy");
  }
});

test("metadata, structured data, contact links and security headers are consistent", async ({ page, request }) => {
  const response = await page.goto("/");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.nammaonewaydroptaxi.com/");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  const data = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}");
  expect(data.name).toBe(brand);
  const links = await page.locator("a[href]").evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")!));
  for (const href of links.filter((value) => value.startsWith("tel:"))) expect(href).toBe("tel:9884744218");
  for (const href of links.filter((value) => value.startsWith("https://wa.me"))) expect(new URL(href).pathname).toBe("/919884744218");
  for (const href of links.filter((value) => value.startsWith("#") || value.startsWith("/#"))) expect(await page.locator(new URL(href, page.url()).hash).count()).toBeGreaterThan(0);
  const sitemap = await request.get("/sitemap.xml");
  expect((await sitemap.text()).match(/<loc>/g)).toHaveLength(1);
  expect((await (await request.get("/robots.txt")).text())).toContain("https://www.nammaonewaydroptaxi.com/sitemap.xml");
  const image = await page.locator('meta[property="og:image"]').getAttribute("content");
  const localImage = new URL(image!);
  expect((await request.get(localImage.pathname + localImage.search)).status()).toBe(200);
  expect((await request.get("/icon.svg")).status()).toBe(200);
});
