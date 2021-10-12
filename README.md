# Activity Bulk Creator (ABC)

*A Google Sheet add-on that makes digitizing hundreds of old runs and rides to Strava easy as ABC.*

## Installing the project

This project is an unpublished add-on, therefore installation involves copying and pasting files from this repository into a Apps Script project already paired with a Google Sheet. Each Apps Script project will also have to import the [OAuth2 library for Google Apps Script](https://script.google.com/macros/library/d/1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF/41) and authorize the Google Sheets service under its default alias, Sheets. 

## Authenticating the add-on

To work properly, this add-on requires the following scopes within your Google Account:

* See, edit, create, and delete all your Google Sheets spreadsheets
* Display and run third-party web content in prompts and sidebars inside Google applications
* Connect to an external service

To authenticate with Strava, click *Check Strava connection* from the dropdown menu. You will be prompted to enter your Strava App's client id and client secret, then you'll perform the regular OAuth dance to authorize the add-on to access your Strava data. Right now, the only scope requested is `activity:write`.

## Setting the stage

Click the *Build sheet* option from the add-ons drop down menu to create a new sheet named Activities. This sheet is pre-populated with the required and optional fields for the [Create Activity endpoint on Strava's API](https://developers.strava.com/docs/reference/#api-Activities-createActivity). Basic information about each field is included as notes for respective cells.

## Entering data

Because this add-on is a proof-of-concept, the onus for properly formatting input values calls upon the user. This version does very little in terms of validating and facilitating user input. I don't know anyone who records the duration and distance of their activities in seconds and meters, but this is what Strava's API expects regarding these two fields. To make it easier entering these fields while still keeping the responsibility for formatting values on the user, there are two custom functions to address this issue: 

* `T2SEC` converts time in HH:MM:SS.ss format into seconds
* `MI2M` converts miles to meters

## Uploading activities

Upload rows of entered data to Strava as manually created activities by selecting the rows you wish you upload and clicking *Upload selected rows* from the dropdown menu. The row turns green if the upload is successful and red if there has been an error.

![Uploading activities](https://i.imgur.com/GzQxU7k.gif)

This add-on uploads selected rows rather than the entire sheet to better handle upload errors. Each row of data is uploaded to Strava individually, so if one row fails, then it won't impede the entire process. The user can then handle error uploads individually. One reason why an upload may fail is if there already exists an activity with the exact same `start_time_local` value.

## Project status

Currently, there are plans to publish this add-on at Google Workspace Marketplace. This alpha version accomplishes the initial goal: quickly create hundreds of manual activities on Strava. The path to a beta version would involve much user-proofing: validating input, handling errors, and testing for edge cases. The return on this investment is unclear, but it appears disappointingly small. I've also already digitized all my old runs, so I'm not planning on using the add-on again. Are there other Strava users who want to spend their valuable freetime digitizing running logs and backfilling one's Strava account with this data? Those that do are probably also developers, and they can quickly get there with this code. But if you're a casual Strava user that would actually like to use this add-on or a dev that is interested in contributing, then reach out.