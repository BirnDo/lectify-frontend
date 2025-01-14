import { promises as fs } from 'fs';
import path from 'path';
import type { Summary } from '../../models/Summary';

export async function load({ cookies }) {
	const filePath = path.resolve('static/data.json');
	const jsonData = await fs.readFile(filePath, 'utf-8');
	const summaries: Summary[] = JSON.parse(jsonData);
	const token = cookies.get('token');
	return {
		summaries,
		token
	};
}
