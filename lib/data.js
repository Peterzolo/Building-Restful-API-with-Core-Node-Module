const fs = require('fs');
const path = require('path');

const lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = function(dir, file, data, callback) {
	fs.open(lib.baseDir + dir +'/'+ file + '.json', 'wx', function(err, fileDescription) {
		if (!err && fileDescription) {
			const stringData = JSON.stringify(data);

			fs.writeFile(fileDescription, stringData, function(err) {
				if (!err) {
					fs.close(fileDescription, function(err) {
						if (!err) {
							callback(false);
						} else {
							callback('Could not close the file');
						}
					});
				} else {
					callback('Could not write to the file');
				}
			});
		} else {
			callback('Could not create the file');
		}
	});
};

lib.read = function(dir, file, callback) {
	fs.readFile(lib.baseDir + dir +'/' + file + '.json', 'utf8', function(err, data) {
		callback(err, data);
	});
};



lib.update = function(dir, file, data, callback) {
	fs.open(lib.baseDir + dir +'/'+ file + '.json', 'r+', function(err, fileDescription) {
		if (!err && fileDescription) {
			const stringData = JSON.stringify(data);
			fs.ftruncate(fileDescription, function(err) {
				if (!err) {
					fs.writeFile(fileDescription, stringData, function(err) {
						if (!err) {
							fs.close(fileDescription, function(err) {
								if (!err) {
									callback(false);
								} else {
									callback('Could not close the file');
								}
							});
						} else {
							callback('Error writing to existing file');
						}
					});
				} else {
					callback('Error trauncating file');
				}
			});
		} else {
			callback('Could not open the file for update');
		}
	});
};



lib.delete = function(dir, file, callback){
    fs.unlink(lib.baseDir+dir+ '/'+file+ '.json', function(err){
if(!err){
callback(false)
}else{
callback('Could not delete file')
}
    })

}

module.exports = lib;
