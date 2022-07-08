import {
	EmailAddedEvent,
	EmailVerifiedEvent,
	EventError,
	IdentityCreatedEvent,
	IdentityLinkedToNFTEvent,
	IdentityTokenMintedEvent,
	IdentityVerificationCompletedEvent,
	IdentityVerificationSubmittedEvent,
	ProfileTokenMintedEvent,
	ProcessZipFileErrorDetectedEvent,
	ReferralLinkAccessedEvent,
	UsernameAddedEvent,
	WalletTokenIssuedEvent,
	IdentitySanctionsDetectedEvent,
	FileCreatedEvent,
	FileUploadedEvent,
	FilePinnedOnIPFSEvent,
	UploadLocationCreatedEvent,
	NFTAddedToCollectionEvent,
	NFTLinkedToAssetEvent,
	NFTStatusUpdatedEvent,
	ZipFileUploadedEvent,
	MemberAddedToCorporateEvent,
	MemberRemovedFromCorporateEvent,
	CollectionCreatedEvent,
	CollectionStatusUpdatedEvent,
	CollectionRequiresUpdateEvent,
	RegistryTokenMintedEvent,
	OnboardingCompletedEvent,
} from "@hypernetlabs/hypernet.id-objects";
import { Result } from "neverthrow";

export interface IEventRepository {
	collectionCreated(event: CollectionCreatedEvent): Result<void, EventError>;
	collectionRequiresUpdate(
		event: CollectionRequiresUpdateEvent,
	): Result<void, EventError>;
	collectionStatusUpdated(
		event: CollectionStatusUpdatedEvent,
	): Result<void, EventError>;
	emailAdded(event: EmailAddedEvent): Result<void, EventError>;
	emailVerified(event: EmailVerifiedEvent): Result<void, EventError>;
	fileCreated(event: FileCreatedEvent): Result<void, EventError>;
	fileUploaded(event: FileUploadedEvent): Result<void, EventError>;
	filePinned(event: FilePinnedOnIPFSEvent): Result<void, EventError>;
	identityCreated(event: IdentityCreatedEvent): Result<void, EventError>;
	identityLinkedToNFT(
		event: IdentityLinkedToNFTEvent,
	): Result<void, EventError>;
	identityTokenMinted(
		event: IdentityTokenMintedEvent,
	): Result<void, EventError>;
	identityVerificationCompleted(
		event: IdentityVerificationCompletedEvent,
	): Result<void, EventError>;
	identityVerificationSubmitted(
		event: IdentityVerificationSubmittedEvent,
	): Result<void, EventError>;
	memberAddedToCorporate(
		event: MemberAddedToCorporateEvent,
	): Result<void, EventError>;
	memberRemovedFromCorporate(
		event: MemberRemovedFromCorporateEvent,
	): Result<void, EventError>;
	nftAddedToCollection(
		event: NFTAddedToCollectionEvent,
	): Result<void, EventError>;
	nftLinkedToAsset(event: NFTLinkedToAssetEvent): Result<void, EventError>;
	nftStatusUpdated(event: NFTStatusUpdatedEvent): Result<void, EventError>;
	onboardingCompleted(
		event: OnboardingCompletedEvent,
	): Result<void, EventError>;
	profileTokenMinted(
		event: ProfileTokenMintedEvent,
	): Result<void, EventError>;
	registryTokenMinted(
		event: RegistryTokenMintedEvent,
	): Result<void, EventError>;
	processZipFileErrorDetected(
		event: ProcessZipFileErrorDetectedEvent,
	): Result<void, EventError>;
	referralLinkAccessed(
		event: ReferralLinkAccessedEvent,
	): Result<void, EventError>;
	usernameAdded(event: UsernameAddedEvent): Result<void, EventError>;
	uploadLocationCreated(
		event: UploadLocationCreatedEvent,
	): Result<void, EventError>;
	walletTokenIssued(event: WalletTokenIssuedEvent): Result<void, EventError>;
	identitySanctionsDetected(
		event: IdentitySanctionsDetectedEvent,
	): Result<void, EventError>;
	zipFileUploaded(event: ZipFileUploadedEvent): Result<void, EventError>;
}

export const IEventRepositoryType = Symbol.for("IEventRepository");
