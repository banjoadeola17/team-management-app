const Joi = require("joi");
const { MemberType } = require("../model/member.type");

function validateMemberSchema(memberInput) {
  const Schema = Joi.object().keys({
    firstName: Joi.string().max(30).required(),
    lastName: Joi.string().max(30).required(),
    memberType: Joi.string()
      .valid(MemberType.EMPLOYEE, MemberType.CONTRACTOR)
      .required(),
    role: Joi.when("memberType", {
      is: MemberType.EMPLOYEE,
      then: Joi.string().required(),
    }),
    contractDuration: Joi.when("memberType", {
      is: MemberType.CONTRACTOR,
      then: Joi.number().required(),
    }),
  });

  return Schema.validate(memberInput);
}

module.exports = { validateMemberSchema };
