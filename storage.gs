// default issue fields/columns for issue listings
var jiraColumnDefault = [
  'summary',
  'issuetype',
  'priority',
  'status',
  'updated',
  'assignee',
  'duedate',
  'project'
];

/**
 * @desc Helper to check if server settings are available
 * @param alert {boolean}  TRUE=prompts a Browser message box, FALSE=returns boolean
 * @return {boolean}
 */
function hasSettings(alert) {
  initDefaults();

  var available = getCfg('available');
  var url = getCfg('jira_url');
  var username = getCfg('jira_username');
  var password = getCfg('jira_password');

  if(available === undefined || !username || !password || !url) {
    if(alert) Browser.msgBox("Jira Error", 
                   "Please configure the Jira Settings first!\\n\\n" +
                   '"Add-ons -> Jira Sheet Tools -> Settings"', Browser.Buttons.OK);
    return false;
  }

  /*
   * backwards compatibility <0.12.0 jira url http vs https
   * Until v0.12.0 we expected settings for Jira domain/url to be domain name only
   * and assumed its always running under https .
   * Now we have user enter full url including the scheme in case he wants to use http:// over https:// .
   */
  if( url.indexOf('http') != 0 ) { //catched both 'http' and 'https' at beginning of url
    // old var, need to attached https as default scheme
    url = 'https://' + url;
    setCfg('jira_url', url);
  }
  
  return true;
}

/**
 * @desc Short Helper to set a server config property into users storage
 * @param key {string}
 * @param value {string}
 * @return {this}  Allow chaining
 */
function setCfg(key, value) {
  var userProps = PropertiesService.getUserProperties();
  userProps.setProperty('serverConfig.' + key, value);
  return this;
}

/**
 * @desc Short Helper to get a server config property from users storage
 * @param key {string}
 * @return {string}||NULL
 */
function getCfg(key) {
  var userProps = PropertiesService.getUserProperties();
  return userProps.getProperty('serverConfig.' + key);
}

/**
 * @desc Short Helper to save a variable in the  property storage
 * @param key {string}
 * @param value {string}
 * @return {this}  Allow chaining
 */
function setVar(key, value) {
  var userProps = PropertiesService.getUserProperties();
  userProps.setProperty(key, value);
  return this;
}

/**
 * @desc Short Helper to get a variable from property storage
 * @param key {string}
 * @return {string}||NULL
 */
function getVar(key) {
  var userProps = PropertiesService.getUserProperties();
  return userProps.getProperty(key);
}


/**
 * @desc  Storage init / setting defaults
 *        Google Guide states, we should not access property storage during onInstall or onOpen,
 *        So we have to do it somehow else, initializing some vars.
 *        Need better testing utilities or advice to improve this dirty workaround.
 *
 */
function initDefaults() {
  var build         = getVar('BUILD') || 0;
  var isInitialized = getVar('defaults_initialized') || 'false';
  if (isInitialized == 'true' && build == BUILD) return;
  
  setVar('BUILD', BUILD);
  
  // set default jira issue columns
  //var columnDefaults = getVar('jiraColumnDefault');
  //columnDefaults = (columnDefaults != null) ? JSON.parse(columnDefaults) : jiraColumnDefault;
  columnDefaults = jiraColumnDefault; //@TODO: allow user to change default columns
  setVar('jiraColumnDefault', JSON.stringify(columnDefaults));
  
  // Jira onDemand or Server
  var server_type = getCfg('server_type');
  if (server_type == null) server_type = 'onDemand';
  setCfg('server_type', server_type);
  
  // set done
  setVar('defaults_initialized', 'true');
}
