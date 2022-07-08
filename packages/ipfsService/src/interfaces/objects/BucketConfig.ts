export class BucketConfig {
	constructor(
		public projectId: string,
		public keyFilename: string,
		public privateBucketName: string,
		public publicBucketName: string,
		public subscriptionIds: string[],
	) {}
}
