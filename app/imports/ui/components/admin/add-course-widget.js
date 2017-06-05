import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { Courses } from '../../../api/course/CourseCollection';
import { coursesDefineMethod } from '../../../api/course/CourseCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { feedsDefineNewCourseMethod } from '../../../api/feed/FeedCollection.methods';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Add_Course_Widget */

const addSchema = new SimpleSchema({
  name: { type: String, optional: false },
  slug: { type: String, optional: false, custom: FormUtils.slugFieldValidator },
  shortName: { type: String, optional: true },
  number: { type: String, optional: false },
  creditHrs: { type: Number, optional: true, defaultValue: 3 },
  syllabus: { type: String, optional: true },
  description: { type: String, optional: false },
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
  prerequisites: [String],
});

Template.Add_Course_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, addSchema);
});

Template.Add_Course_Widget.helpers({
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  courses() {
    return Courses.find({}, { sort: { number: 1 } });
  },
});

Template.Add_Course_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const newData = FormUtils.getSchemaDataFromEvent(addSchema, event);
    instance.context.reset();
    addSchema.clean(newData);
    instance.context.validate(newData);
    if (instance.context.isValid()) {
      coursesDefineMethod.call(newData, (error) => {
        if (error) {
          FormUtils.indicateError(instance);
        } else {
          FormUtils.indicateSuccess(instance, event);
          const feedDefinition = {
            course: newData.slug,
            feedType: 'new-course',
          };
          feedsDefineNewCourseMethod.call(feedDefinition);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
});
