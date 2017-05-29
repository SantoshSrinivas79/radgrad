import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { opportunityInstancesDefineMethod } from '../../../api/opportunity/OpportunityInstanceCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection';
import { Feeds } from '../../../api/feed/FeedCollection.js';
import { feedsDefineNewVerifiedOpportunityMethod } from '../../../api/feed/FeedCollection.methods';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection.js';
import {
  verificationRequestsDefineMethod,
  verificationRequestsUpdateStatusMethod,
} from '../../../api/verification/VerificationRequestCollection.methods';

// /** @module ui/components/shared/Verification_Event */

Template.Verification_Event.helpers({
  events() {
    return Opportunities.find({ eventDate: { $exists: true } }).fetch();
  },
  eventDate(event) {
    const m = moment(event.eventDate);
    return m.format('MM/DD/YY');
  },
});

Template.Verification_Event.events({
  submit: function submit(event) {
    event.preventDefault();
    const opportunityID = event.target.elements[0].selectedOptions[0].value;
    const student = event.target.elements[1].value;
    const opportunity = Opportunities.findDoc(opportunityID);
    const opportunitySlug = Slugs.findDoc(opportunity.slugID).name;
    const semester = Semesters.getSemesterDoc(opportunity.eventDate);
    const semesterSlug = Slugs.findDoc(semester.slugID).name;
    try {
      const studentID = Users.getID(student);
      const studentDoc = Users.findDoc(studentID);
      const opportunityInstances = OpportunityInstances.find({ opportunityID, studentID }).fetch();
      let opportunityInstance = null;
      if (opportunityInstances.length === 0) { // student didn't plan on attending in degree plan
        opportunityInstancesDefineMethod.call({ student, semester: semesterSlug,
          verified: true, opportunity: opportunitySlug }, (error, result) => {
          if (error) {
            console.log('Error defining OpportunityInstance', error);
          } else {
            verificationRequestsDefineMethod.call({ student: studentDoc.username, opportunityInstance: result },
                (err, res) => {
                  if (err) {
                    console.log('Error defining VerificationRequest', err);
                  } else {
                    const requestID = res;
                    const request = VerificationRequests.findDoc(requestID);
                    request.status = VerificationRequests.ACCEPTED;
                    const processRecord = {};
                    processRecord.date = new Date();
                    processRecord.status = VerificationRequests.ACCEPTED;
                    processRecord.verifier = Users.getFullName(Meteor.userId());
                    const studentFullName = Users.getFullName(studentDoc._id);
                    processRecord.feedback = `${studentFullName} attended ${opportunity.name}`;
                    request.processed.push(processRecord);
                    const status = VerificationRequests.ACCEPTED;
                    const processed = request.processed;
                    verificationRequestsUpdateStatusMethod.call({ requestID, status, processed }, (err1) => {
                      if (err1) {
                        console.log('Error updating VerificationRequest status', err1);
                      }
                    });
                    if (Feeds.checkPastDayFeed('verified-opportunity', opportunityID)) {
                      Feeds.updateVerifiedOpportunity(studentDoc.username,
                        Feeds.checkPastDayFeed('verified-opportunity', opportunityID));
                    } else {
                      const feedDefinition = {
                        user: [studentDoc.username],
                        opportunity: opportunitySlug,
                        semester: semesterSlug,
                        feedType: 'verified-opportunity',
                      };
                      feedsDefineNewVerifiedOpportunityMethod.call(feedDefinition);
                    }
                  }
                });
          }
        });
      } else {
        opportunityInstance = opportunityInstances[0];
        OpportunityInstances.updateVerified(opportunityInstance._id, true);
        verificationRequestsDefineMethod.call({
          student: studentDoc.username,
          opportunityInstance,
        }, (error, result) => {
          if (error) {
            console.log('Error defining VerificationRequest', error);
          } else {
            const requestID = result;
            const request = VerificationRequests.findDoc(requestID);
            request.status = VerificationRequests.ACCEPTED;
            const processRecord = {};
            processRecord.date = new Date();
            processRecord.status = VerificationRequests.ACCEPTED;
            processRecord.verifier = Users.getFullName(Meteor.userId());
            const studentFullName = Users.getFullName(studentDoc._id);
            processRecord.feedback = `${studentFullName} attended ${opportunity.name}`;
            request.processed.push(processRecord);
            const status = VerificationRequests.ACCEPTED;
            const processed = request.processed;
            verificationRequestsUpdateStatusMethod.call({ requestID, status, processed }, (err) => {
              if (err) {
                console.log('Error updating VerificationRequest status', err);
              }
            });
            if (Feeds.checkPastDayFeed('verified-opportunity', opportunityID)) {
              Feeds.updateVerifiedOpportunity(studentDoc.username,
                  Feeds.checkPastDayFeed('verified-opportunity', opportunityID));
            } else {
              const feedDefinition = {
                user: [studentDoc.username],
                opportunity: opportunitySlug,
                semester: semesterSlug,
                feedType: 'verified-opportunity',
              };
              feedsDefineNewVerifiedOpportunityMethod.call(feedDefinition);
            }
          }
        });
      }
    } catch (e) {
      alert(`${student} is not a valid student. ${e}`); // eslint-disable-line no-undef, no-alert
    }
  },
});


Template.Verification_Event.onRendered(function eventVerificationOnRendered() {
  this.$('.dropdown').dropdown({
    // action: 'select',
  });
});
