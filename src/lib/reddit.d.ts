export interface Listing {
	kind: "Listing";
	data: {
		after: string | null;
		before: string | null;
		children: {
			kind: "t3";
			data: {
				id: string;
				subreddit: string;
				title: string;
				name: string;
				thumbnail: string | null;
				post_hint?: "image";
				url: string;
				media_metadata?: {
					[id: string]: {
						e: "Image";
						s: {
							x: number;
							y: number;
							u: string;
						};
					};
				};
			};
		}[];
		dist: number;
		geo_filter: string;
		modhash: string | null;
	};
}
