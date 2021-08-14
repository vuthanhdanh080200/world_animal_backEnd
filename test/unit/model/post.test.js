const { validate } = require("../../../model/post");

describe("validatePost", () => {
  let post;
  beforeEach(() => {
    post = {
      postId: "123",
      title: "this is a title",
      numVote: 0,
      tags: "this is a tags",
      userId: "321",
      image: "this is a image",
    };
  });
  test("should return err if title is incorrect", () => {
    post.title = "";
    const { value, error } = validate(post);
    expect(error).toBeDefined();
  });

  test("should return value if post is correct", () => {
    const { value } = validate(post);
    expect(value).toMatchObject(post);
  });
});
