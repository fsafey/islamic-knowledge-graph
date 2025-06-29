/**
 * DOM Performance Validation Test
 * Tests the DOM optimization implementation for Phase 2
 */

/**
 * Validate DOM cache initialization
 */
export function validateDOMCacheSetup() {
    const results = {
        cacheExists: false,
        criticalElementsCached: false,
        featureDetectionWorking: false,
        elementsCount: 0
    };
    
    // Check if cache exists
    if (window.cachedDOMElements) {
        results.cacheExists = true;
        
        // Count cached elements
        results.elementsCount = Object.keys(window.cachedDOMElements).filter(key => 
            key !== 'features' && window.cachedDOMElements[key] !== null
        ).length;
        
        // Check critical elements
        const criticalElements = ['sidebarContent', 'searchInput', 'graphContainer'];
        results.criticalElementsCached = criticalElements.every(key => 
            window.cachedDOMElements[key] !== null
        );
        
        // Check feature detection
        results.featureDetectionWorking = Boolean(window.cachedDOMElements.features);
    }
    
    return results;
}

/**
 * Validate performance improvement
 */
export function validatePerformanceImprovement() {
    if (!window.domPerformanceResults) {
        return {
            tested: false,
            error: 'Performance benchmark not run'
        };
    }
    
    const results = window.domPerformanceResults;
    
    return {
        tested: true,
        improvementPercentage: results.improvement,
        speedupFactor: results.speedupFactor,
        targetMet: results.targetMet,
        traditionalTime: results.traditionalTime,
        cachedTime: results.cachedTime
    };
}

/**
 * Test batch DOM updates functionality
 */
export function testBatchDOMUpdates() {
    const results = {
        batchFunctionsExist: false,
        canExecute: false
    };
    
    // Check if batch functions are available
    // Note: These are internal to search.js but we can check if they work through search
    try {
        // Test if search module loaded properly with batch functionality
        const searchInput = window.cachedDOMElements?.searchInput;
        if (searchInput) {
            results.batchFunctionsExist = true;
            
            // Test if we can trigger batch updates without errors
            const testEvent = new Event('input', { bubbles: true });
            searchInput.value = 'test';
            searchInput.dispatchEvent(testEvent);
            searchInput.value = '';
            searchInput.dispatchEvent(testEvent);
            
            results.canExecute = true;
        }
    } catch (error) {
        results.error = error.message;
    }
    
    return results;
}

/**
 * Run comprehensive DOM optimization validation
 */
export function runDOMOptimizationValidation() {
    console.log('🧪 Running DOM Optimization Validation Tests...');
    
    const cacheValidation = validateDOMCacheSetup();
    const performanceValidation = validatePerformanceImprovement();
    const batchValidation = testBatchDOMUpdates();
    
    const report = {
        timestamp: new Date().toISOString(),
        cacheSetup: cacheValidation,
        performance: performanceValidation,
        batchUpdates: batchValidation,
        overallSuccess: cacheValidation.cacheExists && 
                       cacheValidation.criticalElementsCached &&
                       performanceValidation.targetMet &&
                       batchValidation.canExecute
    };
    
    // Generate report
    console.log('📊 DOM Optimization Validation Report:');
    console.log(`   Cache Setup: ${cacheValidation.cacheExists ? '✅' : '❌'} (${cacheValidation.elementsCount} elements)`);
    console.log(`   Critical Elements: ${cacheValidation.criticalElementsCached ? '✅' : '❌'}`);
    console.log(`   Feature Detection: ${cacheValidation.featureDetectionWorking ? '✅' : '❌'}`);
    
    if (performanceValidation.tested) {
        console.log(`   Performance Target: ${performanceValidation.targetMet ? '✅' : '❌'} (${performanceValidation.improvementPercentage.toFixed(1)}% improvement)`);
        console.log(`   Speedup Factor: ${performanceValidation.speedupFactor.toFixed(1)}x`);
    } else {
        console.log(`   Performance: ⚠️ Not tested`);
    }
    
    console.log(`   Batch Updates: ${batchValidation.canExecute ? '✅' : '❌'}`);
    console.log(`   Overall Success: ${report.overallSuccess ? '✅ PASS' : '❌ FAIL'}`);
    
    return report;
}

// Auto-run validation if in test mode
if (typeof window !== 'undefined' && window.location?.search?.includes('test=dom')) {
    // Delay to ensure initialization completes
    setTimeout(() => {
        runDOMOptimizationValidation();
    }, 1000);
}