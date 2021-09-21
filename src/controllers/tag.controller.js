const { ApolloError } = require("apollo-server");
const {
  createTagForMember,
  updateTagForMember,
  getAllTags,
  getSingleTag,
  deleteTagForMember,
} = require("../services/tag.service");

const { validateTagSchema } = require("../validations/tag.validation");
const logger = require("../logger/logger");

exports.setTagForMember = async (memberId, tagInput) => {

  logger.info(`Creating tag for member ${memberId}`);

  try {
    const validateTagInput = validateTagSchema(tagInput);

    if (validateTagInput.error)
      throw new Error(validateTagInput.error.details[0].message);

    let createdTag = await createTagForMember(memberId, tagInput);
    return Promise.resolve(createdTag);
  } catch (err) {
    return new ApolloError("Unable to create tag for member", "CREATE_TAG_ERROR");
  }
};

exports.editTag = async (tagId, tagInput) => {
  logger.info(`Updating tag with id ${tagId}`);
  try {
    const validateTagInput = validateTagSchema(tagInput);

    if (validateTagInput.error)
      throw new Error(validateTagInput.error.details[0].message);

    const updatedTag = await updateTagForMember(tagId, tagInput);
    return Promise.resolve(updatedTag);
  } catch (err) {
    return new ApolloError("Unable to update tag.", "EDIT_TAG_ERROR");
  }
};

exports.removeTag = async (tagId, memberId) => {
  logger.info(
    `Request sent to delete tag ${tagId} for member with id ${memberId}`
  );

  try {
    return await deleteTagForMember(tagId, memberId);
  } catch (err) {
    return new ApolloError("Unable to remove tag.", "REMOVE_TAG_ERROR");
  }
};

exports.fetchTags = async () => {
  logger.info("Fetching all tags.");

  try {
    const tags = await getAllTags();
    return Promise.resolve(tags);
  } catch (err) {
    return new ApolloError("Unable to fetch tags.", "FETCH_TAGS_ERROR");
  }
};

exports.fetchTag = async (tagId) => {
  logger.info(`Fetching tag with id ${tagId}`);

  try {
    const tag = await getSingleTag(tagId);
    return Promise.resolve(tag);
  } catch (err) {
    return new ApolloError("Unable to fetch tag.", "FETCH_TAG_ERROR");
  }
};
