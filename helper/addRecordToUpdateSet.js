var table = 'table_name';
var encQuery = 'active=true';

var updMgr = new GlideUpdateManager2();

var rec = new GlideRecord(table);
rec.addEncodedQuery(encQuery);
rec.query();

while (rec.next()) {
    updMgr.saveRecord(rec);
}
