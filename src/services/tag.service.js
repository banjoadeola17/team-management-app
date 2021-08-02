const { ApolloError } = require("apollo-server");
const { Tag } = require("../model/tag.model");
const { Member } = require("../model/member.model");
const logger = require("../logger/logger");

exports.createTagForMember = async (memberId, tagInput) => {
  const { tagName, tagDetails } = tagInput;

  try {
    //  Find member and set tag
    const existingMember = await Member.findOne({ _id: memberId });

    if (!existingMember) throw new Error("Member could not be found.");

    const tag = new Tag({
      tagName,
      tagDetails,
    });
    await tag.save();

    existingMember.tags.push(tag);
    await existingMember.save();
    return tag;
  } catch (error) {
    logger.error("Troubles creating new member.");
    const err = new Error("Unable to create tag.")
    throw err
  }
};

exports.updateTagForMember = async (tagId, tagInput) => {
  const { tagName, tagDetails } = tagInput;

  try {
    // Find existing tag
    const existingTag = await Tag.findOne({ _id: tagId });

    if (!existingTag) throw new Error("Tag does not exist.");
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
  } catch (error) {
    logger.error("Troubles updating tag.");
    const err = new Error("Could not update tag.")
    throw err
  }
};

exports.deleteTagForMember = async (tagId, memberId) => {
  try {
    const existingTag = await Tag.findOne({ _id: tagId });

    if (!existingTag) throw new Error("Tag does not exist.");

    const deletedTag = await Tag.findByIdAndRemove({ _id: tagId });

    const tagOwner = await Member.findOne({ _id: memberId });
    if(!tagOwner) throw new Error("Member not found.");
    tagOwner.tags.pull(tagId);
    await tagOwner.save();

    return { status: true, message: "Tag successfully removed." };
  } catch (error) {
    logger.error("Unable to delete tag.");
    const err = new Error("Unable to delete tag.")
    throw err
  }
};

exports.getAllTags = async () => {
  try {
    const tags = await Tag.find({});
    if (tags.length < 1) throw new Error("Tag does not exist.");
    return tags;
  } catch (error) {
    logger.error("Unable to fetch tags.");
    const err = new Error("Could not fetch tags.")
    throw err
  }
};

exports.getSingleTag = async (tagId) => {
  try {
    const tag = await Tag.findOne({ _id: tagId });
    if (!tag) throw new Error("Tag does not exist.");
    return tag;
  } catch (error) {
    logger.error("Troubles fetching tag.");
    const err = new Error("Could not fetch tags.")
    throw err
  }
};
