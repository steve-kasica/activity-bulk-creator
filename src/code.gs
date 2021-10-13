/**
 * Code.gs
 * 
 * The main script for bulk uploading manual activities to Strava. If replicating this script, 
 * you will have to replace the global variables with your own unique client id and client secret 
 * for your API application.
 */

/**
 * onOpen
 * 
 * Add menu controls when spreadsheet is opened.
 */
 function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('ABC')
    .addItem('Build sheet', 'buildSheet_')
    .addItem('Check Strava connection', 'authenticate_')
    .addItem('Upload selected rows', 'uploadActivities_')
    .addItem('Reset Strava connection', 'resetConnection_')
    .addToUi();
}

/**
 * buildSheet_
 * 
 * Create a new sheet with pre-defined field column headers.
 */
function buildSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Activities');
  const fields = new Activity().fields;

  sheet.setFrozenRows(1);
  sheet.deleteColumns(fields.length, sheet.getMaxColumns() - fields.length)
  sheet.getRange('1:1')
    .setFontWeight('bold')
    .setNotes([ fields.map(c => c.note)] )
    .setValues([ fields.map(c => c.name) ]);
  sheet.setColumnWidths(1, fields.length, 150);
}

/**
 * authenticate_
 * 
 * Authenticate this Google Sheets add-on with Strava's API.
 */
function authenticate_() {
  const props = PropertiesService.getScriptProperties(),
        ui = SpreadsheetApp.getUi();

  if (Strava.hasAccess()) {
    ui.alert('Connection Status: 👍');
  } else {
    let res, html, temp, id, secret;

    // Check if user has set API keys
    if (!props.getProperty('CLIENT_ID')) {
      throw Error("Missing the Client ID for your Strava Application");
    }

    if (!props.getProperty('CLIENT_SECRET')) {
      throw Error("Missing the Client Secret for your Strava Application");
    }

    // Authenticate add-on with Strava API for this user
    temp = HtmlService.createTemplateFromFile('auth-modal');
    temp.auth_href = Strava.getAuthUrl();
    html = temp.evaluate();
    ui.showModalDialog(html, 'Authenticate with Strava');
  }

  return null;
}

/**
 * uploadActivities_
 * 
 * The main function that create activities by uploading rows to Strava
 */
function uploadActivities_() {
  if (!Strava.hasAccess()) {
    throw Error('You must authenticate with Strava first.')
  }

  const fields = new Activity().fields;

  const sheet = SpreadsheetApp.getActiveSheet();
  const ui = SpreadsheetApp.getUi();
  let res, body, rowIndex;

  return sheet
    .getSelection()
    .getActiveRangeList()
    .getRanges()
    .forEach(range => {
      // validation the range selection
      if (range.getNumColumns() !== fields.length) {
        throw Error('Selection ' + range.getA1Notation() + ' does not contain all columns');
      }

      range.getValues()
        .map(row => {
          const obj = {};
          SpreadsheetApp
            .getActiveSheet()
            .getRange("A1:Z1")
            .getValues()[0]
            .filter(d => d.length)  // Remove any empty column headers
            .forEach((key, i) => obj[key] = row[i]);
          return obj;
        })
        .map(row => new Activity(row))
        .forEach((activity, i) => {
          res = Strava.createActiviy(activity.params);
          rowIndex = range.getRowIndex() + i;
          if (res.getResponseCode() === 201) {
           sheet.getRange(`${rowIndex}:${rowIndex}`).setBackground('#b7e1cd');
          } else {
            body = JSON.parse(res.getContentText());            
            sheet.getRange(`${rowIndex}:${rowIndex}`).setBackground('red');
            ui.alert('HTTP Response (' + res.getResponseCode() + ') ' + body.message);
          }
        });
    });
}

/**
 * resetConnection_
 * 
 * Resets application authorization for Strava.
 */
function resetConnection_() { 

  // Reset Strava connection
  Strava.reset();

  SpreadsheetApp.getUi().alert('This application has been deauthorized to access the user\'s Strava data.')
  
  return null;
}

/**
 * authCallback_
 * 
 * Handle the OAuth callback, this function is required
 * by the OAuth2 library. It is not called explicitly 
 * in this script.
 */
function authCallback_(request) {
  const temp = HtmlService.createTemplateFromFile('auth-confirm');
  temp.authorized = Strava.handleCallback(request);  
  return temp.evaluate();
}

/**
 * Convert HH:MM:SS.ss formatted time spans into seconds
 * 
 * @param {string} duration An HH:MM.SS formatting string
 * @return The equivalent elapsed time in seconds
 * @customfunction
 */
function T2SEC(duration) {
  duration = duration.trim();
  const format = /(\d?\d)\:(\d\d)\:(\d\d\.\d?\d)/;
  if (!format.test(duration)) { 
    throw Error('"' +duration + '" does not match required HH:MM:SS.ss format');
  }
  let out = 0;
  const groups = format.exec(duration);

  for (let i = 1; i < groups.length; i++) {
    if (groups[i]) {
      out += Number(groups[i]) * Math.pow(60, groups.length - 1 - i);
    }
  }

  return out;

}

/**
 * Convert miles (mi) into meters (m)
 * 
 * @param {number} input A distance in miles
 * @return The equivalent distance in meters
 * @customfunction
 */
function MI2M(input) {
  return input * 1609.34;
}