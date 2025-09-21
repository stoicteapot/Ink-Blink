const stripe = Stripe('Bypk_live_51S9s18BgXHw7uAUoROE7WQwnebyHBqR7QOg9u7wXjlFR1gJLxTMqeyOGAiH5u6ucvFvNY8DtFb6JsuyLMaMSzu8g00TTwBp5fc'); // Replace with your real key
const elements = stripe.elements();

const style = {
  base: {
    color: "#32325d",
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    "::placeholder": {
      color: "#a0aec0"
    }
  },
  invalid: {
    color: "#e63946"
  }
};

const card = elements.create("card", { style });
card.mount("#card-element");

document.getElementById('submit').addEventListener('click', async (e) => {
  e.preventDefault();

  const { token, error } = await stripe.createToken(card);
  if (error) {
    document.getElementById('card-errors').textContent = error.message;
    return;
  }

  const res = await fetch('http://localhost:3000/process-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: token.id, amount: 500 }) // £5.00 in pence
  });

  const result = await res.json();
  document.getElementById('card-errors').textContent = result.success
    ? '✅ Payment Successful!'
    : '❌ Payment Failed: ' + result.error;
});
