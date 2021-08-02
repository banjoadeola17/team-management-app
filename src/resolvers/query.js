const {
  fetchMembers,
  fetchMember,
} = require("../controllers/member.controller");
const { fetchTags, fetchTag } = require("../controllers/tag.controller");

module.exports = {
  getMembers: async () => await fetchMembers(),

  memberById: async (_, { memberId }) => await fetchMember(memberId),

  getTags: async () => await fetchTags(),

  tagById: async (_, { tagId }) => await fetchTag(tagId),
};
