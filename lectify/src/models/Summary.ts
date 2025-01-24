export interface Summary {
	_id: number;
	userid: string;
	title: string;
	fileName: string;
	duration: string;
	transcriptionQuality: 'High' | 'Standard' | 'Basic';
	summaryType: 'Comprehensive' | 'Detailed' | 'Brief';
	createdAt: string;
	completed: boolean;
	summaryText: string;
	transcriptionText: string;
}
