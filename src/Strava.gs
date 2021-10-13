/**
 * Strava.gs
 * 
 * A small API for Strava's web service
 */

 var Strava = (function() {
  var base = 'https://www.strava.com/api/v3/';
  var tokenUrl = 'https://www.strava.com/oauth/token';
  var scope = 'activity:write';

  this.createActiviy = function(payload) {
    var url = base + 'activities';
    var service = getService_();
    if (service.hasAccess()) {
      var accessToken = service.getAccessToken();
      var options = {
        'method': 'post',
        'headers': {
          Authorization: 'Bearer ' + accessToken
        },
        'payload': payload,
        'muteHttpExceptions': true
      };

      return UrlFetchApp.fetch(url, options);
    }
  }  

  this.auth = function() { return getService_().authorize(); }

  this.getAuthUrl = function() { return getService_().getAuthorizationUrl(); }

  this.hasAccess = function() { return getService_().hasAccess(); }

  this.reset = function() { return getService_().reset(); }

  this.handleCallback = function(req) { return getService_().handleCallback(req); }

  return this;

  /**
   * getService_
   * 
   * Configures the service. Three required and optional parameters are not specified
   * because the library creates the authorization URL with them
   * automatically: `redirect_url`, `response_type`, and `state`.
   */
  function getService_() {
    var id = PropertiesService.getScriptProperties().getProperty('CLIENT_ID');
    var secret = PropertiesService.getScriptProperties().getProperty('CLIENT_SECRET');

    return OAuth2.createService('Strava')
        // Set the endpoint URLs.
        .setAuthorizationBaseUrl('https://www.strava.com/oauth/authorize')
        .setTokenUrl(tokenUrl)
  
        // Set the client ID and secret.
        .setClientId(id)
        .setClientSecret(secret)
        
        // Set the permission scope
        .setParam('scope', scope)
  
        // Set the name of the callback function that should be invoked to
        // complete the OAuth flow.
        .setCallbackFunction('authCallback_')
  
        // Set the property store where authorized tokens should be persisted.
        .setPropertyStore(PropertiesService.getUserProperties());
  }
  
})();