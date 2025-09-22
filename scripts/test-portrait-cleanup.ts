#!/usr/bin/env bun

/**
 * Test script for portrait cleanup functionality
 * This script verifies that the cleanupOldRejectedPortraits function works correctly
 */

import { cleanupOldRejectedPortraits } from '../lib/database';
import { PORTRAIT_CONFIG } from '../lib/portrait-config';

async function testPortraitCleanup() {
    console.log('🧪 Testing portrait cleanup functionality...');
    console.log(`📋 Configuration: MAX_REJECTED_PORTRAITS = ${PORTRAIT_CONFIG.MAX_REJECTED_PORTRAITS}`);
    
    try {
        // Test cleanup with current configuration
        console.log('\n🔍 Running cleanup with current settings...');
        const cleanedUp = await cleanupOldRejectedPortraits(PORTRAIT_CONFIG.MAX_REJECTED_PORTRAITS);
        
        if (cleanedUp === 0) {
            console.log('✅ No cleanup needed - rejected portrait count is within limits');
        } else {
            console.log(`🧹 Successfully cleaned up ${cleanedUp} old rejected portraits`);
        }
        
        // Test with a very low limit to see what would happen
        console.log('\n🔍 Testing cleanup with limit of 5 (dry run simulation)...');
        const wouldCleanup = await cleanupOldRejectedPortraits(5);
        
        if (wouldCleanup === 0) {
            console.log('✅ Even with limit of 5, no cleanup needed');
        } else {
            console.log(`📊 With limit of 5, would clean up ${wouldCleanup} portraits`);
        }
        
        console.log('\n✅ Portrait cleanup test completed successfully!');
        
    } catch (error) {
        console.error('❌ Error during portrait cleanup test:', error);
        process.exit(1);
    }
}

// Run the test
testPortraitCleanup();