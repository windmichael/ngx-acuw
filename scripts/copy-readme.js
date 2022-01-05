const fs = require('fs-extra');

(() => {
    try {
        // README.md for npmjs
        fs.copyFile('./README.md', './projects/ngx-acuw/README.md');
    } 
    catch (err) {
        console.error(err);
    }
})();