const path = require('path');
// console.log(path.basename('/MERN_TUTORIALS/Nodejs/newFile.txt'))
// console.log(path.dirname('/MERN_TUTORIALS/Nodejs/newFile.txt'))
// console.log(path.extname('/MERN_TUTORIALS/Nodejs/newFile.txt'))
// console.log(path.isAbsolute('D/MERN_TUTORIALS/Nodejs/test/filetest.txt'))
// console.log(path.isAbsolute('./test/filetest.txt'))

let currentPath = __filename;
console.log(path.parse(currentPath));
