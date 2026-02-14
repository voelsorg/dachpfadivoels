export async function sendMailjet(env, messages) {
  const apiKey = env.MAILJET_API_KEY;
  const apiSecret = env.MAILJET_API_SECRET;
  if (!apiKey || !apiSecret) {
    console.log('sendMailjet: SKIP – API key or secret missing');
    return;
  }

  try {
    const resp = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(apiKey + ':' + apiSecret),
      },
      body: JSON.stringify({ Messages: messages }),
    });
    const respBody = await resp.text();
    if (!resp.ok) {
      console.error('Mailjet error:', resp.status, respBody);
    } else {
      console.log('Mailjet OK:', resp.status, respBody);
    }
  } catch (err) {
    console.error('Mail send failed:', err);
  }
}
