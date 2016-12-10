/**
 * Created by Cam on 12/7/2016.
 */
/* eslint max-len: "off" */

/** @module FeedbackDefinitions */

/**
 * Provides an array containing HelpMessages for the different pages.
 */
export const helpMessageDefinitions = [
  {
    routeName: 'Admin_Home_Page',
    title: 'Admin Home Page Help',
    text: 'Help text.',
  },
  {
    routeName: 'Admin_Crud_Page',
    title: 'Admin CRUD Page Help',
    text: 'Help text.',
  },
  {
    routeName: 'Advisor_Student_Configuration_Page',
    title: 'Setting up a new Student.',
    text: 'You can update a student\'s degree plan, or view the student\'s current degree plan.',
  },
  {
    routeName: 'Advisor_Verification_Requests_Pending_Page',
    title: 'Advisor Verification Requests Pending Page Help',
    text: 'Help text.',
  },
  {
    routeName: 'Advisor_Event_Verification_Page',
    title: 'Advisor Event Verification Page Help',
    text: 'Help text.',
  },
  {
    routeName: 'Advisor_Completed_Verifications_Page',
    title: 'Advisor Completed Verifications Page Help',
    text: 'Help text.',
  },
  {
    routeName: 'Faculty_Home_Page',
    title: 'Faculty Home Page Help',
    text: 'Help text.',
  },
  {
    routeName: 'Mentor_Home_Page',
    title: 'Mentor Home Page Help',
    text: 'Help text.',
  },
  {
    routeName: 'Student_Home_Page',
    title: 'Learn about your home page',
    text: '<p>Your home page provides the latest information on your degree plan.</p>\n\n<p>The Content of Interest pane provides information on selected opportunities and courses that we hope will be of interest to you based on your selected interests and career goals. Click "View More" to go to a page with details, "Add to plan" to add it to your Degree Plan, and "Hide" if you\'re not interested in this content and don\'t want to see it in your feed.</p>\n\n<p>The ICS Teaser pane provides very short videos by ICS community members. When you have a spare moment, take a look at a video or two! </p>\n\n<p>Finally, the Recent Community Activity pane gives you a sense of what other ICS students are doing.</p>\n\n<p>(If you want to remove this help pane from this page, click on the "X" in the upper right corner to hide it. You can always bring it back from your profile page.)</p>',
  },
  {
    routeName: 'Student_AboutMe',
    title: 'Student About Me Help',
    text: 'Help text.',
  },
  {
    routeName: 'Student_Levels',
    title: 'Student Levels Help',
    text: 'Help text.',
  },
  {
    routeName: 'Student_Ice',
    title: 'Learn about ICE',
    text: '<div class="active content">\n<p>ICE points are a way for students to gauge the progression and balance of innovation, competency, and experience in their ICS degree program.</p>\n<p>There are three graphs that display your ICE score: <span class="innovation">Innovation (blue)</span>, <span class="competency">Competence (green)</span>, and <span class="experience">Experience (orange)</span>. The total amount of possible points for each graph is 100. Each graph has a dark fill, and a light fill. The dark fill represents the actual amount of points you have. These are points gathered from completing and getting approval from various events. The light fill represents the projected amount of points you have. These are the amount of points that you will have after completing and getting approval from all events on your schedule plan. This includes future events that have yet to occur. The fraction on the inside of the graph is a numerical representation of the same data. The first number is the amount of actual points you have, and the second number is the amount of projected points you have.</p>\n\n<div class="ui equal width grid container">\n<div class="row"><div class="column"><div class="ui equal width grid container"><div class="row"><div style="margin-left:auto; margin-right:auto" class="c100 p100 blue"><span>I</span><div class="slice"><div class="bar"></div><div class="fill"></div></div></div></div><div class="centered row"><h3 class="ui header">Innovation</h3></div><div class="row"> <p>Students can gain Innovation points by completing the following actions:</p></div><div class="row">    <div class="ui list">    <div class="item">    <div class="content">    <a class="header">Complete a personal ICS related project.</a><div class="description">This includes web development, mobile app development, algorithm research, etc.</div></div></div><div class="item">    <div class="content">    <a class="header">Participate in a public competitive computer science event.</a><div class="description">This includes hackathons, cybersecurity competitions, coding competitions, etc.</div></div></div><div class="item">    <div class="content">    <a class="header">Contribute to an open source project.</a><div class="description">Credit will be given for substantial contributions, as decided by the adviser.</div></div></div></div></div></div></div><div class="column">    <div class="ui equal width grid container">    <div class="row">    <div style="margin-left:auto; margin-right:auto" class="c100 p100 green">    <span>C</span>    <div class="slice">    <div class="bar"></div>    <div class="fill"></div>   </div>    </div>    </div>    <div class="centered row">    <h3 class="ui header">Competency</h3>    </div>    <div class="row">    <p>Students can gain Competency points by completing the following actions:</p></div><div class="row">    <div class="ui list">    <div class="item">    <div class="content">    <a class="header">Complete an ICS course with a B- or higher.</a><div class="description">These courses must appear on your STAR records.</div></div></div><div class="item">    <div class="content">    <a class="header">Achieve a semester GPA of at least a 3.0.</a><div class="description">The GPA must appear on your STAR records.</div></div></div></div></div></div></div><div class="column">    <div class="ui equal width grid container">    <div class="row">    <div style="margin-left:auto; margin-right:auto" class="c100 p100 orange">    <span>E</span>    <div class="slice">    <div class="bar"></div>    <div class="fill"></div>    </div>    </div>    </div>    <div class="centered row">    <h3 class="ui header">Experience</h3>    </div>    <div class="row">    <p>Students can gain Experience points by completing the following actions:</p></div><div class="row">    <div class="ui list">    <div class="item">    <div class="content">    <a class="header">Complete an ICS related internship.</a><div class="description">This internship must appear on your RadGrad account.</div></div></div><div class="item">    <div class="content">    <a class="header">Work at an ICS related job for a semester.</a><div class="description">This opportunity must appear on your RadGrad account.</div></div></div><div class="item">    <div class="content">    <a class="header">Participate in a study under a professor.</a><div class="description">This opportunity must appear on your RadGrad account.</div></div></div><div class="item">    <div class="content">    <a class="header">Attend a professional networking event.</a><div class="description">This includes ACM\'s Professional Interaction Night, Wetware Wednesdays, etc.</div></div></div><div class="item">    <div class="content">    <a class="header">Attend a professional development workshop.</a><div class="description">This includes resume workshops, Techfolio workshops, etc.</div></div></div><div class="item">    <div class="content">    <a class="header">Attend a technical talk.</a><div class="description">This includes formal talks given by graduate students, professors, and outside professionals.</div></div></div></div></div></div></div></div></div></div>',
  },
  {
    routeName: 'Student_Degree_Planner_Page',
    title: 'Modify Your Degree Plan',
    text: 'Stuff',
  },
  {
    routeName: 'Student_MentorSpace_Page',
    title: 'Student MentorSpace Page Help',
    text: 'Help text.',
  },
  {
    routeName: 'Student_Explorer_Page',
    title: 'Student Explorer Page Help',
    text: 'Help text.',
  },
  {
    routeName: 'Student_Explorer_Degree_Page',
    title: 'Student Explorer Degree Page Help',
    text: 'Help text.',
  },
  {
    routeName: 'Student_Explorer_Course_Page',
    title: 'Student Explorer Course Page Help',
    text: 'Help text.',
  },
  {
    routeName: 'Student_Explorer_Interest_Page',
    title: 'Student Explorer Interest Page Help',
    text: 'Help text.',
  },
  {
    routeName: 'Student_Explorer_Opportunity_Page',
    title: 'Student Explorer Opportunity Page Help',
    text: 'Help text.',
  },
  {
    routeName: 'Student_Explorer_Career_Page',
    title: 'Student Explorer Career Page Help',
    text: 'Help text.',
  },
];
