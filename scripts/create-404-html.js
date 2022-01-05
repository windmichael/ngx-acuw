const fs = require('fs-extra');

(() => {
    try {
        // 404.html for Github-Pages
        fs.copyFile('./docs/index.html', './docs/404.html');
    } 
    catch (err) {
        console.error(err);
    }
})();