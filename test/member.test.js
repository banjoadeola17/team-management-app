const { describe, it } = require("mocha");
const chai = require("chai");
const sinon = require("sinon");
const chaiAsPromised = require("chai-as-promised");
const { Member } = require("../src/model/member.model");

const {
  addNewMember,
  getSingleMember,
  updateMember,
} = require("../src/services/member.service");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Member Service Tests", function () {
  memberId = "randomMemberId";

  const memberInput = {
    firstName: "Dummy",
    lastName: "Dummy",
    memberType: "EMPLOYEE",
    role: "role",
    contractDuration: "2 months",
  };

  it("should create new member.", async function () {
    sinon.stub(Member.prototype, "save").resolves({ memberInput });

    const response = await addNewMember(memberInput);

    expect(response).to.exist;
  });

  it("should successfully update tag for member", async function () {
    const { memberType } = memberInput;
    const findOneMember = sinon.stub(Member, "findOne").resolves({
      _id: memberId,
      firstName: "Dummy",
      lastName: "Dummy",
      memberType: "EMPLOYEE",
      tags: [],
      role: "role",
    });

    const updatedMember = sinon.stub(Member, "findOneAndUpdate");
    updatedMember.resolves({
      firstName: "Dummy",
      lastName: "Dummy",
      memberType: "EMPLOYEE",
      tags: [{ tagId: "randomId" }],
    });

    const response = await updateMember({ memberId, memberInput });

    expect(response).to.exist;
    expect(response).to.have.property("tags");

    findOneMember.restore();
    sinon.assert.calledOnce(findOneMember);

    updatedMember.restore();
    sinon.assert.calledOnce(updatedMember);
  });
});
