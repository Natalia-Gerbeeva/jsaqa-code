const { clickElement, getText } = require("./lib/commands");

jest.setTimeout(300000);

let page;

const URL = "https://qamid.tmweb.ru/client/index.php";
const bookingButton = ".acceptin-button";

beforeEach(async () => {
  page = await browser.newPage();

  await page.goto(URL, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForTimeout(3000);
});

afterEach(async () => {
  if (page && !page.isClosed()) {
    await page.close();
  }
});

const openAvailableSession = async () => {
  await page.waitForSelector(".movie-seances__time", {
    timeout: 60000,
  });

  const sessions = await page.$$(".movie-seances__time");

  if (sessions.length === 0) {
    throw new Error("Сеансы не найдены");
  }

  await sessions[sessions.length - 1].click();

  await page.waitForTimeout(3000);
};

const selectSeat = async () => {
  await page.waitForSelector(".buying-scheme__chair", {
    timeout: 60000,
  });

  const seats = await page.$$(".buying-scheme__chair");

  for (const seat of seats) {
    const className = await page.evaluate(
      (element) => element.className,
      seat
    );

    if (
      !className.includes("buying-scheme__chair_taken") &&
      !className.includes("buying-scheme__chair_selected")
    ) {
      await seat.click();
      await page.waitForTimeout(1000);
      return;
    }
  }

  throw new Error("Нет свободных мест");
};

describe("Ticket booking tests", () => {
  test("Should book one ticket", async () => {
    await openAvailableSession();

    await selectSeat();

    await clickElement(page, bookingButton);

    const actual = await getText(page, ".ticket__check-title");

    expect(actual).toContain("Вы выбрали билеты");
  });

  test("Should book two tickets", async () => {
    await openAvailableSession();

    await selectSeat();
    await selectSeat();

    await clickElement(page, bookingButton);

    const actual = await getText(page, ".ticket__check-title");

    expect(actual).toContain("Вы выбрали билеты");
  });

  test("Should not book ticket without selected seat", async () => {
    await openAvailableSession();

    const isDisabled = await page.$eval(
      bookingButton,
      (button) => button.disabled
    );

    expect(isDisabled).toBe(true);
  });
});
