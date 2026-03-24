# Phase 05: Browser Verification & Polish

This phase uses the agent-browser tool to verify all implemented features work correctly in the browser, identifies any visual or functional issues, and fixes them. This ensures the application is polished and ready for use.

## Tasks

- [ ] Start the development server and verify it's running:
  - Run `npm run dev` in the genie-dashboard directory if not already running
  - Confirm the server is accessible at `http://localhost:3000`
  - Use agent-browser to navigate to the application

- [ ] Verify branding and styling:
  - Use agent-browser to navigate to `http://localhost:3000`
  - Take a screenshot and verify:
    - "Genie Ops" branding appears in sidebar
    - "Genie Ops" appears in the home page title
    - Colors are muted and corporate-appropriate (not too colorful)
    - Logo/avatar shows "GO" initials
  - Document any issues found

- [ ] Verify Dashboard page functionality:
  - Navigate to the home page `/`
  - Take screenshot and verify:
    - Status cards display correct application counts
    - Application Trends chart renders correctly
    - Monthly Statistics chart renders correctly
    - Recent Applications table shows data with progress bars
    - Process Metrics section displays correctly
    - Quick Actions buttons are present and styled correctly
  - Test "View All Applications" button navigation
  - Document any issues found

- [ ] Verify News Verification page improvements:
  - Navigate to `/news-verification`
  - Take screenshot and verify:
    - Status cards display correct counts
    - Search/filter/sort toolbar is present
    - Data table shows articles with proper columns
    - Pagination controls work
    - Row selection works (checkboxes)
    - "News Lead" button is visible in header
  - Test creating a new news lead via the dialog
  - Test search filtering
  - Test CSV export
  - Document any issues found

- [ ] Verify Applications page functionality:
  - Navigate to `/applications`
  - Take screenshot and verify:
    - Status cards display correct counts
    - Data table shows applications with progress bars
    - Status badges have dot indicators
    - Search/filter/sort toolbar is present
    - Pagination controls work
  - Test View button navigation to detail page
  - Document any issues found

- [ ] Verify Application detail pages:
  - Navigate to an application detail page
  - Take screenshot and verify:
    - Workflow stepper shows current stage
    - All sections display correctly
    - Action buttons are present (Advance, Reject)
  - Test status transition
  - Document any issues found

- [ ] Verify sidebar navigation:
  - Take screenshot of the sidebar
  - Verify all navigation items are present:
    - News Verification
    - Community Manager
    - Applications (new)
  - Test navigation to each section
  - Verify active state highlighting works
  - Test collapse/expand functionality
  - Document any issues found

- [ ] Test responsive design on mobile viewport:
  - Use agent-browser to resize to mobile viewport (375px width)
  - Take screenshots of:
    - Dashboard page
    - News Verification page
    - Applications page
  - Verify:
    - Mobile menu button works
    - Cards stack vertically
    - Tables scroll horizontally or adapt
    - Search/filter buttons wrap appropriately
  - Document any issues found

- [ ] Fix identified issues:
  - Review all documented issues from verification steps
  - Prioritize by severity (broken functionality > visual issues)
  - Fix each issue systematically
  - Re-verify each fix with agent-browser

- [ ] Final verification pass:
  - Use agent-browser to do a complete walkthrough of the application
  - Start at `/`, navigate through all sections
  - Take screenshots of key pages
  - Confirm all features work as expected
  - Confirm visual consistency across pages

- [ ] Document any remaining known issues:
  - Create a brief summary of any issues that couldn't be fixed in this phase
  - Note any features that need future work
  - This helps set expectations for the user
