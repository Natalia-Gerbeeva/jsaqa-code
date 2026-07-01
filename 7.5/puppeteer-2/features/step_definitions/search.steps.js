const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const {
  Given,
  When,
  Then,
  Before,
  After,
  setDefaultTimeout,
} = require("cucumber");

setDefaultTimeout(300000);

Before(async function () {
  this.browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--start-maximized"],
  });

  this.page = await this.browser.newPage();
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user opens cinema page", async function () {
  await this.page.goto("https://qamid.tmweb.ru/client/index.php", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await this.page.waitForTimeout(3000);
});

When("user selects available session", async function () {
  await this.page.waitForSelector(".movie-seances__time", {
    timeout: 60000,
  });

  const sessions = await this.page.$$(".movie-seances__time");

  if (sessions.length === 0) {
    throw new Error("Сеансы не найдены");
  }

  for (const session of sessions.reverse()) {
    const className = await this.page.evaluate(
      (element) => element.className,
      session
    );

    if (!className.includes("acceptin-button-disabled")) {
      await session.click();
      await this.page.waitForTimeout(5000);
      return;
    }
  }

  throw new Error("Нет доступных сеансов");
});

When("user selects {int} seat(s)", async function (count) {
  await this.page.waitForSelector(".buying-scheme__chair", {
    timeout: 60000,
  });

  for (let i = 0; i < count; i++) {
    const seats = await this.page.$$(".buying-scheme__chair");

    let selected = false;

    for (const seat of seats) {
      const className = await this.page.evaluate(
        (element) => element.className,
        seat
      );

      if (
        !className.includes("buying-scheme__chair_taken") &&
        !className.includes("buying-scheme__chair_selected")
      ) {
        await seat.click();
        await this.page.waitForTimeout(1000);
        selected = true;
        break;
      }
    }

    if (!selected) {
      throw new Error("Нет свободных мест");
    }
  }
});

When("user clicks booking button", async function () {
  await this.page.waitForSelector(".acceptin-button", {
    timeout: 60000,
  });

  await this.page.click(".acceptin-button");
});

Then("booking confirmation is displayed", async function () {
  await this.page.waitForSelector(".ticket__check-title", {
    timeout: 60000,
  });

  const text = await this.page.$eval(
    ".ticket__check-title",
    (element) => element.textContent
  );

  expect(text).to.contain("Вы выбрали билеты");
});

Then("booking button should be disabled", async function () {
  await this.page.waitForSelector(".acceptin-button", {
    timeout: 60000,
  });

  const isDisabled = await this.page.$eval(
    ".acceptin-button",
    (button) => button.disabled
  );

  expect(isDisabled).to.equal(true);
});