import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Semesters } from '../../../api/semester/SemesterCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';


Template.Student_Explorer_Courses_Widget_Button.helpers({
  equals(a, b) {
    return a === b;
  },
  yearSemesters(year) {
    const semesters = [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];
    return semesters;
  },
  nextYears(amount) {
    const nextYears = [];
    const currentSemesterID = Semesters.getCurrentSemester();
    const currentSem = Semesters.findDoc(currentSemesterID);
    let currentYear = currentSem.year;
    for (let i = 0; i < amount; i += 1) {
      nextYears.push(currentYear);
      currentYear += 1;
    }
    return nextYears;
  },
  existingSemesters() {
    const semesters = [];
    const course = this.course;
    const ci = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    _.map(ci, (c) => {
      semesters.push(Semesters.toString(c.semesterID, false));
    });
    return semesters;
  },
});

Template.Student_Explorer_Courses_Widget_Button.events({
  'click .addToPlan': function clickItemAddToPlan(event) {
    event.preventDefault();
    const course = this.course;
    const semester = event.target.text;
    const courseSlug = Slugs.findDoc({ _id: course.slugID });
    const semSplit = semester.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const username = getRouteUserName();
    const ci = {
      semester: semSlug,
      course: courseSlug,
      verified: false,
      note: course.number,
      grade: '***',
      student: username,
    };
    CourseInstances.define(ci);
  },
  'click .removeFromPlan': function clickItemRemoveFromPlan(event) {
    event.preventDefault();
    const course = this.course;
    const semester = event.target.text;
    const semSplit = semester.split(' ');
    const semSlug = `${semSplit[0]}-${semSplit[1]}`;
    const semID = Semesters.getID(semSlug);
    const ci = CourseInstances.find({
      studentID: getUserIdFromRoute(),
      courseID: course._id,
      semesterID: semID,
    }).fetch();
    if (ci > 1) {
      console.log('Too many course instances found for a single semester.');
    }
    CourseInstances.removeIt(ci[0]._id);
  },
});

Template.Student_Explorer_Courses_Widget_Button.onRendered(function studentExplorerCoursesWidgetButtonOnRendered() {
  const template = this;
  template.$('.chooseYear')
      .popup({
        on: 'click',
      });
  template.$('.chooseSemester')
      .popup({
        on: 'click',
      });
});