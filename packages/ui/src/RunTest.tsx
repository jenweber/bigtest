import React from "react";
import { Box, Color } from 'ink';
import { BTTT } from './BTTT';

/* BTTT Summary
  BTTT? BIG TEST TEXT TEST
    TT = Text Type
      title
      step+, stepx, step-, stepw
        - skip
        w warning (guard fail)
      guar+, guarx
        + pass (verbose)
        x fail
      asrt+, asrtx, asrt-
        - skip
      error
    TC = Tab Count
*/

/* Icon/Display Summary
  ICONS
    assertions
      ✔ successful assertions
      ✕ failed assertions
      - assertions that did not run
    steps
      ● (green) step that ran
      ▲ (red) step if action fails
      ▲ (yellow) if guard fails
      ○ step not ran
    guards
      ● (green) passed guard on verbose
      ✕ faied guard
    error
      error: {error text}
      (need to know what information to expose for ci)
*/

/* Notes
  MIN NOTES
    x new case for when guards pass but step action fails
    x separated cli and ci display cases
      - means we need to detect ci vs cli in the runner?
        - or run verbose by default?
    x wanted to use red circle for failing step action but colorblind ci
    - sidewards drift is inevitable i think

  Implementation Notes
    - we need to clear terminal when we launch cli so that user can't scroll up. kills the magic.
    - when running:
      - cli
        - if animating the tests (scroll down)
          - if successful stay down and show success message at the bottom
          - if fail scroll back up to first error message?
        - if showing progress bar instead
          - if successful just show succ message
          - if fail show the first error message (no scrolling back up)
*/

/* Written Test Overview
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


// CLI

const SuccessCLI = () => {
  return (
    <Box flexDirection="column">
      <BTTT TT="title" TC={0}>Sign in via Modal <Color grey> - min-note: non V</Color></BTTT>
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

const SuccessVerboseCLI = () => {
  return (
    <Box flexDirection="column" paddingTop={1}>
      <BTTT TT="title" TC={0}>Sign in via Modal <Color grey> - min-note: V</Color></BTTT>
      <BTTT TT="step+" TC={1}>create user Bob with password 12345678</BTTT>
      <BTTT TT="step+" TC={1}>visit home</BTTT>
      <BTTT TT="step+" TC={1}>click on sign in button</BTTT>
      <BTTT TT="guar+" TC={2}>check that sign in button exists</BTTT>
      <BTTT TT="step+" TC={1}>filling in the form</BTTT>
      <BTTT TT="step+" TC={2}>filling in username with Bob</BTTT>
      <BTTT TT="guar+" TC={3}>check that username field exists</BTTT>
      <BTTT TT="step+" TC={2}>filling in password with 12345678</BTTT>
      <BTTT TT="guar+" TC={3}>check that password field exists</BTTT>
      <BTTT TT="step+" TC={2}>submitting form</BTTT>
      <BTTT TT="step+" TC={3}>click submit button</BTTT>
      <BTTT TT="guar+" TC={4}>check that submit button exists</BTTT>
      <BTTT TT="asrt+" TC={4}>closes the modal</BTTT>
      <BTTT TT="asrt+" TC={4}>shows the welcome text</BTTT>
      <BTTT TT="step+" TC={3}>press enter to submit</BTTT>
      <BTTT TT="guar+" TC={4}>check that submit button exists</BTTT>
      <BTTT TT="asrt+" TC={4}>closes the modal</BTTT>
      <BTTT TT="asrt+" TC={4}>shows the welcome text</BTTT>
    </Box>
  )
}

const GuardFailCLI = () => {
  return (
    <Box flexDirection="column" paddingTop={1} >
      <BTTT TT="title" TC={0}>Sign in via Modal</BTTT>
      <BTTT TT="step+" TC={1}>create user Bob with password 12345678</BTTT>
      <BTTT TT="step+" TC={1}>visit home</BTTT>
      <BTTT TT="stepw" TC={1}>click on sign in button</BTTT>
      <BTTT TT="guarx" TC={2}>check that sign in button exists</BTTT>
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

const StepFailCLI = () => {
  return (
    <Box flexDirection="column" paddingTop={1} >
      <BTTT TT="title" TC={0}>Sign in via Modal</BTTT>
      <BTTT TT="step+" TC={1}>create user Bob with password 12345678</BTTT>
      <BTTT TT="step+" TC={1}>visit home</BTTT>
      <BTTT TT="stepx" TC={1}>click on sign in button</BTTT>
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

const AssertFailCLI = () => {
  return (
    <Box flexDirection="column" paddingTop={1}>
      <BTTT TT="title" TC={0}>Sign in via Modal</BTTT>
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


// CI

const SuccessVerboseCI = () => {
  return (
    <Box flexDirection="column" paddingTop={1}>
      <BTTT TT="title" TC={0}>Sign in via Modal <Color grey> - min-note: V (ci always v)</Color></BTTT>
      <BTTT TT="step+" TC={1}>create user Bob with password 12345678</BTTT>
      <BTTT TT="step+" TC={1}>visit home</BTTT>
      <BTTT TT="step+" TC={1}>click on sign in button</BTTT>
      <BTTT TT="guar+" TC={2}>check that sign in button exists</BTTT>
      <BTTT TT="step+" TC={1}>filling in the form</BTTT>
      <BTTT TT="step+" TC={2}>filling in username with Bob</BTTT>
      <BTTT TT="guar+" TC={3}>check that username field exists</BTTT>
      <BTTT TT="step+" TC={2}>filling in password with 12345678</BTTT>
      <BTTT TT="guar+" TC={3}>check that password field exists</BTTT>
      <BTTT TT="step+" TC={2}>submitting form</BTTT>
      <BTTT TT="step+" TC={3}>click submit button</BTTT>
      <BTTT TT="guar+" TC={4}>check that submit button exists</BTTT>
      <BTTT TT="asrt+" TC={4}>closes the modal</BTTT>
      <BTTT TT="asrt+" TC={4}>shows the welcome text</BTTT>
      <BTTT TT="step+" TC={3}>press enter to submit</BTTT>
      <BTTT TT="guar+" TC={4}>check that submit button exists</BTTT>
      <BTTT TT="asrt+" TC={4}>closes the modal</BTTT>
      <BTTT TT="asrt+" TC={4}>shows the welcome text</BTTT>
    </Box>
  )
}

const GuardFailCI = () => {
  return (
    <Box flexDirection="column" paddingTop={1} >
      <BTTT TT="title" TC={0}>Sign in via Modal</BTTT>
      <BTTT TT="step+" TC={1}>create user Bob with password 12345678</BTTT>
      <BTTT TT="step+" TC={1}>visit home</BTTT>
      <BTTT TT="stepw" TC={1}>click on sign in button</BTTT>
      <BTTT TT="guarx" TC={2}>check that sign in button exists</BTTT>
      <BTTT TT="error" TC={3}>Modal was not found</BTTT>
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

const StepFailCI = () => {
  return (
    <Box flexDirection="column" paddingTop={1} >
      <BTTT TT="title" TC={0}>Sign in via Modal</BTTT>
      <BTTT TT="step+" TC={1}>create user Bob with password 12345678</BTTT>
      <BTTT TT="step+" TC={1}>visit home</BTTT>
      <BTTT TT="stepx" TC={1}>click on sign in button</BTTT>
      <BTTT TT="error" TC={2}>click("button[name=sign-in]") failed</BTTT>
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

const AssertFailCI = () => {
  return (
    <Box flexDirection="column" paddingTop={1}>
      <BTTT TT="title" TC={0}>Sign in via Modal</BTTT>
      <BTTT TT="step+" TC={1}>create user Bob with password 12345678</BTTT>
      <BTTT TT="step+" TC={1}>visit home</BTTT>
      <BTTT TT="step+" TC={1}>click on sign in button</BTTT>
      <BTTT TT="step+" TC={1}>filling in the form</BTTT>
      <BTTT TT="step+" TC={2}>filling in username with Bob</BTTT>
      <BTTT TT="step+" TC={2}>filling in password with 12345678</BTTT>
      <BTTT TT="step+" TC={2}>submitting form</BTTT>
      <BTTT TT="step+" TC={3}>click submit button</BTTT>
      <BTTT TT="asrtx" TC={4}>closes the modal</BTTT>
      <BTTT TT="error" TC={5}>Whatever reason a modal fails to close</BTTT>
      <BTTT TT="asrt-" TC={4}>shows the welcome text</BTTT>
      <BTTT TT="step+" TC={3}>press enter to submit</BTTT>
      <BTTT TT="asrt+" TC={4}>closes the modal</BTTT>
      <BTTT TT="asrt+" TC={4}>shows the welcome text</BTTT>
    </Box>
  )
}


// Exports

export const RunPassCLI = () => {
  return (
    <Box flexDirection="column">
      <SuccessCLI />
      <SuccessVerboseCLI />
    </Box>
  );
}

export const RunFailCLI = () => {
  return (
    <Box flexDirection="column">
      <GuardFailCLI />
      <StepFailCLI />
      <AssertFailCLI />
    </Box>
  );
}

export const RunPassCI = () => {
  return (
    <Box flexDirection="column">
      <SuccessVerboseCI />
    </Box>
  );
}

export const RunFailCI = () => {
  return (
    <Box flexDirection="column">
      <GuardFailCI />
      <StepFailCI />
      <AssertFailCI />
    </Box>
  );
}

// export const RunTest = () => {
//   return (
//     <Box flexDirection="column">
//     </Box>
//   );
// };
