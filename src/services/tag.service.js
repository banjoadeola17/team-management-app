const { Tag } = require("../model/tag.model");
const { Member } = require("../model/member.model");
const logger = require("../logger/logger");
const { OK, NOT_FOUND, CONFLICT } = require("../modules/status");

exports.createTagForMember = async (memberId, tagInput) => {
  const { tagName, tagDetails } = tagInput;

  try {
    const existingTag = await Tag.findOne({ tagName });
    if (existingTag) {
      return Promise.reject({
        statusCode: CONFLICT,
        message: "Tag already exist. Please try again.",
      });
    }
    const tag = new Tag({
      tagName,
      tagDetails,
    });
    await tag.save();

    const existingMember = await Member.findOne({ _id: memberId });

    if (!existingMember) {
      return Promise.reject({
        statusCode: NOT_FOUND,
        message: "Member not found. Please try again.",
      });
    }

    logger.info(
      `::: Creating tag for member ${JSON.stringify(existingMember)} :::`
    );

    existingMember.tags.push(tag);
    await existingMember.save();
    return Promise.resolve(tag);
  } catch (err) {
    logger.error(
      `Unable to create tag for member with Id ${JSON.stringify(memberId)}.`
    );
    return Promise.reject(err);
  }
};

exports.updateTagForMember = async (tagId, tagInput) => {
  const { tagName, tagDetails } = tagInput;

  try {
    const existingTag = await Tag.findOne({ _id: tagId });

    if (!existingTag) {
      return Promise.reject({
        statusCode: NOT_FOUND,
        message: "Tag not found. Please try again.",
      });
    }
    return Tag.findOneAndUpdate(
      {
        _id: tagId,
      },
      {
        $set: {
          tagName,
          tagDetails,
        },
      },
      { new: true }
    );
  } catch (err) {
    logger.error("Errors updating tag.");
    // const error = new Error("Unable to create new member");
    // throw error;
    return Promise.reject(err);
  }
};

exports.deleteTagForMember = async (tagId, memberId) => {
  try {
    const existingTag = await Tag.findOne({ _id: tagId });

    if (!existingTag) {
      return Promise.reject({
        statusCode: NOT_FOUND,
        message: "Tag not found. Please try again.",
      });
    }

    const deletedTag = await Tag.findByIdAndRemove({ _id: tagId });

    const tagOwner = await Member.findOne({ _id: memberId });
    if (!tagOwner) {
      return Promise.reject({
        statusCode: NOT_FOUND,
        message: "Member not found. Please try again.",
      });
    }
    tagOwner.tags.pull(tagId);
    await tagOwner.save();

    return { status: true, message: "Tag successfully removed." };
  } catch (err) {
    logger.error("Unable to delete tag.");
    return Promise.reject(err);
  }
};

exports.getAllTags = async () => {
  try {
    const tags = await Tag.find({});
    if (tags.length < 1) {
      return Promise.reject({
        statusCode: NOT_FOUND,
        message: "Tags not found. Please try again later.",
      });
    }
    return Promise.resolve(tags);
  } catch (err) {
    logger.error("Unable to fetch tags.");
    return Promise.reject(err);
  }
};

exports.getSingleTag = async (tagId) => {
  try {
    const tag = await Tag.findOne({ _id: tagId });

    if (!tag) {
      return Promise.reject({
        statusCode: NOT_FOUND,
        message: "Tag not found. Please try again later.",
      });
    }
    return Promise.resolve(tag);
  } catch (err) {
    logger.error(
      `::: Unable to fecth tag with Id ${JSON.stringify(tagId)} :::`
    );
    return Promise.reject(err);
  }
};
