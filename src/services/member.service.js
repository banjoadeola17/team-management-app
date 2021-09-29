const { Member } = require("../model/member.model");
const { Tag } = require("../model/tag.model");
const { MemberType } = require("../model/member.type");
const logger = require("../logger/logger");
const { OK, NOT_FOUND, CONFLICT } = require("../modules/status");

/**
 * Create a member
 * @param {Object} memberInput - input object to be created
 * @returns {Object} createdMember
 */
exports.addNewMember = async (memberInput) => {
  const { memberType } = memberInput;
  try {
    if (memberType === MemberType.EMPLOYEE) {
      return createEmployee(memberInput);
    }

    if (memberType === MemberType.CONTRACTOR) {
      return createContractor(memberInput);
    }
  } catch (err) {
    logger.error(
      `Could not create new member with error [${JSON.stringify(err)}]`
    );
    return Promise.reject(err);
  }
};

async function createEmployee({ firstName, lastName, memberType, role }) {
  return new Member({
    firstName,
    lastName,
    memberType,
    role,
  }).save();
}

async function createContractor({
  firstName,
  lastName,
  memberType,
  contractDuration,
}) {
  return new Member({
    firstName,
    lastName,
    memberType,
    contractDuration,
  }).save();
}

/**
 * Update a member
 * @param {Object} args - member args object to be updated
 * @returns {Object} updatedMember
 */
exports.updateMember = async (args) => {
  const { memberId, memberInput } = args;
  const { memberType } = memberInput;
  try {
    if (memberType === MemberType.EMPLOYEE) {
      return updateEmployee(memberId, memberInput);
    }
    if (memberType === MemberType.CONTRACTOR) {
      return updateContractor(memberId, memberInput);
    }
  } catch (error) {
    logger.error("Troubles updating member details.");
    return Promise.reject(error);
  }
};

async function updateEmployee(memberId, memberInput) {
  return Member.findOneAndUpdate(
    {
      _id: memberId,
    },
    {
      $set: { ...memberInput },
    },
    { new: true }
  );
}

async function updateContractor(memberId, memberInput) {
  return Member.findOneAndUpdate(
    {
      _id: memberId,
    },
    {
      $set: { ...memberInput },
    },
    { new: true }
  );
}

/**
 * Delete a member
 * @param {Object} memberId - memberId object to be deleted
 * @returns {Object} deletion response
 */
exports.removeMember = async (memberId) => {
  try {
    const existingMember = await Member.findOne({ _id: memberId });
    if (!existingMember)
      throw new Error("Member not found. Please try again later.");

    await Member.findByIdAndRemove({ _id: memberId });

    return { status: true, message: "Member successfully removed." };
  } catch (error) {
    logger.error(`Unable to delete member with id ${memberId}.`);
    return Promise.reject(err);
  }
};

/**
 * fetch all members
 * @returns {Object} members
 */
exports.getAllMembers = async () => {
  try {
    const activeMembers = await Member.find({}).populate("tags").exec();
    if (activeMembers.length < 1)
      throw new Error("Members not found. Please try again.");

    return Promise.resolve(activeMembers);
  } catch (err) {
    logger.error("Unable to fetch members.");
    return Promise.reject(err);
  }
};

/**
 * Get one member
 * @param {Object} memberId - memberId object to be fetched
 * @returns {Object} member
 */
exports.getSingleMember = async (memberId) => {
  try {
    const member = await Member.findOne({ _id: memberId })
      .populate("tags")
      .exec();

    if (!member) throw new Error("Member not found. Please try again.");

    return Promise.resolve(member);
  } catch (err) {
    logger.error(`Unable to fetch member with error ${JSON.stringify(err)}`);
    return Promise.reject(err);
  }
};
