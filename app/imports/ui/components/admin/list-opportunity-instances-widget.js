import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { opportunityInstancesRemoveItMethod } from '../../../api/opportunity/OpportunityInstanceCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/List_Opportunity_Instances_Widget */

Template.List_Opportunity_Instances_Widget.helpers({
  opportunityInstances() {
    const allOpportunityInstances = OpportunityInstances.find().fetch();
    const sortBySemester = _.sortBy(allOpportunityInstances, function (oi) {
      return Semesters.toString(oi.semesterID, true);
    });
    return _.sortBy(sortBySemester, function (oi) {
      return Users.findSlugByID(oi.studentID);
    });
  },
  count() {
    return OpportunityInstances.count();
  },
  deleteDisabled() {
    return '';
  },
  descriptionPairs(opportunityInstance) {
    return [
      { label: 'Semester', value: Semesters.toString(opportunityInstance.semesterID) },
      { label: 'Opportunity', value: (Opportunities.findDoc(opportunityInstance.opportunityID)).name },
      { label: 'Verified', value: opportunityInstance.verified.toString() },
      { label: 'Student', value: Users.getFullName(opportunityInstance.studentID) },
      { label: 'ICE', value: `${opportunityInstance.ice.i}, ${opportunityInstance.ice.c}, 
        ${opportunityInstance.ice.e}` },
    ];
  },
  name(oi) {
    const oppName = Opportunities.findDoc(oi.opportunityID).name;
    const username = Users.findDoc(oi.studentID).username;
    const semester = Semesters.toString(oi.semesterID, true);
    return `${username}-${oppName}-${semester}`;
  },
});

Template.List_Opportunity_Instances_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event) {
    event.preventDefault();
    const id = event.target.value;
    opportunityInstancesRemoveItMethod.call({ id }, (error) => {
      if (error) {
        console.log('Error removing OpportunityInstance', error);
      }
    });
  },
});
