const os = require('os');

// console.log('CPU architecture: ' + os.arch());
// console.log('CPU info: ' + JSON.stringify(os.cpus()));
// console.log('Total memory: ' + os.totalmem()/1024/1024/1024 + ' GB');
// console.log('Free memory: ' + os.freemem()/1024/1024/1024 + ' GB');
// console.log('OS host' + os.hostname());
// console.log('OS type: ' + os.type());
// console.log('OS platform: ' + os.platform());
// console.log('Network interfaces: ' + JSON.stringify(os.networkInterfaces()));
console.log('OS uptime: ' + os.uptime()/60/60 + ' hours');
