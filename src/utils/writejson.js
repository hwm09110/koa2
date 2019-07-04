const fs = require('fs'); 
const path = require('path');

const filePath = path.resolve(__dirname, '../mock/person.json');

// console.log(__dirname);
// console.log(filePath);

function writeJson(params){ 
	//现将json文件读出来 
	fs.readFile(filePath,function(err,data){ 
		if(err){ 
			console.error(err)
			return; 
		} 
		var person = data.toString();
		//将二进制的数据转换为字符串 
		person = JSON.parse(person);
		//将字符串转换为json对象 
		person.data.push(params);
		//将传来的对象push进数组对象中 
		person.total = person.data.length;
		//定义一下总条数，为以后的分页打基础 
		console.log(person.data); 
		var str = JSON.stringify(person);
		//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中 
		fs.writeFile(filePath, str, function(err){ 
			if(err){ 
				console.error(err); 
			} 
			console.log('-------------新增成功-------------'); 
			}) 
		}) 
}

function readJson(filePath){ 
	return isFileExist(filePath).then(() => {
		return new Promise((resolve, reject) => {
			fs.readFile(filePath,function(err,data){ 
				if(err){ 
					reject(err)
					return; 
				} 
				//将二进制的数据转换为字符串 
				var info = data.toString();
				info = info?JSON.parse(info):[];
				resolve(info);
			})
		})
	})
}

// 检查当前目录中是否存在该文件。
function isFileExist(filePath) {
	return new Promise((resolve, reject) => {
		fs.access(filePath, fs.constants.F_OK, (err) => {
			if(err) {
				reject(false);
				return;
			}
			resolve(true);
		});
	})
}


// module.exports = writeJson
exports.writeJson = writeJson
exports.readJson = readJson

