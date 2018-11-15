import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';

Template.Landing_Card_Explorer_Degrees_Page.helpers({
  addedDegrees() {
    return _.filter(DesiredDegrees.find({}, { sort: { name: 1 } }).fetch(), (d) => !d.retired);
  },
  nonAddedDegrees() {
    return [];
  },
});
