import {
	IdentityCreatedEvent,
	EventError,
	EmailAddedEvent,
	IdentityVerificationSubmittedEvent,
	IdentityVerificationCompletedEvent,
	EmailVerifiedEvent,
	ReferralLinkAccessedEvent,
	IdentityTokenMintedEvent,
	ProfileTokenMintedEvent,
	ProcessZipFileErrorDetectedEvent,
	UsernameAddedEvent,
	WalletTokenIssuedEvent,
	IdentitySanctionsDetectedEvent,
	FileCreatedEvent,
	FileUploadedEvent,
	FilePinnedOnIPFSEvent,
	UploadLocationCreatedEvent,
	BaseEvent,
	NFTAddedToCollectionEvent,
	NFTLinkedToAssetEvent,
	IdentityLinkedToNFTEvent,
	ZipFileUploadedEvent,
	MemberAddedToCorporateEvent,
	MemberRemovedFromCorporateEvent,
	NFTStatusUpdatedEvent,
	CollectionCreatedEvent,
	CollectionStatusUpdatedEvent,
	CollectionRequiresUpdateEvent,
	RegistryTokenMintedEvent,
	OnboardingCompletedEvent,
} from "@hypernetlabs/hypernet.id-objects";
import { inject, injectable } from "inversify";
import { LoggerInstance, ServiceBroker } from "moleculer";
import { LoggerType, ServiceBrokerType } from "moleculer-ioc";
import { err, ok, Result } from "neverthrow";

import { IEventRepository } from "@events/IEventRepository";

@injectable()
export class EventRepository implements IEventRepository {
	public constructor(
		@inject(ServiceBrokerType) protected broker: ServiceBroker,
		@inject(LoggerType) protected logger: LoggerInstance,
	) {}

	public collectionCreated(
		event: CollectionCreatedEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, CollectionCreatedEvent.eventName);
	}

	public collectionRequiresUpdate(
		event: CollectionRequiresUpdateEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, CollectionRequiresUpdateEvent.eventName);
	}

	public collectionStatusUpdated(
		event: CollectionStatusUpdatedEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, CollectionCreatedEvent.eventName);
	}

	public emailAdded(event: EmailAddedEvent): Result<void, EventError> {
		return this.sendEvent(event, EmailAddedEvent.eventName);
	}

	public emailVerified(event: EmailVerifiedEvent): Result<void, EventError> {
		return this.sendEvent(event, EmailVerifiedEvent.eventName);
	}

	public fileCreated(event: FileCreatedEvent): Result<void, EventError> {
		return this.sendEvent(event, FileCreatedEvent.eventName);
	}

	public fileUploaded(event: FileUploadedEvent): Result<void, EventError> {
		return this.sendEvent(event, FileUploadedEvent.eventName);
	}

	public filePinned(event: FilePinnedOnIPFSEvent): Result<void, EventError> {
		return this.sendEvent(event, FilePinnedOnIPFSEvent.eventName);
	}

	public identityCreated(
		event: IdentityCreatedEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, IdentityCreatedEvent.eventName);
	}

	public identityLinkedToNFT(
		event: IdentityLinkedToNFTEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, IdentityLinkedToNFTEvent.eventName);
	}

	public identityTokenMinted(
		event: IdentityTokenMintedEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, IdentityTokenMintedEvent.eventName);
	}

	public identityVerificationCompleted(
		event: IdentityVerificationCompletedEvent,
	): Result<void, EventError> {
		return this.sendEvent(
			event,
			IdentityVerificationCompletedEvent.eventName,
		);
	}

	public identityVerificationSubmitted(
		event: IdentityVerificationSubmittedEvent,
	): Result<void, EventError> {
		return this.sendEvent(
			event,
			IdentityVerificationSubmittedEvent.eventName,
		);
	}

	public memberAddedToCorporate(
		event: MemberAddedToCorporateEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, MemberAddedToCorporateEvent.eventName);
	}

	public memberRemovedFromCorporate(
		event: MemberRemovedFromCorporateEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, MemberRemovedFromCorporateEvent.eventName);
	}

	public nftAddedToCollection(
		event: NFTAddedToCollectionEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, NFTAddedToCollectionEvent.eventName);
	}

	public nftLinkedToAsset(
		event: NFTLinkedToAssetEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, NFTLinkedToAssetEvent.eventName);
	}

	public nftStatusUpdated(
		event: NFTStatusUpdatedEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, NFTLinkedToAssetEvent.eventName);
	}

	public registryTokenMinted(
		event: RegistryTokenMintedEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, RegistryTokenMintedEvent.eventName);
	}

	public processZipFileErrorDetected(
		event: ProcessZipFileErrorDetectedEvent,
	): Result<void, EventError> {
		return this.sendEvent(
			event,
			ProcessZipFileErrorDetectedEvent.eventName,
		);
	}

	public onboardingCompleted(
		event: OnboardingCompletedEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, OnboardingCompletedEvent.eventName);
	}

	public profileTokenMinted(
		event: ProfileTokenMintedEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, ProfileTokenMintedEvent.eventName);
	}

	public referralLinkAccessed(
		event: ReferralLinkAccessedEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, ReferralLinkAccessedEvent.eventName);
	}

	public usernameAdded(event: UsernameAddedEvent): Result<void, EventError> {
		return this.sendEvent(event, UsernameAddedEvent.eventName);
	}

	public uploadLocationCreated(
		event: UploadLocationCreatedEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, UploadLocationCreatedEvent.eventName);
	}

	public walletTokenIssued(
		event: WalletTokenIssuedEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, WalletTokenIssuedEvent.eventName);
	}

	public identitySanctionsDetected(
		event: IdentitySanctionsDetectedEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, IdentitySanctionsDetectedEvent.eventName);
	}

	public zipFileUploaded(
		event: ZipFileUploadedEvent,
	): Result<void, EventError> {
		return this.sendEvent(event, ZipFileUploadedEvent.eventName);
	}

	protected sendEvent(
		event: BaseEvent,
		eventName: string,
	): Result<void, EventError> {
		try {
			this.broker.sendToChannel(eventName, event);
			return ok(undefined);
		} catch (e) {
			return err(new EventError(`Error while emiting ${eventName}`, e));
		}
	}
}
