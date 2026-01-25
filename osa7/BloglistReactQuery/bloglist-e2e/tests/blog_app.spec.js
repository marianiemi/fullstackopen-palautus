const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Maria Niemi",
        username: "mniemi",
        password: "salainen",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("login form is shown by default", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Log in to application" })
    ).toBeVisible();

    await expect(page.getByLabel("username")).toBeVisible();
    await expect(page.getByLabel("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    test("login succeeds with correct credentials", async ({ page }) => {
      await page.getByLabel("username").fill("mniemi");
      await page.getByLabel("password").fill("salainen");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Maria Niemi logged in")).toBeVisible();
    });

    test("login fails with wrong credentials", async ({ page }) => {
      await page.getByLabel("username").fill("mniemi");
      await page.getByLabel("password").fill("väärä");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("wrong username/password")).toBeVisible();
      await expect(page.getByText("Maria Niemi logged in")).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel("username").fill("mniemi");
      await page.getByLabel("password").fill("salainen");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Maria Niemi logged in")).toBeVisible();
    });

    test("logged in user can create a new blog", async ({ page }) => {
      await page.getByRole("button", { name: "create new blog" }).click();

      await page.getByLabel("title").fill("Playwright blog");
      await page.getByLabel("author").fill("Tester");
      await page.getByLabel("url").fill("https://example.com");

      await page.getByRole("button", { name: "create" }).click();

      // Etsi blogi .blog-korttien joukosta tekstin perusteella (ei strict-mode ongelmaa)
      const createdBlog = page.locator(".blog").filter({
        hasText: "Playwright blog Tester",
      });

      await expect(createdBlog.first()).toBeVisible();
    });

    describe("and a blog exists", () => {
      beforeEach(async ({ page }) => {
        await page.getByRole("button", { name: "create new blog" }).click();

        await page.getByLabel("title").fill("Likeable blog");
        await page.getByLabel("author").fill("Tester");
        await page.getByLabel("url").fill("https://example.com");

        await page.getByRole("button", { name: "create" }).click();

        const likeableBlog = page.locator(".blog").filter({
          hasText: "Likeable blog Tester",
        });

        await expect(likeableBlog.first()).toBeVisible();
      });

      test("a blog can be liked and likes increase", async ({ page }) => {
        const blogCard = page
          .locator(".blog")
          .filter({
            hasText: "Likeable blog Tester",
          })
          .first();

        // Avaa detailit (varmistetaan oikea nappi kortin sisältä)
        await blogCard.getByRole("button", { name: "view" }).click();

        // Likes-rivi kortin sisältä
        const likesLine = blogCard.getByText(/likes/i);
        await expect(likesLine).toBeVisible();

        // Nykyinen likes-luku
        const beforeText = await likesLine.textContent();
        const beforeLikes = Number((beforeText.match(/\d+/) || ["0"])[0]);

        // Klikkaa like
        await blogCard.getByRole("button", { name: "like" }).click();

        // Varmista että likes kasvaa
        await expect(
          blogCard.getByText(new RegExp(`likes\\s+${beforeLikes + 1}`))
        ).toBeVisible();
      });
    });
  });
});
