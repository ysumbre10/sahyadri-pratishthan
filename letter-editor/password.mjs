import {randomBytes,scryptSync} from 'node:crypto';
// Read via stdin so passwords do not appear in shell history or process arguments.
let password='';for await(const chunk of process.stdin)password+=chunk;
password=password.trimEnd();if(password.length<12)throw new Error('Use at least 12 characters');
const salt=randomBytes(16).toString('hex');console.log(`${salt}:${scryptSync(password,salt,64).toString('hex')}`);
