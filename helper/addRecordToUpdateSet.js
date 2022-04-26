/**
 * Run this as a background script and change the table name and encoded query accordingly
 * Make sure you have an In Progress Update Set and it's set as your current
 * Also make sure the scope is valid, i.e. only add Global records if your Update Set is in Global scope
 * @param {String} table - table name
 * @param {String} encQuery - encoded query for the records to be added
 */
function addRecordToUpdateSet(table, encQuery) {
    // Adds records above to the current update set
    var updMgr = new GlideUpdateManager2();

    var rec = new GlideRecord(table);
    rec.addEncodedQuery(encQuery);
    rec.query();
    while (rec.next()) {
        updMgr.saveRecord(rec);
    }
}
