/**
 * Run this as a background script and change the table name and encoded query accordingly
 * Make sure you have an In Progress Update Set and it's set as your current
 * Also make sure the scope is valid, i.e. only add Global records if your Update Set is in Global scope
 */
var table = 'sys_attachment';
var encQuery = 'sys_id=4d6d0d641b4381d47f9bfc8f034bcb9e';

// Adds record above to the current update set
var updMgr = new GlideUpdateManager2();

var rec = new GlideRecord(table);
rec.addEncodedQuery(encQuery);
rec.query();
while (rec.next()) {
    updMgr.saveRecord(rec);
}
