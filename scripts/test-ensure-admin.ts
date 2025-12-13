#!/usr/bin/env bun
// Quick test runner to call ensureAdmin() once and print result.
import('../lib/ensure-admin')
    .then((mod) => (mod.ensureAdmin || mod.default)())
    .then(() => console.log('test-ensure-admin: done'))
    .catch((e) => {
        console.error('test-ensure-admin: error', e);
        process.exit(1);
    });
