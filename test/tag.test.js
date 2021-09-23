const { describe, it } = require("mocha");
const chai = require("chai");
const sinon = require("sinon");
const chaiAsPromised = require("chai-as-promised");
const { Member } = require("../src/model/member.model");
const { Tag } = require("../src/model/tag.model");

const {
  createTagForMember,
  getSingleTag,
  updateTagForMember,
} = require("../src/services/tag.service");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Tag Service Tests", function () {
  const memberId = "randomMemberId";

  const tagId = "randomTagId";

  const tagInput = {
    tagName: "Java",
    tagDetails: "Java details",
  };

  it("should successfully fetch a single tag", async function () {
    const findOneTag = sinon.stub(Tag, "findOne").resolves({ _id: tagId });

    const response = await getSingleTag({ tagId });

    expect(response).to.exist;

    findOneTag.restore();
    sinon.assert.calledOnce(findOneTag);
  });

  it("should update tag for member", async function () {

    const updatedTag = sinon.stub(Tag, "findOneAndUpdate");
    updatedTag.resolves(tagInput);

    const response = await updateTagForMember(tagId, tagInput);

    expect(response).to.exist;

    updatedTag.restore();
    sinon.assert.calledOnce(updatedTag);
  });
});
