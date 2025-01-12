import { promises as fs } from 'fs';
import path from 'path';

export async function load() {
	const filePath = path.resolve('static/data.json');
	const jsonData = await fs.readFile(filePath, 'utf-8');
	const summaries = JSON.parse(jsonData);

	return {
		summaries
	};
}
