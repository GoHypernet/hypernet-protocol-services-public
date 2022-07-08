import { UUID, UnixTimestamp } from "@hypernetlabs/objects";
import {
	EUploadLocationAccess,
	EUploadLocationFilePinning,
} from "@hypernetlabs/hypernet.id-objects";

export class NewUploadLocation {
	public constructor(
		public locationIdentifier: string,
		public googleBucketName: string,
		public filePinning: EUploadLocationFilePinning,
		public access: EUploadLocationAccess,
	) {}
}

export class UploadLocation extends NewUploadLocation {
	public constructor(
		public id: UUID,
		public locationIdentifier: string,
		public googleBucketName: string,
		public createdTimestamp: UnixTimestamp,
		public updatedTimestamp: UnixTimestamp,
		public filePinning: EUploadLocationFilePinning,
		public access: EUploadLocationAccess,
		public deleted = false,
	) {
		super(locationIdentifier, googleBucketName, filePinning, access);
	}
}
