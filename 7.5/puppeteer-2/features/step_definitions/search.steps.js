const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After, setDefaultTimeout } = require("cucumber");

setDefaultTimeout(60000);

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

Given("user is on {string} page", async function (string) {
  await this.page.goto(`https://netology.ru${string}`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await new Promise((resolve) => setTimeout(resolve, 5000));
});

When("user search by {string}", async function (string) {
  await this.page.waitForSelector("input", {
    timeout: 60000,
  });

  await this.page.type("input", string);

  await this.page.keyboard.press("Enter");

  await new Promise((resolve) => setTimeout(resolve, 10000));
});

Then("user sees the course suggested {string}", async function (string) {
  const pageText = await this.page.evaluate(() => document.body.innerText);

  expect(pageText).to.contain("Тестировщик");
});
