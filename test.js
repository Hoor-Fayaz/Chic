async function test() {
  const req = await fetch('http://localhost:5000/api/v1/user/wishlist');
  // Need to log in first!
  const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: "test@example.com", password: "password123" }) // assuming dummy credentials
  });
  const loginData = await loginRes.json();
  console.log("Login:", loginData);
}
test();
