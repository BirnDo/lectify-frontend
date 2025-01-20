import { promises as fs } from 'fs';
import path from 'path';
import type { Summary } from '../../../models/Summary';

export async function load({ params }) {
	const { id } = params;
	const filePath = path.resolve('static/data.json');
	const jsonData = await fs.readFile(filePath, 'utf-8');
	const summaries: Summary[] = JSON.parse(jsonData);
	const summary: Summary | undefined = summaries.find(
		(summary: Summary) => summary.id.toString() === id
	);
	//console.log(document.cookie);
	// const response = await fetch('http://192.168.1.147:5001/entry?_id=' + id, {
	// 	method: 'GET',
	// 	headers: {
	// 		Authorization: `Bearer ${token}`
	// 	}
	// });
	//const summary: Summary = await response.json();
	//console.log(summary);

	return {
		summary,
		id
	};
}
