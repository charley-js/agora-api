const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app/app");
const request = require("supertest");
const sorted = require("jest-sorted");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  console.log("Seeding Test Database...");
  return seed(testData);
});

describe("GET /api/topics", () => {
  test("GET:200 - Responds with an array of all the topic objects, with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(3);
        body.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("GET:404 - Responds with an error message of Invalid endpoint if the endpoint is incorrect", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid endpoint");
      });
  });
});

describe("GET /api", () => {
  test("GET:200 - Responds with an object describing all possible endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body).length).toBeGreaterThan(0);
        Object.values(body).forEach((endpoint) => {
          expect(endpoint).toMatchObject({
            description: expect.any(String),
            queries: expect.any(Array),
            exampleResponse: expect.any(Object),
          });
        });
      });
  });
  test("GET:404 - Responds with an error message of Invalid endpoint if the endpoint is incorrect", () => {
    return request(app)
      .get("/apj")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid endpoint");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET:200 - Responds with an article relevant to the ID ,specified as a parameter", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBeGreaterThan(0);
        expect(body).toBeSortedBy("date", { descending: true });
        expect(body).toMatchObject([
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        ]);
      });
  });
  test("GET:404 - Responds with an error message of author id invalid if the author Id does not exist", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Author id not found");
      });
  });
  test("GET:400 - Responds with an error message of Incorrect id type if the author Id parameter contains characters other than numbers", () => {
    return request(app)
      .get("/api/articles/number1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Incorrect id type");
      });
  });
});

describe("GET /api/articles", () => {
  test("GET:200 - Responds with an array of all articles with the correct properties, sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        expect(body).toBeSortedBy("created_at", { descending: true });
        body.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET:404 - Responds with an error message of Invalid endpoint if the endpoint is incorrect", () => {
    return request(app)
      .get("/api/article")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid endpoint");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET:200 - Responds with an array of comments for a specific article, with the correct properties", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(2);
        expect(body).toBeSortedBy("created_at", { descending: true });
        expect(body).toMatchObject([
          {
            comment_id: 15,
            votes: 1,
            created_at: expect.any(String),
            author: "butter_bridge",
            body: "I am 100% sure that we're not completely sure.",
            article_id: 5,
          },
          {
            comment_id: 14,
            votes: 16,
            created_at: expect.any(String),
            author: "icellusedkars",
            body: "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
            article_id: 5,
          },
        ]);
      });
  });
  test("GET:200 - Responds with an empty array if article id is valid but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body).toEqual([]);
      });
  });
  test("GET:404 - Responds with an error message of Author id not found if the author id does not exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Author id not found");
      });
  });
  test("GET:400 - Responds with an error message of Incorrect id type if the author id parameter contains characters other than numbers", () => {
    return request(app)
      .get("/api/articles/number5/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Incorrect id type");
      });
  });
});
