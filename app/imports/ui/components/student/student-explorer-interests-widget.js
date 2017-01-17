import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import * as RouteNames from '/imports/startup/client/router.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';

function passedCourseHelper(courseSlugName) {
  let ret = 'Not in plan';
  const slug = Slugs.find({ name: courseSlugName }).fetch();
  const course = Courses.find({ slugID: slug[0]._id }).fetch();
  const ci = CourseInstances.find({
    studentID: getUserIdFromRoute(),
    courseID: course[0]._id,
  }).fetch();
  _.map(ci, (c) => {
    if (c.verified === true) {
      if (c.grade === 'A+' || c.grade === 'A' || c.grade === 'A-' || c.grade === 'B+' ||
        c.grade === 'B' || c.grade === 'B-') {
        ret = 'Completed';
      } else {
        ret = 'In plan, but not yet complete';
      }
    } else {
      ret = 'In plan, but not yet complete';
    }
  });
  return ret;
}

function verifiedOpportunityHelper(opportunitySlugName) {
  let ret = 'Not in plan';
  const slug = Slugs.find({ name: opportunitySlugName }).fetch();
  const opportunity = Opportunities.find({ slugID: slug[0]._id }).fetch();
  const oi = OpportunityInstances.find({
    studentID: getUserIdFromRoute(),
    opportunityID: opportunity[0]._id,
  }).fetch();
  _.map(oi, (o) => {
    if (o.verified === true) {
      ret = 'Completed and verified';
    } else {
      ret = 'In plan, but not yet verified';
    }
  });
  return ret;
}

Template.Student_Explorer_Interests_Widget.helpers({
  isLabel(label, value) {
    return label === value;
  },
  userPicture(user) {
    return Users.findDoc(user).picture;
  },
  interestName(interestSlugName) {
    const slug = Slugs.find({ name: interestSlugName }).fetch();
    const course = CareerGoals.find({ slugID: slug[0]._id }).fetch();
    return course[0].name;
  },
  courseName(course) {
    return course.shortName;
  },
  opportunityName(opportunity) {
    return opportunity.name;
  },
  careerGoalName(careerGoal) {
    return careerGoal.name;
  },
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  opportunitiesRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
  },
  courseNameFromSlug(courseSlugName) {
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.find({ slugID: slug[0]._id }).fetch();
    return course[0].shortName;
  },
  opportunityNameFromSlug(opportunitySlugName) {
    const slug = Slugs.find({ name: opportunitySlugName }).fetch();
    const opportunity = Opportunities.find({ slugID: slug[0]._id }).fetch();
    return opportunity[0].name;
  },
  passedCourse(courseSlugName) {
    return passedCourseHelper(courseSlugName);
  },
  verifiedOpportunity(opportunitySlugName) {
    return verifiedOpportunityHelper(opportunitySlugName);
  },
  rowColorCourse(courseSlugName) {
    let ret = '';
    const passed = passedCourseHelper(courseSlugName);
    if (passed === 'Completed') {
      ret = 'positive';
    } else if (passed === 'In plan, but not yet complete') {
      ret = 'warning';
    } else {
      ret = 'negative';
    }
    return ret;
  },
  rowColorOpportunity(opportunitySlugName) {
    let ret = '';
    const passed = verifiedOpportunityHelper(opportunitySlugName);
    if (passed === 'Completed and verified') {
      ret = 'positive';
    } else if (passed === 'In plan, but not yet verified') {
      ret = 'warning';
    } else {
      ret = 'negative';
    }
    return ret;
  },
  iconCourse(courseSlugName) {
    let ret = '';
    const passed = passedCourseHelper(courseSlugName);
    if (passed === 'Completed') {
      ret = 'icon checkmark';
    } else if (passed === 'In plan, but not yet complete') {
      ret = 'warning sign icon';
    } else {
      ret = 'warning circle icon';
    }
    return ret;
  },
  iconOpportunity(opportunitySlugName) {
    let ret = '';
    const passed = verifiedOpportunityHelper(opportunitySlugName);
    if (passed === 'Completed') {
      ret = 'icon checkmark';
    } else if (passed === 'In plan, but not yet verified') {
      ret = 'warning sign icon';
    } else {
      ret = 'warning circle icon';
    }
    return ret;
  },
  userStatus(interest) {
    let ret = false;
    const user = Users.findDoc({ username: getRouteUserName() });
    if (_.includes(user.interestIDs, interest._id)) {
      ret = true;
    }
    return ret;
  },
  tableStyle(table) {
    let tableColor;
    let tableIcon;
    let tableTitle;
    if (table[0].status === 'Completed') {
      tableColor = 'positive';
      tableIcon = 'icon checkmark';
      tableTitle = 'Completed';
    } else if (table[0].status === 'Not in plan') {
      tableColor = 'negative';
      tableIcon = 'warning circle icon';
      tableTitle = 'Not in plan';
    } else if (table[0].status === 'In plan, but not yet complete') {
      tableColor = 'warning';
      tableIcon = 'warning sign icon';
      tableTitle = 'In plan, but not yet complete';
    }
    return { color: tableColor, icon: tableIcon, title: tableTitle };
  },
  notEmpty(list) {
    let ret = false;
    if (list[0].length + list[1].length + list[2].length > 0) {
      ret = true;
    }
    return ret;
  },
});

Template.Student_Explorer_Interests_Widget.events({
  'click .addItem': function clickAddItem(event) {
    event.preventDefault();
    const student = Users.findDoc({ username: getRouteUserName() });
    const id = event.target.value;
    const studentItems = student.interestIDs;
    try {
      studentItems.push(id);
      Users.setInterestIds(student._id, studentItems);
    } catch (e) {
      // don't do anything.
    }
  },
  'click .deleteItem': function clickRemoveItem(event) {
    event.preventDefault();
    const student = Users.findDoc({ username: getRouteUserName() });
    const id = event.target.value;
    let studentItems = student.interestIDs;
    try {
      studentItems = _.without(studentItems, id);
      Users.setInterestIds(student._id, studentItems);
    } catch (e) {
      // don't do anything.
    }
  },
});

Template.Student_Explorer_Interests_Widget.onCreated(function studentExplorerInterestsWidgetOnCreated() {
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
});