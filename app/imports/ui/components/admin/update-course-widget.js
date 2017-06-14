import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import { Courses } from '../../../api/course/CourseCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Update_Course_Widget */

const updateSchema = new SimpleSchema({
  name: String,
  shortName: { type: String, optional: true },
  number: String,
  creditHrs: { type: Number, optional: true, defaultValue: 3 },
  syllabus: { type: String, optional: true },
  description: String,
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
  prerequisites: { type: Array }, 'prerequisites.$': String,
}, { tracker: Tracker });

Template.Update_Course_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Course_Widget.helpers({
  course() {
    return Courses.findDoc(Template.currentData().updateID.get());
  },
  slug() {
    const course = Courses.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(course.slugID).name;
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  courses() {
    return Courses.find({}, { sort: { number: 1 } });
  },
  selectedInterestIDs() {
    const course = Courses.findDoc(Template.currentData().updateID.get());
    return course.interestIDs;
  },
  selectedCourseIDs() {
    const course = Courses.findDoc(Template.currentData().updateID.get());
    return _.map(course.prerequisites, prerequisite => Courses.findIdBySlug(prerequisite));
  },
  prerequisites() {
    return Courses.find({}, { sort: { number: 1 } });
  },
});

Template.Update_Course_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: 'CourseCollection', updateData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});
