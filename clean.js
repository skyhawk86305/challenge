#!/usr/bin/env node
/*eslint no-console: 0, no-sync: 0*/
'use strict';
const del = require('del');
console.log(del.sync(['*.+(js|d.ts|js.map)']));
