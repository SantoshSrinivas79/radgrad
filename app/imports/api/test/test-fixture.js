import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicPlans } from '../degree-plan/AcademicPlanCollection';
import { Courses } from '../../api/course/CourseCollection.js';
import { CourseInstances } from '../../api/course/CourseInstanceCollection.js';
import { Feedbacks } from '../../api/feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../../api/feedback/FeedbackInstanceCollection.js';
import { DesiredDegrees } from '../degree-plan/DesiredDegreeCollection';
import { Interests } from '../../api/interest/InterestCollection.js';
import { InterestTypes } from '../../api/interest/InterestTypeCollection.js';
import { Opportunities } from '../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../api/opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../../api/opportunity/OpportunityTypeCollection.js';
import { Teasers } from '../../api/teaser/TeaserCollection';
import { Users } from '../../api/user/UserCollection';
import { CareerGoals } from '../../api/career/CareerGoalCollection';
import { Semesters } from '../../api/semester/SemesterCollection.js';
import { ValidUserAccounts } from '../../api/user/ValidUserAccountCollection';
import { VerificationRequests } from '../../api/verification/VerificationRequestCollection.js';
import { restoreCollection } from '../../api/utility/fixture-utilities';

/* global Assets */

/** @module api/test/test-fixture */

// TODO rewrite this to use RadGrad.collections and to not be copy-pasted from the DB restoration code.
/**
 *
 */
export function defineTestFixture(fixtureName) {
  const restoreFileName = `database/testing/${fixtureName}`;
  console.log(`    (Restoring test fixture from file ${restoreFileName}.)`); // eslint-disable-line
  const restoreJSON = JSON.parse(Assets.getText(restoreFileName));
  // The list of collections, ordered so that they can be sequentially restored.
  const collectionList = [Semesters, InterestTypes, Interests, CareerGoals, DesiredDegrees,
    ValidUserAccounts, Users, OpportunityTypes, Opportunities, Courses, Feedbacks, Teasers,
    CourseInstances, OpportunityInstances, FeedbackInstances,
    VerificationRequests, AcademicPlans];

  // const restoreNames = _.map(restoreJSON.collections, obj => obj.name);
  // const collectionNames = _.map(collectionList, collection => collection._collectionName);
  // const extraRestoreNames = _.difference(restoreNames, collectionNames);
  // const extraCollectionNames = _.difference(collectionNames, restoreNames);

  // if (extraRestoreNames.length) {
  //   console.log(`Error: Expected collections are missing from collection list: ${extraRestoreNames}`);
  // }
  // if (extraCollectionNames.length) {
  //   console.log(`Error: Expected collections are missing from restore JSON file: ${extraCollectionNames}`);
  // }

  // if (!extraRestoreNames.length && !extraCollectionNames.length) {
  _.each(collectionList, collection => restoreCollection(collection, restoreJSON, false));
  // }
}
