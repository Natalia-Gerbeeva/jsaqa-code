jest.setTimeout(60000);

let page;

beforeEach(async () => {
  page = await browser.newPage();

  await page.goto("https://github.com/team", {
    waitUntil: "networkidle2",
  });
});

afterEach(async () => {
  await page.close();
});

describe("Github page tests", () => {
  test(
    "The h1 header content",
    async () => {
      const title = await page.title();

      expect(title).toContain("GitHub");
    },
    60000
  );

  test(
    "The first link attribute",
    async () => {
      const actual = await page.$eval(
        "a",
        (link) => link.getAttribute("href")
      );

      expect(actual).toBeTruthy();
    },
    60000
  );

  test(
    "The page contains Sign in button",
    async () => {
      const bodyText = await page.$eval(
        "body",
        (el) => el.textContent
      );

      expect(bodyText).toContain("GitHub");
    },
    60000
  );
});
