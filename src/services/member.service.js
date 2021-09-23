const { Member } = require("../model/member.model");
const { Tag } = require("../model/tag.model");
const { MemberType } = require("../model/member.type");
const logger = require("../logger/logger");
const { OK, NOT_FOUND, CONFLICT } = require("../modules/status");

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

exports.removeMember = async (memberId) => {
  try {
    const existingMember = await Member.findOne({ _id: memberId });
    if (!existingMember) {
      return Promise.reject({
        statusCode: NOT_FOUND,
        message: "Member not found. Please try again.",
      });
    }

    await Member.findByIdAndRemove({ _id: memberId });

    return { status: true, message: "Member successfully removed." };
  } catch (error) {
    logger.error(`Unable to delete member with id ${memberId}.`);
    return Promise.reject(err);
  }
};

exports.getAllMembers = async () => {
  try {
    const activeMembers = await Member.find({}).populate("tags").exec();
    if (activeMembers.length < 1) {
      return Promise.reject({
        statusCode: NOT_FOUND,
        message: "Members not found. Please try again.",
      });
    }

    return Promise.resolve(activeMembers);
  } catch (err) {
    logger.error("Unable to fetch members.");
    return Promise.reject(err);
  }
};

exports.getSingleMember = async (memberId) => {
  try {
    const member = await Member.findOne({ _id: memberId })
      .populate("tags")
      .exec();

    if (!member) {
      return Promise.reject({
        statusCode: NOT_FOUND,
        message: "Member not found. Please try again.",
      });
    }
    return Promise.resolve(member);
  } catch (err) {
    logger.error(`Unable to fetch member with error ${JSON.stringify(err)}`);
    return Promise.reject(err);
  }
};
