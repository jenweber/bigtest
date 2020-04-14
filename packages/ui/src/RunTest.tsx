import React from "react";
import { Box, Color } from 'ink';
import { BTTT } from './BTTT';

/*
  BTTT? BIG TEST TEXT TEST
    TT = Text Type
      title,
      step+, stepx, step-, stepv, stepw
        v = verbose
        w = warning
      asrt+, asrtx, asrt-
      error
    TC = Tab Count

  ICONS
    assertions
      ✔ successful assertions
      ✕ failed assertions
      - assertions that did not run
    steps
      ● step that ran
      ✋ faied gua (on the guard, not error)
      ○ step not ran

  MIN NOTES OH YEAH?
    - sidewards drift is inevitable i think
      - or else we print out all the different branches
      - the sidewards drift allows us to combine the different branches (see assert fail)
    - display error in test run? or put that into details window when user focuses?
    - verbose has green circle and italicized definition
    - we need to clear terminal when we launch cli so that user can't scroll up. kills the magic.
    - when running:
      - if animating the tests (scroll down)
        - if successful stay down and show success message at the bottom
        - if fail scroll back up to first error message?
      - if showing progress bar instead
        - if successful just show succ message
        - if fail show the first error message (no scrolling back up)

Sign in via Modal
  step - create bob with pass
  step - visit home
  step - click sign in button
    guard - check for sign in button
  child {
    "sign in"
      "filling in the form"
        step - fill in username
          guard - check for username field
        step - fill password
          guard - check for pass field
        child {
          "submitting form"
          child {
            "click on submit button"
              guard - check submit button
              assert - modal closed
              assert - welcome text match
            "press enter to submit"
              guard - check submit button
              assert - modal closed
              assert - welcome text match
          }
        }
  }
*/

const Success = () => {
  return (
    <Box flexDirection="column">
      <BTTT TT="title" TC={0}>Sign in via Modal <Color green>(Success)</Color></BTTT>
      <BTTT TT="step+" TC={1}>create user Bob with password 12345678</BTTT>
      <BTTT TT="step+" TC={1}>visit home</BTTT>
      <BTTT TT="step+" TC={1}>click on sign in button</BTTT>
      <BTTT TT="step+" TC={1}>filling in the form</BTTT>
      <BTTT TT="step+" TC={2}>filling in username with Bob</BTTT>
      <BTTT TT="step+" TC={2}>filling in password with 12345678</BTTT>
      <BTTT TT="step+" TC={2}>submitting form</BTTT>
      <BTTT TT="step+" TC={3}>click submit button</BTTT>
      <BTTT TT="asrt+" TC={4}>closes the modal</BTTT>
      <BTTT TT="asrt+" TC={4}>shows the welcome text</BTTT>
      <BTTT TT="step+" TC={3}>press enter to submit</BTTT>
      <BTTT TT="asrt+" TC={4}>closes the modal</BTTT>
      <BTTT TT="asrt+" TC={4}>shows the welcome text</BTTT>
    </Box>
  )
}

const SuccessVerbose = () => {
  return (
    <Box flexDirection="column" paddingTop={1}>
      <BTTT TT="title" TC={0}>Sign in via Modal <Color green>(Success Verbose)</Color></BTTT>
      <BTTT TT="step+" TC={1}>create user Bob with password 12345678</BTTT>
      <BTTT TT="step+" TC={1}>visit home</BTTT>
      <BTTT TT="step+" TC={1}>click on sign in button</BTTT>
      <BTTT TT="stepv" TC={2}>check that sign in button exists</BTTT>
      <BTTT TT="step+" TC={1}>filling in the form</BTTT>
      <BTTT TT="step+" TC={2}>filling in username with Bob</BTTT>
      <BTTT TT="stepv" TC={3}>check that username field exists</BTTT>
      <BTTT TT="step+" TC={2}>filling in password with 12345678</BTTT>
      <BTTT TT="stepv" TC={3}>check that password field exists</BTTT>
      <BTTT TT="step+" TC={2}>submitting form</BTTT>
      <BTTT TT="step+" TC={3}>click submit button</BTTT>
      <BTTT TT="stepv" TC={4}>check that submit button exists</BTTT>
      <BTTT TT="asrt+" TC={4}>closes the modal</BTTT>
      <BTTT TT="asrt+" TC={4}>shows the welcome text</BTTT>
      <BTTT TT="step+" TC={3}>press enter to submit</BTTT>
      <BTTT TT="stepv" TC={4}>check that submit button exists</BTTT>
      <BTTT TT="asrt+" TC={4}>closes the modal</BTTT>
      <BTTT TT="asrt+" TC={4}>shows the welcome text</BTTT>
    </Box>
  )
}

const GuardFail = () => {
  return (
    <Box flexDirection="column" paddingTop={1} >
      <BTTT TT="title" TC={0}>Sign in via Modal <Color red>(Guard Fail)</Color></BTTT>
      <BTTT TT="step+" TC={1}>create user Bob with password 12345678</BTTT>
      <BTTT TT="step+" TC={1}>visit home</BTTT>
      <BTTT TT="stepw" TC={1}>click on sign in button</BTTT>
      <BTTT TT="stepx" TC={2}>check that sign in button exists</BTTT>
      <BTTT TT="error" TC={5}>Modal was not found</BTTT>
      <BTTT TT="step-" TC={1}>filling in the form</BTTT>
      <BTTT TT="step-" TC={2}>filling in username with Bob</BTTT>
      <BTTT TT="step-" TC={2}>filling in password with 12345678</BTTT>
      <BTTT TT="step-" TC={2}>submitting form</BTTT>
      <BTTT TT="step-" TC={3}>click submit button</BTTT>
      <BTTT TT="asrt-" TC={4}>closes the modal</BTTT>
      <BTTT TT="asrt-" TC={4}>shows the welcome text</BTTT>
      <BTTT TT="step-" TC={3}>press enter to submit</BTTT>
      <BTTT TT="asrt-" TC={4}>closes the modal</BTTT>
      <BTTT TT="asrt-" TC={4}>shows the welcome text</BTTT>
    </Box>
  )
}

const AssertFail = () => {
  return (
    <Box flexDirection="column" paddingTop={1}>
      <BTTT TT="title" TC={0}>Sign in via Modal <Color red>(Assert Fail)</Color></BTTT>
      <BTTT TT="step+" TC={1}>create user Bob with password 12345678</BTTT>
      <BTTT TT="step+" TC={1}>visit home</BTTT>
      <BTTT TT="step+" TC={1}>click on sign in button</BTTT>
      <BTTT TT="step+" TC={1}>filling in the form</BTTT>
      <BTTT TT="step+" TC={2}>filling in username with Bob</BTTT>
      <BTTT TT="step+" TC={2}>filling in password with 12345678</BTTT>
      <BTTT TT="step+" TC={2}>submitting form</BTTT>
      <BTTT TT="step+" TC={3}>click submit button</BTTT>
      <BTTT TT="asrtx" TC={4}>closes the modal</BTTT>
      <BTTT TT="asrt-" TC={4}>shows the welcome text</BTTT>
      <BTTT TT="step+" TC={3}>press enter to submit</BTTT>
      <BTTT TT="asrt+" TC={4}>closes the modal</BTTT>
      <BTTT TT="asrt+" TC={4}>shows the welcome text</BTTT>
    </Box>
  )
}


export const RunTest = () => {
  return (
    <Box flexDirection="column">
      <Success />
      <SuccessVerbose />
      <GuardFail />
      <AssertFail />
    </Box>
  );
};
