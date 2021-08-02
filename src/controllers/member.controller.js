const { ApolloError } = require("apollo-server");
const {
  addNewMember,
  updateMember,
  removeMember,
  getAllMembers,
  getSingleMember,
} = require("../services/member.service");
const { validateMemberSchema } = require("../validations/member.validation");
const logger = require("../logger/logger");

exports.createMember = async (memberInput) => {
  logger.info(
    `Adding new member with input data ${JSON.stringify(memberInput)} `
  );
  try {
    const validateMemberInput = validateMemberSchema(memberInput);

    if (validateMemberInput.error)
      throw new Error(validateMemberInput.error.details[0].message);

    const member = await addNewMember(memberInput);
    return member;
  } catch (err) {

    return new ApolloError("Unable to create new member.", "MEMBER_ERROR");
  }
};

exports.editMemberProfile = async (args) => {
  logger.info(`Updating data for member with id ${args.memberId}`);
  try {
    const { memberInput } = args;
    const validateMemberInput = validateMemberSchema(memberInput);

    if (validateMemberInput.error)
      throw new Error(validateMemberInput.error.details[0].message);

    const updatedMemberData = await updateMember(args);
    return updatedMemberData;
  } catch (error) {
    return new ApolloError(
      "Unable to update member profile.",
      "UPDATE_MEMBER_ERROR"
    );
  }
};

exports.deleteMemberProfile = async (memberId) => {
  logger.info(`Removing data for member with id ${memberId}`);
  try {
    const deletedMember = await removeMember(memberId);
    return { status: true, message: "Member successfully removed." };
  } catch (error) {
    return new ApolloError("Unable to delet member.", "MEMBER_ERROR");
  }
};

exports.fetchMembers = async () => {
  logger.info("Fetching all members");
  try {
    const members = await getAllMembers();
    return members;
  } catch (error) {
    return new ApolloError("Cannot fetch members.", "MEMBER_ERROR");
  }
};

exports.fetchMember = async (memberId) => {
  logger.info(`Fetch single member with id ${memberId}`);
  try {
    const member = await getSingleMember(memberId);
    return member;
  } catch (error) {
    return new ApolloError("Cannot fetch member.", "MEMBER_ERROR");
  }
};
