import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { starBulkLoadJsonDataMethod } from '../../../api/star/StarProcessor.methods';
import { getRouteUserName } from '../shared/route-user-name';
// import { updateAllStudentLevelsMethod } from '../../../api/level/LevelProcessor.methods';

/* global FileReader */

Template.Star_Bulk_Upload_Widget.onCreated(function starBulkUploadWidgetOnCreated() {
  this.currentUpload = new ReactiveVar(false);
  this.successClass = new ReactiveVar('');
  this.errorClass = new ReactiveVar('');
  this.result = new ReactiveVar('');
});

Template.Star_Bulk_Upload_Widget.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  uploadResult() {
    return Template.instance().result.get();
  },
});

Template.Star_Bulk_Upload_Widget.events({
  'click .jsStarData': function clickJsStarData(event, instance) {
    event.preventDefault();
    const advisor = getRouteUserName();
    const fileName = event.target.parentElement.getElementsByTagName('input')[0];
    if (fileName.files && fileName.files[0]) {
      const starData = fileName.files[0];
      const fr = new FileReader();
      fr.onload = (e) => {
        const jsonData = JSON.parse(e.target.result);
        // console.log(advisor, jsonData);
        starBulkLoadJsonDataMethod.call({ advisor, jsonData }, (error, result) => {
          if (error) {
            console.log('Error loading bulk STAR data', error);
          }
          instance.result.set(result);
        });
        // updateAllStudentLevelsMethod.call((error) => {
        //   if (error) {
        //     console.log('Error updating all student levels', error);
        //   }
        // });
      };
      fr.readAsText(starData);
    }
  },
});
