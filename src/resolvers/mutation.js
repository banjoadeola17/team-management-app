const {
  createMember,
  editMemberProfile,
  deleteMemberProfile,
} = require("../controllers/member.controller");

const {
  setTagForMember,
  editTag,
  removeTag,
} = require("../controllers/tag.controller");

module.exports = {
  addMember: async (_, { memberInput }) => await createMember(memberInput),

  updateMemberProfile: async (_, args) => await editMemberProfile(args),

  deleteMember: async (_, { memberId }) => await deleteMemberProfile(memberId),

  createTag: async (_, { memberId, tagInput }) =>
    await setTagForMember(memberId, tagInput),

  updateTag: async (_, { tagId, tagInput }) => await editTag(tagId, tagInput),

  deleteTag: async (_, {tagId, memberId}) => await removeTag(tagId, memberId)
};
