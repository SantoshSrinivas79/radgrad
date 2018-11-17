import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Showdown } from 'meteor/markdown';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import * as FormUtils from '../form-fields/form-field-utilities';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

const updateSchema = new SimpleSchema({
  name: String,
  description: String,
  retired: Boolean,
}, { tracker: Tracker });


Template.Update_Academic_Plan_Widget.onCreated(function updateAcademicPlanWidgetOnCreated() {
  this.plan = new ReactiveVar('');
  if (this.data.academicPlan) {
    this.plan.set(this.data.academicPlan);
  }
  FormUtils.setupFormWidget(this, updateSchema);
});

/* eslint-disable new-cap */

Template.Update_Academic_Plan_Widget.helpers({
  getPlan() {
    return Template.instance().plan;
  },
  markdownify(obj) {
    return (typeof obj === 'string') ? new Showdown.converter().makeHtml(obj) : obj;
  },
  academicPlan() {
    return AcademicPlans.findDoc(Template.currentData()
      .updateID
      .get());
  },
  slug() {
    const plan = AcademicPlans.findDoc(Template.currentData()
      .updateID
      .get());
    return Slugs.findDoc(plan.slugID).name;
  },
  falseValueRetired() {
    const plan = AcademicPlans.findDoc(Template.currentData()
      .updateID
      .get());
    return !plan.retired;
  },
  trueValueRetired() {
    const plan = AcademicPlans.findDoc(Template.currentData()
      .updateID
      .get());
    return plan.retired;
  },
});

Template.Update_Academic_Plan_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    updateData.retired = updateData.retired === 'true';
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: AcademicPlans.getCollectionName(), updateData }, (error) => {
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

Template.Update_Academic_Plan_Widget.onRendered(function updateAcademicPlanWidgetOnRendered() {
  // add your statement here
});

Template.Update_Academic_Plan_Widget.onDestroyed(function updateAcademicPlanWidgetOnDestroyed() {
  // add your statement here
});

