const { gql } = require("apollo-server");

module.exports = gql`
  enum MemberType {
    EMPLOYEE
    CONTRACTOR
  }

  type Member {
    _id: ID!
    firstName: String!
    lastName: String!
    memberType: MemberType!
    role: String
    contractDuration: Int
    tags: [Tag]
    createdAt: String!
    updatedAt: String!
  }

  type Tag {
    _id: ID!
    tagName: String!
    tagDetails: String!
  }

  input MemberInputData {
    firstName: String!
    lastName: String!
    memberType: MemberType!
    role: String!
    contractDuration: Int!
  }
  
  input TagInputData {
    tagName: String!
    tagDetails: String!
  }
  
  type DeleteResponse {
    status: Boolean!
    message: String!
  }

  type Query {
    getMembers: [Member!]!
    memberById(memberId: ID!): Member!
    tagById(tagId: ID!): Tag!
    getTags: [Tag!]!
  }

  type Mutation {
    addMember(memberInput: MemberInputData!): Member!
    deleteMember(memberId: ID!): DeleteResponse!
    updateMemberProfile(memberId: ID!, memberInput: MemberInputData!): Member!
    createTag(memberId: ID!, tagInput: TagInputData!): Tag!
    updateTag(tagId: ID!, tagInput: TagInputData!): Tag!
    deleteTag(tagId:ID!, memberId: ID!): DeleteResponse!
  }
`;
