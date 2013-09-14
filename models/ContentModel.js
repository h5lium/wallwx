var Model = require("./BaseModel");
module.exports = new Model().extend({
	init: function(db, collName) {
		this.db = db;
		this.coll = this.db.collection(collName);
	},
	insert: function(data, callback, options) {
		self.coll.insert(data, options || {}, callback);
	},
	update: function(query, data, callback, options) {
		this.coll.update(query, {
			$set: data
		}, options || {}, callback);
	},
	find: function(query, callback, options) {
		this.coll.find(query, options || {}).toArray(callback);
	},
	findOne: function(query, callback, options) {
		this.coll.findOne(query, options || {}, callback);
	},
	remove: function(query, callback, options) {
		this.coll.remove(query, options || {}, callback);
	}
});