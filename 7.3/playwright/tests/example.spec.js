const { test, expect } = require('@playwright/test');
const { email, password } = require('../user');

test('successful authorization', async ({ page }) => {
  await page.goto('https://netology.ru/?modal=sign_in');

  await page.waitForTimeout(5000);

  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Пароль').fill(password);
  await page.getByRole('button', { name: 'Войти' }).click();

  await expect(page).toHaveURL(/profile|dashboard|learn/);
});

test('unsuccessful authorization', async ({ page }) => {
  await page.goto('https://netology.ru/?modal=sign_in');

  await page.waitForTimeout(5000);

  await page.getByPlaceholder('Email').fill('wrong@email.com');
  await page.getByPlaceholder('Пароль').fill('wrongpassword');
  await page.getByRole('button', { name: 'Войти' }).click();

  await expect(
    page.getByText('Вы ввели неправильно логин или пароль')
  ).toBeVisible();
});