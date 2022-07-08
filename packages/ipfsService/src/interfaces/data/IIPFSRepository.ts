import {
	IPFSContentIdentifier,
	IPFSUnavailableError,
} from "@hypernetlabs/hypernet.id-objects";
import { IPFSImportCandidate } from "@hypernetlabs/hypernet.id-ipfs-contracts";
import { ResultAsync } from "neverthrow";
import { IPFSHTTPClient } from "ipfs-http-client";

export interface IIPFSRepository {
	initialize(): ResultAsync<void, IPFSUnavailableError>;
	getHttpClient(): ResultAsync<IPFSHTTPClient, IPFSUnavailableError>;
	getGatewayUrl(): ResultAsync<string, IPFSUnavailableError>;
	setGatewayUrl(gatewayUrl: string): void;
	saveFile(
		file: IPFSImportCandidate,
	): ResultAsync<IPFSContentIdentifier, IPFSUnavailableError>;
	getFile(
		cid: IPFSContentIdentifier,
	): ResultAsync<Response, IPFSUnavailableError>;
	copyFile(
		cid: IPFSContentIdentifier,
		destination?: string,
	): ResultAsync<void, IPFSUnavailableError>;
	createDirectory(
		directoryName: string,
	): ResultAsync<void, IPFSUnavailableError>;
}

export const IIPFSRepositoryType = Symbol.for("IIPFSRepository");
