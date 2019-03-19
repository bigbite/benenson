# Contributing to Benenson
Thank you for your interest in contributing to Benenson! Your efforts will support not only users of the theme, but also the wider [Amnesty international](https://amnesty.eu) movement!  
There are several ways you can contribute, and not just by writing code. This document outlines some of the ways you can get involved.  
First things first, though: we want to ensure a safe environment for all contributors; therefore, you are expected to adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Pull Requests
We welcome PRs of any kind: hotfixes, features, translations, documentation, etc.  
Please avoid committing directly to master. Create a new branch from `develop`, and submit a Pull Request to `develop` once complete.  
Please use the imperative form in your commit messages e.g. `Fix PHP Warning thrown by a_funtion_name`, or `Implement my awesome new feature`, and try to keep commit messages terse (aim for a maximum of 50 characters). Further detail can be added using the commit description, if required.  
If responding to an existing issue, please use the description to reference the issue in question.  
If making PHP changes involving static strings, please ensure you use the appropriate gettext helper methods available in WP (`__()`, `_x()`, etc), and update the POT & PO files (located in `/languages/`) using [Poedit](https://poedit.net/).  
Please also ensure that your changes pass all linting tasks (`yarn lint`), and that you adhere to the [WordPress VIP Coding Standards](https://github.com/Automattic/VIP-Coding-Standards).

## Submitting Issues
Before submitting an issue, please check through the existing issues to see if it has already been filed. If you find your issue listed, and would like to add your support, please add a reaction—👍 or 👎—rather than a simple `+1` comment. If you have further information or context to add, though, please do add your comments.  
If you cannot find your issue listed—whether it's a question, feature request, or bug report—open an issue using the appropriate template, and we'll do our best to help.

## Reporting Security Vulnerabilities
We take security seriously. If you discover a security issue in Benenson, we'd appreciate it if you would responsibly disclose your findings, and avoid submitting an issue.  
Instead, please report your issue [via email](security@benenson.co), following these simple guidelines:  
- provide details of the vulnerability, including step-by-step instructions on how to reproduce it  
- if applicable, provide a proof of concept  
- give us reasonable time to investigate, respond to, and correct the issue before making any information public  
You will be credited for any confirmed, responsibly disclosed security issue in the patch which closes it.
