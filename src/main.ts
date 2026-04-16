import express from 'express';

const app = express();
const port: number = 3000;

app.get('/items', (req, res) => {
	res.json({ "message": "OSRS GE API is running" });
})

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
})