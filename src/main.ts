// import * as dotenv from "dotenv";
// dotenv.config();

import express from "express";
import prisma from "../prisma";

const app = express();
const port: number = 3000;

app.get("/items", (req, res) => {
	res.json({ message: "OSRS GE API is running" });
});

interface itemPriceInfo {
	high: number;
	highTime?: number; // Optional
	low: number;
	lowTime?: number; // Optional
}

// Resuable async functions to fetch item ids and prices
async function getItemId(rawName: string): Promise<number> {
	const name: string =
		rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
	const response = await fetch(
		"https://oldschool.runescape.wiki/?title=Module:GEIDs/data.json&action=raw&ctype=application%2Fjson",
	);

	if (!response.ok) {
		throw new Error(`failed to fetch ${name}`);
	}
	const data = await response.json();

	return data[name];
}

async function getItemPrice(id: number): Promise<itemPriceInfo> {
	const response = await fetch(
		`https://prices.runescape.wiki/api/v1/osrs/latest?id=${id}`,
	);

	if (!response.ok) {
		throw new Error(`Failed to fetch price for item ${id}`);
	}

	const data = await response.json();
	return data.data[id];
}

/* 
Test functions
*/

// getItemId("abyssal whip").then((name) => {
// 	console.log(`${name}`);
// });
// getItemPrice(4151).then((price) => {
// 	console.log(`${price.high.toLocaleString()}`);
// });

/* 
LOGIC
User search(query 10) => User selects name => name looks up id => id gives price info and returns it to user.
*/

// Find Item ID from Item Name - Query 10
app.get("/items/search", async (req, res) => {
	const name = String(req.query.q).toLowerCase();

	const information = await fetch(
		"https://oldschool.runescape.wiki/?title=Module:GEIDs/data.json&action=raw&ctype=application%2Fjson",
	);

	if (!information.ok) {
		throw new Error(`failed to fetch ${name}`);
	}

	const data = await information.json();
	const filteredStr = Object.entries(data)
		.filter(([key]) => key.toLowerCase().includes(name))
		.slice(0, 10)
		.map(([name, id]) => ({ name, id }));

	res.json(filteredStr);
});

// Get item info from item name
app.get("/items/:name", async (req, res) => {
	const name = String(req.params.name).toLowerCase();
	const response = await getItemId(name);

	res.json({ name, id: response });
});

// Current Price data for Item ID
app.get(`/items/:name/price`, async (req, res) => {
	const rawName = String(req.params.name);
	const name: string =
		rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

	const itemId = await getItemId(name);
	const itemStockValue = await getItemPrice(itemId);
	const { high, low } = itemStockValue;

	await prisma.priceHistory.create({
		data: {
			itemName: name,
			itemId: itemId,
			high: high,
			low: low,
		},
	});

	res.json({ name, high, low });
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
