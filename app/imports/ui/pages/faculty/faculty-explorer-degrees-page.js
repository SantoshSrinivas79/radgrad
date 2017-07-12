import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { ROLE } from '../../../api/role/Role.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection.js';
import { Users } from '../../../api/user/UserCollection.js';

function interestedUsers(degree) {
  const interested = [];
  const profiles = Users.findProfilesWithRole(ROLE.STUDENT);
  _.forEach(profiles, (profile) => {
    // TODO This won't work; desiredDegreeID not in profile.
    if (_.includes(profile.desiredDegreeID, degree._id)) {
      interested.push(profile);
    }
  });
  return interested;
}

function numUsers(degree) {
  return interestedUsers(degree).length;
}

Template.Faculty_Explorer_Degrees_Page.helpers({
  addedDegrees() {
    return [];
  },
  degree() {
    const degreeSlugName = FlowRouter.getParam('degree');
    const slug = Slugs.find({ name: degreeSlugName }).fetch();
    const degree = DesiredDegrees.find({ slugID: slug[0]._id }).fetch();
    return degree[0];
  },
  descriptionPairs(degree) {
    return [
      { label: 'Description', value: degree.description },
    ];
  },
  nonAddedDegrees() {
    return DesiredDegrees.find({}, { sort: { name: 1 } }).fetch();
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  socialPairs(degree) {
    return [
      { label: 'students', amount: numUsers(degree),
        value: interestedUsers(degree) },
    ];
  },
});

