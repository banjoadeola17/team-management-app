const { describe, it } = require("mocha");
const chai = require("chai");
const sinon = require("sinon");
const chaiAsPromised = require("chai-as-promised");
const { Member } = require("../src/model/member.model");

const {
    addNewMember,
    getSingleMember,
} = require("../src/services/member.service");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Member Service Tests", function () {
  it("should create new member.", async function () {
    const memberInput = {
      firstName: "Dummy",
      lastName: "Dummy",
        memberType: "EMPLOYEE",
        role: "role",
        contractDuration: "2 months"
    };

    const { firstName, lastName, memberType, role, contractDuration } = memberInput;

    sinon.stub(Member.prototype, "save").resolves({
        firstName,
        lastName,
        memberType,
        role,
        contractDuration
    });

    const response = await addNewMember(memberInput);

  });

  it("should successfully fetch a member", async function () {
    const memberId = "bhgbjvytk";

    const findOneMember = sinon.stub(Member, "findOne").resolves({ _id: memberId });

    const response = await getSingleMember({ memberId });

    findOneMember.restore();
    sinon.assert.calledOnce(findOneMember);
  });
});
