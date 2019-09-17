import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Users } from '../../../api/user/UserCollection';
import * as RouteNames from '../../../startup/client/router';
import { isInRole } from '../../utilities/template-helpers';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getRouteUserName } from './route-user-name';
import { getUserIdFromRoute } from './get-user-id-from-route';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';

/* global window */

Template.Explorer_Menu.helpers({
  academicPlansCardRouteName() {
    window.camDebugging.start('academicPlansCardRouteName');
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      window.camDebugging.stop('academicPlansCardRouteName');
      return RouteNames.studentCardExplorerPlansPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('academicPlansCardRouteName');
      return RouteNames.facultyCardExplorerPlansPageRouteName;
    }
    window.camDebugging.stop('academicPlansCardRouteName');
    return RouteNames.mentorCardExplorerPlansPageRouteName;
  },
  academicPlansRouteName() {
    window.camDebugging.start('academicPlansRouteName');
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      window.camDebugging.stop('academicPlansRouteName');
      return RouteNames.studentExplorerPlansPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('academicPlansRouteName');
      return RouteNames.facultyExplorerPlansPageRouteName;
    }
    window.camDebugging.stop('academicPlansRouteName');
    return RouteNames.mentorExplorerPlansPageRouteName;
  },
  adminEmail() {
    window.camDebugging.start('adminEmail');
    const admin = Users._adminUsername();
    window.camDebugging.stop('adminEmail');
    return admin;
  },
  careerGoalsCardRouteName() {
    window.camDebugging.start('careerGoalsCardRouteName');
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      window.camDebugging.stop('careerGoalsCardRouteName');
      return RouteNames.studentCardExplorerCareerGoalsPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('careerGoalsCardRouteName');
      return RouteNames.facultyCardExplorerCareerGoalsPageRouteName;
    }
    window.camDebugging.stop('careerGoalsCardRouteName');
    return RouteNames.mentorCardExplorerCareerGoalsPageRouteName;
  },
  careerGoalsRouteName() {
    window.camDebugging.start('careerGoalsRouteName');
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      window.camDebugging.stop('careerGoalsRouteName');
      return RouteNames.studentExplorerCareerGoalsPageRouteName;
    } else
    if (group === 'faculty') {
      window.camDebugging.stop('careerGoalsRouteName');
      return RouteNames.facultyExplorerCareerGoalsPageRouteName;
    }
    window.camDebugging.stop('careerGoalsRouteName');
    return RouteNames.mentorExplorerCareerGoalsPageRouteName;
  },
  classType(item, type) {
    window.camDebugging.start('classType');
    let ret = 'item';
    let current;
    if (type === 'course') {
      current = FlowRouter.getParam('course');
    } else
    if (type === 'careerGoal') {
      current = FlowRouter.getParam('careerGoal');
    } else
    if (type === 'degree') {
      current = FlowRouter.getParam('degree');
    } else
    if (type === 'plan') {
      current = FlowRouter.getParam('plan');
    } else
    if (type === 'interest') {
      current = FlowRouter.getParam('interest');
    } else
    if (type === 'opportunity') {
      current = FlowRouter.getParam('opportunity');
    }
    if (item === current) {
      ret = 'active item';
    }
    window.camDebugging.stop('classType');
    return ret;
  },
  courseName(course) {
    const countStr = `x${course.count}`;
    if (course.count > 1) {
      return `${course.item.shortName} ${countStr}`;
    }
    return `${course.item.shortName}`;
  },
  coursesCardRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentCardExplorerCoursesPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyCardExplorerCoursesPageRouteName;
    }
    return RouteNames.mentorCardExplorerCoursesPageRouteName;
  },
  coursesRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerCoursesPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerCoursesPageRouteName;
    }
    return RouteNames.mentorExplorerCoursesPageRouteName;
  },
  degreesCardRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentCardExplorerDegreesPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyCardExplorerDegreesPageRouteName;
    }
    return RouteNames.mentorCardExplorerDegreesPageRouteName;
  },
  degreesRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerDegreesPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerDegreesPageRouteName;
    }
    return RouteNames.mentorExplorerDegreesPageRouteName;
  },
  equals(a, b) {
    const listArg = b.split(',');
    if (listArg.indexOf(a) < 0) {
      return false;
    }
    return true;
  },
  getRouteName() {
    const routeName = FlowRouter.getRouteName();
    switch (routeName) {
      case RouteNames.studentExplorerCareerGoalsPageRouteName:
      case RouteNames.facultyExplorerCareerGoalsPageRouteName:
      case RouteNames.mentorExplorerCareerGoalsPageRouteName:
        return 'Career Goals';
      case RouteNames.studentExplorerCoursesPageRouteName:
      case RouteNames.facultyExplorerCoursesPageRouteName:
      case RouteNames.mentorExplorerCoursesPageRouteName:
        return 'Courses';
      case RouteNames.studentExplorerPlansPageRouteName:
      case RouteNames.facultyExplorerPlansPageRouteName:
      case RouteNames.mentorExplorerPlansPageRouteName:
        return 'Academic Plans';
      case RouteNames.studentExplorerDegreesPageRouteName:
      case RouteNames.facultyExplorerDegreesPageRouteName:
      case RouteNames.mentorExplorerDegreesPageRouteName:
        return 'Degrees';
      case RouteNames.studentExplorerInterestsPageRouteName:
      case RouteNames.facultyExplorerInterestsPageRouteName:
      case RouteNames.mentorExplorerInterestsPageRouteName:
        return 'Interests';
      case RouteNames.studentExplorerOpportunitiesPageRouteName:
      case RouteNames.facultyExplorerOpportunitiesPageRouteName:
      case RouteNames.mentorExplorerOpportunitiesPageRouteName:
        return 'Opportunities';
      case RouteNames.studentCardExplorerUsersPageRouteName:
      case RouteNames.facultyCardExplorerUsersPageRouteName:
      case RouteNames.mentorCardExplorerUsersPageRouteName:
        return 'Users';
      default:
        return 'Select Explorer';
    }
  },
  interestsCardRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentCardExplorerInterestsPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerInterestsPageRouteName;
    }
    return RouteNames.mentorExplorerInterestsPageRouteName;
  },
  interestsRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerInterestsPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerInterestsPageRouteName;
    }
    return RouteNames.mentorExplorerInterestsPageRouteName;
  },
  isInRole,
  isType(type, value) {
    return type === value;
  },
  itemName(item) {
    const countStr = `x${item.count}`;
    if (item.count > 1) {
      return `${item.item.name} ${countStr}`;
    }
    return `${item.item.name}`;
  },
  opportunityItemName(item) {
    const countStr = `x${item.count}`;
    const iceString = `(${item.item.ice.i}/${item.item.ice.c}/${item.item.ice.e})`;
    if (item.count > 1) {
      return `${item.item.name} ${iceString} ${countStr}`;
    }
    return `${item.item.name} ${iceString}`;
  },
  opportunitiesCardRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerOpportunitiesPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerOpportunitiesPageRouteName;
    }
    return RouteNames.mentorExplorerOpportunitiesPageRouteName;
  },
  opportunitiesRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerOpportunitiesPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerOpportunitiesPageRouteName;
    }
    return RouteNames.mentorExplorerOpportunitiesPageRouteName;
  },
  slugName(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  userCareerGoals(careerGoal) {
    let ret = '';
    const profile = Users.getProfile(getRouteUserName());
    if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
      ret = 'check green circle outline icon';
    }
    return ret;
  },
  userCourses(course) {
    let ret = '';
    const studentID = getUserIdFromRoute();
    const courseID = course._id;
    const ci = FavoriteCourses.findNonRetired({ studentID, courseID });
    if (ci.length > 0) {
      ret = 'check green circle outline icon';
    }
    return ret;
  },
  userDegrees(degree) {
    let ret = '';
    const profile = Users.getProfile(getRouteUserName());
    // TODO This won't work, profile does not have desiredDegreeID.
    if (_.includes(profile.desiredDegreeID, degree._id)) {
      ret = 'check green circle outline icon';
    }
    return ret;
  },
  userInterests(interest) {
    let ret = '';
    const profile = Users.getProfile(getRouteUserName());
    if (_.includes(Users.getInterestIDs(profile.userID), interest._id)) {
      ret = 'check green circle outline icon';
    }
    return ret;
  },
  userOpportunities(opportunity) {
    let ret = '';
    const studentID = getUserIdFromRoute();
    const opportunityID = opportunity._id;
    const oi = FavoriteOpportunities.findNonRetired({ studentID, opportunityID });
    if (oi.length > 0) {
      ret = 'check green circle outline icon';
    }
    return ret;
  },
  userPlans(plan) {
    let ret = '';
    const studentID = getUserIdFromRoute();
    const favorites = _.map(FavoriteAcademicPlans.find({ studentID }).fetch(),
      (p) => AcademicPlans.findDoc(p.academicPlanID)._id);
    if (_.includes(favorites, plan._id)) {
      ret = 'check green circle outline icon';
    }
    return ret;
  },
  usersCardRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentCardExplorerUsersPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyCardExplorerUsersPageRouteName;
    }
    return RouteNames.mentorCardExplorerUsersPageRouteName;
  },
  usersRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentCardExplorerUsersPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyCardExplorerUsersPageRouteName;
    }
    return RouteNames.mentorCardExplorerUsersPageRouteName;
  },
});

Template.Explorer_Menu.onRendered(function explorerMenuOnRendered() {
  // console.log('Explorer_Menu');
  const template = this;
  template.$('.ui.dropdown')
    .dropdown();
});
