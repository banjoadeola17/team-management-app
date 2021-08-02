const { Member } = require("../model/member.model");
const { Tag } = require("../model/tag.model");
const { MemberType } = require("../model/member.type");
const logger = require("../logger/logger");

exports.addNewMember = async (memberInput) => {
  const { memberType } = memberInput;
  try {
    if (memberType === MemberType.EMPLOYEE) {
      return createEmployee(memberInput);
    }

    if (memberType === MemberType.CONTRACTOR) {
      return createContractor(memberInput);
    }
  } catch (error) {
    logger.error("Could not create new member.");
    const err = new Error("Unable to create new member")
    throw err
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
    const existingMember = await Member.findOne({ _id: memberId });
    if (!existingMember) throw new Error("Member does not exist.");
    if (memberType === MemberType.EMPLOYEE) {
      return updateEmployee(memberId, memberInput);
    }
    if (memberType === MemberType.CONTRACTOR) {
      return updateContractor(memberId, memberInput);
    }
  } catch (error) {
    logger.error("Troubles updating member details.");
    const err = new Error("Unable to create new member")
    throw err
  }
};

async function updateEmployee(memberId, memberInput) {
  const { firstName, lastName, memberType, role } = memberInput;
  return Member.findOneAndUpdate(
    {
      _id: memberId,
    },
    {
      $set: {
        firstName,
        lastName,
        memberType,
        role,
      },
    },
    { new: true }
  );
}

async function updateContractor(memberId, memberInput) {
  const { firstName, lastName, memberType, contractDuration } = memberInput;

  return Member.findOneAndUpdate(
    {
      _id: memberId,
    },
    {
      $set: {
        firstName,
        lastName,
        memberType,
        contractDuration,
      },
    },
    { new: true }
  );
}

exports.removeMember = async (memberId) => {
  try {
    const existingMember = await Member.findOne({ _id: memberId });
    if (!existingMember) throw new Error("Member does not exist.");

    const deletedMember = await Member.findByIdAndRemove({ _id: memberId });

    return { status: true, message: "Member successfully removed." };

  } catch (error) {
    logger.error(`Unable to delete member with id ${memberId}.`);
    const err = new Error("Unable to delete tag.")
    throw err
  }
};

exports.getAllMembers = async () => {
  try {
    const activeMembers = await Member.find({}).populate("tags").exec();
    if (members.length < 1) throw new Error("Member does not exist.");

    return activeMembers;
  } catch (error) {
    logger.error("Unable to fetch members.");
    const err = new Error("Unable to fetch members.")
    throw err
  }
};

exports.getSingleMember = async (memberId) => {
  try {
    return Member.findOne({ _id: memberId }).populate("tags").exec();
  } catch (error) {
    logger.error("Unable to fetch member.");
    const err = new Error("Unable to delete tag.")
    throw err
  }
};
