const Joi = require("joi");
const { createMssqlRequest } = require("../utility/sqlHelper");
const sql = require("mssql");
const debug = require("debug")("post-model");

class Post {
  static async create(createPost) {
    const { title, src, type, tags, userId } = createPost;
    const request = await createMssqlRequest();
    const result = await request
      .input("Title", sql.NVarChar(50), title)
      .input("Src", sql.NVarChar(sql.MAX), src)
      .input("Type", sql.NVarChar(sql.MAX), type)
      .input("Tags", sql.NVarChar(50), tags)
      .input("UserId", sql.NVarChar(50), userId)
      .execute("[dbo].[spCreatePostByUserId]");
    debug("Post", result);
    return result.recordset[0];
  }

  static async update(postId, updatePost) {
    const { title, tags } = updatePost;
    const request = await createMssqlRequest();
    const result = await request
      .input("Title", sql.NVarChar(50), title)
      .input("Tags", sql.NVarChar(50), tags)
      .input("PostId", sql.NVarChar(50), postId)
      .execute("[dbo].[spUpdatePostByPostId]");
    debug("Update", result);
    return result.recordset[0];
  }

  static async delete(postId) {
    const request = await createMssqlRequest();
    const result = await request
      .input("PostId", sql.NVarChar(50), postId)
      .execute("[dbo].[spDeletePostByPostId]");
    debug("Delete", result);
    if (result.rowsAffected[0] !== 1) {
      return false;
    }
    return true;
  }

  static async getPostsByOffsetOrderByNumVote(offset) {
    const request = await createMssqlRequest();
    const result = await request
      .input("Offset", sql.NVarChar(50), offset)
      .execute("[dbo].[spGetPostsByOffsetOrderByNumVote]");
    debug("Get By Offset", result);
    return result.recordset;
  }

  static async upVote(postId) {
    const request = await createMssqlRequest();
    const result = await request
      .input("PostId", sql.NVarChar(50), postId)
      .execute("[dbo].[spUpVotePostByPostId]");
    debug("UpVote", result);
    if (result.rowsAffected[0] !== 1) {
      return false;
    }
    return true;
  }

  static async downVote(postId) {
    const request = await createMssqlRequest();
    const result = await request
      .input("PostId", sql.NVarChar(50), postId)
      .execute("[dbo].[spDownVotePostByPostId]");
    debug("DownVote", result);
    if (result.rowsAffected[0] !== 1) {
      return false;
    }
    return true;
  }
}

const validatePost = (post) => {
  const schema = Joi.object({
    userId: Joi.string(),
    type: Joi.string().required(),
    title: Joi.string().min(1).required(),
    tags: Joi.any(),
    src: Joi.any(),
    postId: Joi.string(),
  });
  return schema.validate(post);
};

module.exports.validate = validatePost;
module.exports.Post = Post;
