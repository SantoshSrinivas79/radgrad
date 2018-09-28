import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';

Template.Card_Explorer_Opportunities_Page.helpers({
  addedOpportunities() {
    const addedOpportunities = [];
    const allOpportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
    const userID = getUserIdFromRoute();
    const group = FlowRouter.current().route.group.name;
    if (group === 'faculty') {
      return _.filter(allOpportunities, o => o.sponsorID === userID);
    } else if (group === 'student') {
      _.forEach(allOpportunities, (opportunity) => {
        const oi = OpportunityInstances.find({
          studentID: userID,
          opportunityID: opportunity._id,
        })
          .fetch();
        if (oi.length > 0) {
          addedOpportunities.push(opportunity);
        }
      });
    }
    return addedOpportunities;
  },
  nonAddedOpportunities() {
    const allOpportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
    const userID = getUserIdFromRoute();
    const group = FlowRouter.current().route.group.name;
    if (group === 'faculty') {
      return _.filter(allOpportunities, o => o.sponsorID !== userID);
    } else if (group === 'student') {
      const nonAddedOpportunities = _.filter(allOpportunities, function (opportunity) {
        const oi = OpportunityInstances.find({
          studentID: userID,
          opportunityID: opportunity._id,
        })
          .fetch();
        if (oi.length > 0) {
          return false;
        }
        return true;
      });
      return nonAddedOpportunities;
    }
    return allOpportunities;
  },
});
