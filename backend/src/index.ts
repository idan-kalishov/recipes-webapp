import { createServer } from "./server"; // adjust the path accordingly

const app = createServer();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
