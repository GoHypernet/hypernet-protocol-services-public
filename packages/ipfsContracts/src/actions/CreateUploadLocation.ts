import {
	EUploadLocationAccess,
	EUploadLocationFilePinning,
} from "@hypernetlabs/hypernet.id-objects";
import { EService } from "@hypernetlabs/hypernet.id-objects";

export class CreateUploadLocation {
	public constructor(
		public locationIdentifier: string,
		public filePinning: EUploadLocationFilePinning,
		public access: EUploadLocationAccess,
	) {}

	static actionName = "createUploadLocation";
	static fullActionName = `${EService.IPFS}.${CreateUploadLocation.actionName}`;
}
