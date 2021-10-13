/**
 * Activity.gs
 * 
 * A simple class for representing Strava Activities when
 * creating new activities at the Create Activity endpoint.
 */
 class Activity {

  constructor(params) {
    this.gear_id = null;
    
    for (const p in params) {
      switch(p) {
        case 'start_date_local': 
          // Convert to ISO 8601 format
          this[p] = formatDate(params[p]);
          break;
        case 'distance':
          // Conver to "Float"
          this[p] = Number(params[p]);
          break;
        case 'elapsed_time':
        case 'trainer':
        case 'commute':
          // Coerce to "Integer"
          this[p] = String(params[p]);          
          break;
        default:
          this[p] = params[p];
      }
    }

    // I'd prefer to define this as a static property of the class, but the linter flags it
    this.fields = [
      { name: 'name', note: 'The name of the activity (required)' },
      { name: 'type', note: 'Type of activity. For example - Run, Ride etc. (required)'},
      { name: 'start_date_local', note: 'ISO 8601 formatted date time (required)'},
      { name: 'elapsed_time', note: 'In seconds (required)'},
      { name: 'description', note: 'Description of the activity'},
      { name: 'distance', note: 'In meters'},
      { name: 'trainer', note: 'Set to 1 to mark as a trainer activity'},
      { name: 'commute', note: 'Set to 1 to mark as commute.'},
    ];

    function formatDate(start_date_local) {
      // Format the date to ISO 8601 format
      var tz = '-08:00';
      var dt = new Date(start_date_local);
      return Utilities.formatDate(dt, tz, 'yyyy-MM-dd');
    }

  }

  get params() {
    return {
      'name': this.name,
      'type': this.type,
      'start_date_local': this.start_date_local,
      'elapsed_time': this.elapsed_time,
      'description': this.description,
      'distance': this.distance,
      'trainer': this.trainer,
      'commute': this.commute,
      'gear_id': this.gear_id,
    }
  }

  print() {
    return `${this.name}, ${this.type}, ${this.start_date_local}, ${this.elapsed_time}`;
  }
  
}