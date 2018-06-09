import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';

Template.Admin_DataModel_Menu.helpers({
  academicPlansRouteName() {
    return RouteNames.adminDataModelAcademicPlansPageRouteName;
  },
  careerGoalsRouteName() {
    return RouteNames.adminDataModelCareerGoalsPageRouteName;
  },
  courseInstancesRouteName() {
    return RouteNames.adminDataModelCourseInstancesPageRouteName;
  },
  coursesRouteName() {
    return RouteNames.adminDataModelCoursesPageRouteName;
  },
  helpMessagesRouteName() {
    return RouteNames.adminDataModelHelpMessagesPageRouteName;
  },
  interestsRouteName() {
    return RouteNames.adminDataModelInterestsPageRouteName;
  },
  mentorAnswerRouteName() {
    return RouteNames.adminDataModelMentorAnswersPageRouteName;
  },
  mentorQuestionRouteName() {
    return RouteNames.adminDataModelMentorQuestionsPageRouteName;
  },
  opportunitiesRouteName() {
    return RouteNames.adminDataModelOpportunitiesPageRouteName;
  },
  opportunityInstancesRouteName() {
    return RouteNames.adminDataModelOpportunityInstancesPageRouteName;
  },
  planChoiceRouteName() {
    return RouteNames.adminDataModelPlanChoicePageRouteName;
  },
  reviewsRouteName() {
    return RouteNames.adminDataModelReviewsPageRouteName;
  },
  teasersRouteName() {
    return RouteNames.adminDataModelTeasersPageRouteName;
  },
  usersRouteName() {
    return RouteNames.adminDataModelUsersPageRouteName;
  },
});
