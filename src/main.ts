import express, { response } from 'express';

const app = express();
const port: number = 3000;

app.get('/items', (req, res) => {
	res.json({ "message": "OSRS GE API is running" });
})

interface itemPriceInfo {
	high: number;
	highTime?: number; // Optional
	low: number;
	lowTime?: number; // Optional
}

// Find Item ID from Item Name
// app.get('/item-name/:name', async (req, res) => {
// 	const name = String(req.query.name) || 'Acorn';

// 	const information = await fetch('https://oldschool.runescape.wiki/?title=Module:GEIDs/data.json&action=raw&ctype=application%2Fjson');
	
// 	if (!information.ok) {
// 		throw new Error(`failed to fetch ${name}`);
// 	}

// 	const data = await information.json();
// 	res.json(data[name]);
// })

app.get('/item-name/search', async (req, res) => {
	const name = String(req.query.q).toLowerCase();
  
	const information = await fetch('https://oldschool.runescape.wiki/?title=Module:GEIDs/data.json&action=raw&ctype=application%2Fjson');
  
	if (!information.ok) {
	  throw new Error(`failed to fetch ${name}`);
	}
  
	const data = await information.json();
	const filteredStr = Object.entries(data)
						.filter(([key]) => key.includes(name))
						.slice(0, 10)


	res.json(filteredStr)
  });

// Current Price data for Item ID
app.get(`/item-id/:id`, async (req, res) => {

	const itemId = Number(req.params.id) || 4151;
	const response = await fetch(`https://prices.runescape.wiki/api/v1/osrs/latest?id=${itemId}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch price for item ${itemId}`);
	}
	
	const data = await response.json();
	res.json(data.data[itemId])

})



app.listen(port, () => {
	console.log(`App listening on port ${port}`);
})