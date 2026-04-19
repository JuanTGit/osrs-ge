import express from "express";

const app = express();
const port: number = 3000;

app.listen(port, () => {
	console.log(`Hello from port ${port}`);
});

app.get("/items", (req, res) => {
	res.json({ message: "items" });
});

// app.get('/items/:name', (req, res) => {
// 	const name = req.params.name
// 	res.json({Name: name})
// })

app.get("/items/search", async (req, res) => {
	const rawName = String(req.query.q);
	const name = rawName.toLowerCase();

	const request = await fetch(
		"https://oldschool.runescape.wiki/?title=Module:GEIDs/data.json&action=raw&ctype=application%2Fjson",
	);
	if (!request.ok) {
		throw new Error("Failed to fetch.");
	}

	const data = await request.json();
	const filteredData = Object.entries(data)
		.filter(([key]) => key.toLowerCase().includes(name))
		.slice(0, 10)
		.map(([name, id]) => ({ name, id }));

	res.json(filteredData);
});

// 1. Create three variables — one string, one number, one boolean. Log them.
const itemName: string = "Raw shark";
const itemId: number = 331;
const isMembers: boolean = true;

console.log(itemName, itemId, isMembers);

// 2. Create an interface called Item with at least 3 properties. Create an object that matches it and log it.
interface Item {
	name: string;
	id: number;
	isMem: boolean;
}

const bread: Item = { name: "bread", id: 21, isMem: false };

console.log(bread);

// 3. Write a typed function that takes a string and returns a string.
const username = (user: string): string => {
	return user.toUpperCase();
};

console.log(username("Juan"));

function password(pass: string): string {
	return pass.toUpperCase();
}

console.log(password("password"));

// 4. Write a typed function that logs something and returns void.
function welcomeMsg(): void {
	console.log("Welcome to the homepage!");
}

welcomeMsg();

// 5. Write an async function that fetches live price data from: https://prices.runescape.wiki/api/v1/osrs/latest?id=4151

interface Price {
	high: number;
	highTime?: number; // Optional
	low: number;
	lowTime?: number; // Optional
}

const fetchData = async function (): Promise<Price> {
	const request = await fetch(
		"https://prices.runescape.wiki/api/v1/osrs/latest?id=4151",
	);

	if (!request.ok) {
		throw new Error("Failed to fetch.");
	}

	const data = await request.json();
	const res: Price = data.data[4151];
	return res;
};

fetchData().then((price) => {
	console.log(`High: ${price.high.toLocaleString()}`);
	console.log(`Low: ${price.low.toLocaleString()}`);
});
