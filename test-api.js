const payload = {
    name: "Test User",
    email: "node_test@test.com",
    password: "password123"
};

fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
}).then(async res => {
    console.log(res.status);
    console.log(await res.text());
}).catch(console.error);
