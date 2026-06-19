const NOWPAYMENTS_API_KEY = 'WZB9DX5-4GF4580-JGNYZ2X-2CW9R7E';

async function run() {
  const res = await fetch('https://api.nowpayments.io/v1/min-amount?currency_from=usdttrc20', {
    headers: { 'x-api-key': NOWPAYMENTS_API_KEY }
  });
  console.log('min-amount status:', res.status);
  const data = await res.json();
  console.log('min-amount data:', JSON.stringify(data, null, 2));

  // Try creating a $5 payment
  const res2 = await fetch('https://api.nowpayments.io/v1/payment', {
    method: 'POST',
    headers: { 'x-api-key': NOWPAYMENTS_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      price_amount: 5,
      price_currency: 'usd',
      pay_currency: 'usdttrc20',
      order_id: `test_${Date.now()}`,
      order_description: 'Test payment',
    })
  });
  console.log('\n$5 payment status:', res2.status);
  const data2 = await res2.json();
  console.log('$5 payment data:', JSON.stringify(data2, null, 2));
}

run().catch(console.error);
