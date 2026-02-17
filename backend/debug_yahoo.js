import * as yfHelper from 'yahoo-finance2';
import yahooFinanceDefault from 'yahoo-finance2';

console.log('--- Namespace Import ---');
console.log(Object.keys(yfHelper));
console.log('default:', yfHelper.default);
if (yfHelper.default) console.log('default keys:', Object.keys(yfHelper.default));

console.log('\n--- Default Import ---');
console.log(yahooFinanceDefault);
console.log('Keys:', Object.keys(yahooFinanceDefault));

async function test() {
    try {
        console.log('\n--- Testing Quote ---');
        let yf = yahooFinanceDefault;
        if (!yf.quote && yfHelper.default) yf = yfHelper.default;

        if (yf.quote) {
            const quote = await yf.quote('AMZN');
            console.log(JSON.stringify(quote, null, 2));
        } else {
            console.log('Still cannot find quote function');
        }
    } catch (e) {
        console.error(e);
    }
}

test();
