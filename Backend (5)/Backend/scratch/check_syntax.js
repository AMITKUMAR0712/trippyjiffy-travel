import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('.');
files.forEach(file => {
    try {
        execSync(`node --check "${file}"`);
        // console.log(`OK: ${file}`);
    } catch (err) {
        console.log(`ERROR in ${file}:`);
        console.log(err.stderr.toString());
    }
});
