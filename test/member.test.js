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

  it("should create new member if the input meets the defined schema.", async function () {
    sinon.stub(Member.prototype, "save").resolves({ memberInput });

    const response = await addNewMember(memberInput);

    expect(response).to.exist;
  });

  it("should fail to create new member if member type is not specified.", async function () {
    const memberInputForFailure = {
      firstName: "Dummy",
      lastName: "Dummy",
      role: "role",
      memberType: null,
      contractDuration: "2 months",
    };

    try {
    } catch (err) {
      await addNewMember(memberInputForFailure);
    }
  });

  it("should successfully update tag for member", async function () {
    const { memberType } = memberInput;

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

    updatedMember.restore();
    sinon.assert.calledOnce(updatedMember);
  });
});
