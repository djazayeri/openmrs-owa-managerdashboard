# Manager Dashboard Open Web App for OpenMRS

## Building

Make sure you have gulp installed: see https://github.com/gulpjs

From the root of this folder, install the gulp dependencies:
> npm install --save-dev gulp
> npm install --save-dev gulp-zip

To build, do:

> gulp

To quickly deploy the build locally, set the LOCAL_OWA_FOLDER in gulpfile and do

> deploy-local


## Required Modules (server-side)

This app requires:

* reporting 0.9.9-SNAPSHOT
* reportingrest 1.6-SNAPSHOT
