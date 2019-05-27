import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Courses } from '../../../api/course/CourseCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection.js';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import PreferredChoice from '../../../api/degree-plan/PreferredChoice';
import { ROLE } from '../../../api/role/Role';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';

Template.Card_Explorer_Courses_Widget.onCreated(function cardExplorerCoursesWidgetOnCreated() {
  this.hidden = new ReactiveVar(true);
});

const availableCourses = () => {
  const courses = Courses.findNonRetired({});
  if (courses.length > 0) {
    const studentID = getUserIdFromRoute();
    let filtered = _.filter(courses, function filter(course) {
      if (course.number === 'ICS 499') {
        return true;
      }
      const ci = CourseInstances.find({
        studentID,
        courseID: course._id,
      }).fetch();
      return ci.length === 0;
    });
    if (Roles.userIsInRole(studentID, [ROLE.STUDENT])) {
      const profile = StudentProfiles.findDoc({ userID: studentID });
      const plan = AcademicPlans.findDoc(profile.academicPlanID);
      if (plan.coursesPerSemester.length < 15) { // not bachelors and masters
        const regex = /[1234]\d\d/g;
        filtered = _.filter(filtered, (c) => c.number.match(regex));
      }
    }

    return filtered;
  }
  return [];
};

function matchingCourses() {
  if (getRouteUserName()) {
    const allCourses = availableCourses();
    const profile = Users.getProfile(getRouteUserName());
    const interestIDs = Users.getInterestIDs(profile.userID);
    const preferred = new PreferredChoice(allCourses, interestIDs);
    return preferred.getOrderedChoices();
  }
  return [];
}

function hiddenCoursesHelper() {
  if (getRouteUserName()) {
    const courses = matchingCourses();
    let nonHiddenCourses;
    if (Template.instance().hidden.get()) {
      const profile = Users.getProfile(getRouteUserName());
      nonHiddenCourses = _.filter(courses, (course) => {
        if (_.includes(profile.hiddenCourseIDs, course._id)) {
          return false;
        }
        return true;
      });
    } else {
      nonHiddenCourses = courses;
    }
    return nonHiddenCourses;
  }
  return [];
}

Template.Card_Explorer_Courses_Widget.helpers({
  courses() {
    const courses = matchingCourses();
    let visibleCourses;
    if (Template.instance().hidden.get()) {
      visibleCourses = hiddenCoursesHelper();
    } else {
      visibleCourses = courses;
    }
    return visibleCourses;
  },
  hidden() {
    return Template.instance().hidden.get();
  },
  hiddenExists() {
    if (getRouteUserName()) {
      const profile = Users.getProfile(getRouteUserName());
      if (profile.hiddenCourseIDs) {
        return profile.hiddenCourseIDs.length !== 0;
      }
    }
    return false;
  },
  itemCount() {
    return hiddenCoursesHelper().length;
  },
  typeCourse() {
    return true;
  },
});

Template.Card_Explorer_Courses_Widget.events({
  'click .showHidden': function clickShowHidden(event) {
    event.preventDefault();
    Template.instance().hidden.set(false);
  },
  'click .hideHidden': function clickHideHidden(event) {
    event.preventDefault();
    Template.instance().hidden.set(true);
  },
});
