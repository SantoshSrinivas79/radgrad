import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';

import { getTotalICE, getPlanningICE } from '../../../api/ice/IceProcessor';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import * as RouteNames from '/imports/startup/client/router.js';

function getEventsHelper(iceType, type, earned, semester) {
  if (getUserIdFromRoute()) {
    const user = Users.findDoc(getUserIdFromRoute());
    let allInstances = [];
    const iceInstances = [];
    if (type === 'course') {
      const courseInstances = CourseInstances.find({ semesterID: semester._id, studentID: user._id,
        verified: earned }).fetch();
      courseInstances.forEach((courseInstance) => {
        if (CourseInstances.isICS(courseInstance._id)) {
          allInstances.push(courseInstance);
        }
      });
    } else {
      allInstances = OpportunityInstances.find({ semesterID: semester._id, studentID: user._id,
        verified: earned }).fetch();
    }
    allInstances.forEach((instance) => {
      if (iceType === 'i') {
        if (instance.ice.i > 0) {
          iceInstances.push(instance);
        }
      } else if (iceType === 'c') {
        if (instance.ice.c > 0) {
          iceInstances.push(instance);
        }
      } else if (iceType === 'e') {
        if (instance.ice.e > 0) {
          iceInstances.push(instance);
        }
      }
    });
    return iceInstances;
  }
  return null;
}

const availableCourses = () => {
  const courses = Courses.find({}).fetch();
  if (courses.length > 0) {
    const filtered = _.filter(courses, function filter(course) {
      if (course.number === 'ICS 499') {
        return true;
      }
      const ci = CourseInstances.find({
        studentID: getUserIdFromRoute(),
        courseID: course._id,
      }).fetch();
      return ci.length === 0;
    });
    return filtered;
  }
  return [];
};

function matchingCourses() {
  const allCourses = availableCourses();
  const matching = [];
  const user = Users.findDoc({ username: getRouteUserName() });
  const userInterests = [];
  let courseInterests = [];
  _.map(user.interestIDs, (id) => {
    userInterests.push(Interests.findDoc(id));
  });
  _.map(allCourses, (course) => {
    courseInterests = [];
    _.map(course.interestIDs, (id) => {
      courseInterests.push(Interests.findDoc(id));
      _.map(courseInterests, (courseInterest) => {
        _.map(userInterests, (userInterest) => {
          if (_.isEqual(courseInterest, userInterest)) {
            if (!_.includes(matching, course)) {
              matching.push(course);
            }
          }
        });
      });
    });
  });
  return matching;
}

function matchingOpportunities() {
  const allOpportunities = Opportunities.find().fetch();
  const matching = [];
  const user = Users.findDoc({ username: getRouteUserName() });
  const userInterests = [];
  let opportunityInterests = [];
  _.map(user.interestIDs, (id) => {
    userInterests.push(Interests.findDoc(id));
  });
  _.map(allOpportunities, (opp) => {
    opportunityInterests = [];
    _.map(opp.interestIDs, (id) => {
      opportunityInterests.push(Interests.findDoc(id));
      _.map(opportunityInterests, (oppInterest) => {
        _.map(userInterests, (userInterest) => {
          if (_.isEqual(oppInterest, userInterest)) {
            if (!_.includes(matching, opp)) {
              matching.push(opp);
            }
          }
        });
      });
    });
  });
  return matching;
}

Template.Student_Ice_Widget.helpers({
  earnedICE() {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      const courseInstances = CourseInstances.find({ studentID: user._id, verified: true }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: user._id, verified: true }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      return getTotalICE(earnedInstances);
    }
    return null;
  },
  plannedICE() {
    if (getUserIdFromRoute()) {
      const user = Users.findDoc(getUserIdFromRoute());
      const courseInstances = CourseInstances.find({ studentID: user._id }).fetch();
      const oppInstances = OpportunityInstances.find({ studentID: user._id }).fetch();
      const earnedInstances = courseInstances.concat(oppInstances);
      const ice = getPlanningICE(earnedInstances);
      if (ice.i > 100) {
        ice.i = 100;
      }
      if (ice.c > 100) {
        ice.c = 100;
      }
      if (ice.e > 100) {
        ice.e = 100;
      }
      return ice;
    }
    return null;
  },
  remainingICE(earned, planned) {
    return planned - earned;
  },
  innovationPoints(ice) {
    return ice.i;
  },
  competencyPoints(ice) {
    return ice.c;
  },
  experiencePoints(ice) {
    return ice.e;
  },
  coursesRouteName() {
    return RouteNames.studentExplorerCoursesPageRouteName;
  },
  opportunitiesRouteName() {
    return RouteNames.studentExplorerOpportunitiesPageRouteName;
  },
  courseSlug(course) {
    return Slugs.findDoc(Courses.findDoc(course.courseID).slugID).name;
  },
  opportunitySlug(opportunity) {
    return Slugs.findDoc(Opportunities.findDoc(opportunity.opportunityID).slugID).name;
  },
  years() {
    const studentID = getUserIdFromRoute();
    const ay = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    return ay;
  },
  semesters(year) {
    const yearSemesters = [];
    const semIDs = year.semesterIDs;
    _.map(semIDs, (semID) => {
      yearSemesters.push(Semesters.findDoc(semID));
    });
    return yearSemesters;
  },
  hasEvents(iceType, earned, semester) {
    let ret = false;
    if ((getEventsHelper(iceType, 'course', earned, semester).length > 0) ||
        (getEventsHelper(iceType, 'opportunity', earned, semester).length > 0)) {
      ret = true;
    }
    return ret;
  },
  getEvents(iceType, type, earned, semester) {
    return getEventsHelper(iceType, type, earned, semester);
  },
  recommendedEvents(iceType, type, projected) {
    if (getUserIdFromRoute()) {
      let allInstances = [];
      const recommendedInstances = [];
      let totalIce = 0;
      const remainder = 100 - projected;
      if (type === 'course') {
        allInstances = matchingCourses();
      } else {
        allInstances = matchingOpportunities();
      }

      if (iceType === 'i') {
        allInstances.forEach((instance) => {
          if (totalIce < remainder) {
            totalIce += instance.ice.i;
            recommendedInstances.push(instance);
          }
        });
      } else if (iceType === 'c') {
        allInstances.forEach((instance) => {
          if (totalIce < remainder) {
            totalIce += 9; // assume A grade
            recommendedInstances.push(instance);
          }
        });
      } else if (iceType === 'e') {
        allInstances.forEach((instance) => {
          if (totalIce < remainder) {
            totalIce += instance.ice.e;
            recommendedInstances.push(instance);
          }
        });
      } else {
        return null;
      }
      return recommendedInstances;
    }
    return null;
  },
  opportunitySemesters(opp) {
    const semesters = opp.semesterIDs;
    let semesterNames = '';
    const currentSemesterID = Semesters.getCurrentSemester();
    const currentSemester = Semesters.findDoc(currentSemesterID);
    _.map(semesters, (sem) => {
      if (Semesters.findDoc(sem).sortBy >= currentSemester.sortBy) {
        semesterNames = semesterNames.concat(`${Semesters.toString(sem)}, `);
      }
    });
    return semesterNames.slice(0, -2); // removes unnecessary comma and space
  },
  courseName(c) {
    const course = Courses.findDoc(c.courseID);
    return course.shortName;
  },
  courseNumber(c) {
    const course = Courses.findDoc(c.courseID);
    return course.number;
  },
  opportunityName(opp) {
    const opportunity = Opportunities.findDoc(opp.opportunityID);
    return opportunity.name;
  },
  eventSem(event) {
    const sem = Semesters.findDoc(event.semesterID);
    const oppTerm = sem.term;
    const oppYear = sem.year;
    return `${oppTerm} ${oppYear}`;
  },
  eventIce(event) {
    return event.ice;
  },
  printSemester(semester) {
    return Semesters.toString(semester._id, false);
  },
  matchingPoints(a, b) {
    return a === b;
  },
  hasNoInterests() {
    const user = Users.findDoc({ username: getRouteUserName() });
    return user.interestIDs === undefined;
  },
});

Template.Student_Ice_Widget.events({
  // add events here
});

Template.Student_Ice_Widget.onCreated(function studentIceOnCreated() {
  this.subscribe(AcademicYearInstances.getPublicationName());
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(VerificationRequests.getPublicationName());
});

Template.Student_Ice_Widget.onDestroyed(function studentIceOnDestroyed() {
  // add your statement here
});

Template.Student_Ice_Widget.onRendered(function enableAccordion() {
  this.$('.accordion').accordion({
    selector: {
      trigger: '.title .icon',
    },
    exclusive: false,
  });
});

