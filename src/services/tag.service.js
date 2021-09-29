const { Tag } = require("../model/tag.model");
const { Member } = require("../model/member.model");
const logger = require("../logger/logger");
const { OK, NOT_FOUND, CONFLICT } = require("../modules/status");

/**
 * Create a tag
 * @param {Object} memberId - member object to create tag for
 * @param {Object} tagInput - input tag object to be created
 * @returns {Object} createdTag
 */
exports.createTagForMember = async (memberId, tagInput) => {
  const { tagName, tagDetails } = tagInput;

  try {
    const existingTag = await Tag.findOne({ tagName });
    if (existingTag) throw new Error("Tag already exist. Please try again");

    const tag = new Tag({
      tagName,
      tagDetails,
    });
    await tag.save();

    const existingMember = await Member.findOne({ _id: memberId });

    if (!existingMember) throw new Error("Could not find member.");

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

/**
 * Update a tag
 * @param {Object} tagId - tagId object to be updated
 * @param {Object} tagInput - input tag object to be updated
 * @returns {Object} updatedTag
 */
exports.updateTagForMember = async (tagId, tagInput) => {
  const { tagName, tagDetails } = tagInput;

  try {
    return Tag.findOneAndUpdate(
      {
        _id: tagId,
      },
      {
        $set: { ...tagInput },
      },
      { new: true }
    );
  } catch (err) {
    logger.error("Errors updating tag.");
    return Promise.reject(err);
  }
};

/**
 * Delete a tag
 * @param {Object} memberId - memberId object of tag owner
 * @param {Object} tagId - tag Id object to be deleted
 * @returns {Object} deletion response
 */
exports.deleteTagForMember = async (tagId, memberId) => {
  try {
    const existingTag = await Tag.findOne({ _id: tagId });

    if (!existingTag) throw new Error("Tag not found. Please try again.");

    await Tag.findByIdAndRemove({ _id: tagId });

    const tagOwner = await Member.findOne({ _id: memberId });
    if (!tagOwner) throw new Error("Member not found. Please try again.");

    tagOwner.tags.pull(tagId);
    await tagOwner.save();

    return { status: true, message: "Tag successfully removed." };
  } catch (err) {
    logger.error("Unable to delete tag.");
    return Promise.reject(err);
  }
};

/**
 * fetch all tags
 * @returns {Object} tags
 */
exports.getAllTags = async () => {
  try {
    const tags = await Tag.find({});
    if (tags.length < 1)
      throw new Error("Tags not found. Please try again later.");

    return Promise.resolve(tags);
  } catch (err) {
    logger.error("Unable to fetch tags.");
    return Promise.reject(err);
  }
};

/**
 * Get a single tag
 * @param {Object} tagId - tag Id object to be fetched
 * @returns {Object} tag
 */
exports.getSingleTag = async (tagId) => {
  try {
    const tag = await Tag.findOne({ _id: tagId });

    if (!tag) throw new Error("Tags not found. Please try again later.");

    return Promise.resolve(tag);
  } catch (err) {
    logger.error(
      `::: Unable to fecth tag with Id ${JSON.stringify(tagId)} :::`
    );
    return Promise.reject(err);
  }
};
