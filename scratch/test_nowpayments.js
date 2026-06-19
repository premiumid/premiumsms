const NOWPAYMENTS_API_KEY = 'WZB9DX5-4GF4580-JGNYZ2X-2CW9R7E';

async function run() {
  // Try to get min-amount just for the currency, no fiat_equivalent
  const res = await fetch('https://api.nowpayments.io/v1/min-amount?currency_from=usdtbsc', {
    headers: { 'x-api-key': NOWPAYMENTS_API_KEY }
  });
  console.log('min-amount status:', res.status);
  const data = await res.json();
  console.log('min-amount data:', JSON.stringify(data, null, 2));

  // Also try creating a $20 payment to see if it works
  const res2 = await fetch('https://api.nowpayments.io/v1/payment', {
    method: 'POST',
    headers: { 'x-api-key': NOWPAYMENTS_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      price_amount: 20,
      price_currency: 'usd',
      pay_currency: 'usdtbsc',
      order_id: `test_${Date.now()}`,
      order_description: 'Test payment',
    })
  });
  console.log('\n$20 payment status:', res2.status);
  const data2 = await res2.json();
  console.log('$20 payment data:', JSON.stringify(data2, null, 2));
}

run().catch(console.error);
