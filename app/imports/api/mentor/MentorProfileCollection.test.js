import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '../base/BaseUtilities';
import { MentorProfiles } from './MentorProfileCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { ROLE } from '../role/Role';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('MentorProfileCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #update, #removeIt, #dumpOne, #restoreOne', function test() {
      const mentor = makeSampleUser(ROLE.MENTOR);
      const company = 'Capybara Inc';
      const career = 'Software Ninja';
      const location = 'Honolulu, HI';
      const linkedin = 'josephinegarces';
      const motivation = 'Because I can!';
      const instanceID = MentorProfiles.define({ mentor, company, career, location, linkedin, motivation });
      expect(MentorProfiles.isDefined(instanceID)).to.be.true;
      const dumpObject = MentorProfiles.dumpOne(instanceID);
      MentorProfiles.removeIt(instanceID);
      expect(MentorProfiles.isDefined(instanceID)).to.be.false;
      MentorProfiles.restoreOne(dumpObject);
      const id = MentorProfiles.findDoc({ linkedin: 'josephinegarces' })._id;
      expect(MentorProfiles.isDefined(id)).to.be.true;
      MentorProfiles.removeIt(id);
    });
  });
}
