import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import * as RouteNames from '/imports/startup/client/router.js';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { Interests } from '../../../api/interest/InterestCollection';
import { appLog } from '../../../api/log/AppLogCollection';

Template.Student_Explorer_Interests_Widget.helpers({
  courseNameFromSlug(courseSlugName) {
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.find({ slugID: slug[0]._id }).fetch();
    return course[0].shortName;
  },
  coursesRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerCoursesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerCoursesPageRouteName;
    }
    return RouteNames.mentorExplorerCoursesPageRouteName;
  },
  fullName(user) {
    return Users.getFullName(user);
  },
  getTableTitle(tableIndex) {
    switch (tableIndex) {
      case 0:
        return '<h4><i class="green checkmark icon"></i>Completed</h4>';
      case 1:
        return '<h4><i class="yellow warning sign icon"></i>In Plan (Not Yet Completed)</h4>';
      case 2:
        return '<h4><i class="red warning circle icon"></i>Not in Plan';
      default:
        return 'ERROR: More than one table.';
    }
  },
  isInRole(role) {
    const group = FlowRouter.current().route.group.name;
    return group === role;
  },
  isLabel(label, value) {
    return label === value;
  },
  opportunitiesRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerOpportunitiesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerOpportunitiesPageRouteName;
    }
    return RouteNames.mentorExplorerOpportunitiesPageRouteName;
  },
  opportunityNameFromSlug(opportunitySlugName) {
    const slug = Slugs.find({ name: opportunitySlugName }).fetch();
    const opportunity = Opportunities.find({ slugID: slug[0]._id }).fetch();
    return opportunity[0].name;
  },
  toUpper(string) {
    return string.toUpperCase();
  },
  userPicture(user) {
    return Users.getProfile(user).picture || '/images/default-profile-picture.png';
  },
  usersRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerUsersPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerUsersPageRouteName;
    }
    return RouteNames.mentorExplorerUsersPageRouteName;
  },
  userStatus(interest) {
    let ret = false;
    const profile = Users.getProfile(getRouteUserName());
    if (_.includes(profile.interestIDs, interest._id)) {
      ret = true;
    }
    return ret;
  },
  userUsername(user) {
    return Users.getProfile(user).username;
  },
});

Template.Student_Explorer_Interests_Widget.events({
  'click .addItem': function clickAddItem(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const id = event.target.value;
    const studentItems = profile.interestIDs;
    try {
      studentItems.push(id);
      // TODO Change to method.
      Users.setInterestIds(profile.userID, studentItems);
      const interest = Interests.findDoc(id).name;
      const message = `${getRouteUserName()} added interest ${interest}`;
      appLog.info(message);
    } catch (e) {
      // don't do anything.
    }
  },
  'click .deleteItem': function clickRemoveItem(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const id = event.target.value;
    const interest = Interests.findDoc(id).name;
    const message = `${getRouteUserName()} removed interest ${interest}`;
    let studentItems = profile.interestIDs;
    try {
      studentItems = _.without(studentItems, id);
      // TODO Change to method.
      Users.setInterestIds(profile.userID, studentItems);
      appLog.info(message);
    } catch (e) {
      // don't do anything.
    }
  },
});
