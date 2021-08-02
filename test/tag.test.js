const { describe, it } = require("mocha");
const chai = require("chai");
const sinon = require("sinon");
const chaiAsPromised = require("chai-as-promised");
const { Member } = require("../src/model/member.model");
const { Tag } = require("../src/model/tag.model");

const {
  createTagForMember,
  getSingleTag,
} = require("../src/services/tag.service");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Tag Service Tests", function () {
  it("should create tag for member.", async function () {
    const memberId = "uydy287hsn";
    const tagInput = {
      tagName: "Java",
      tagDetails: "Java details",
    };

    const { tagName, tagDetails } = tagInput;

    const member = sinon.stub(Member, "findOne").resolves({ _id: memberId });

    sinon.stub(Tag.prototype, "save").resolves({
      tagName,
      tagDetails,
    });

    const response = await createTagForMember(memberId, tagInput);

    member.restore();
    sinon.assert.calledOnce(member);
  });

  it("should successfully fetch a single tag", async function () {
    const tagId = "bhgvytk";

    const findOneTag = sinon.stub(Tag, "findOne").resolves({ _id: tagId });

    const response = await getSingleTag({tagId});

    findOneTag.restore();
    sinon.assert.calledOnce(findOneTag);
  });
});
