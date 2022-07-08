# IPFS Service

This service mainly deals with IPFS, and serves to A. provide a method for getting files into IPFS, and B. for making sure they stay there. The IPFS Service is completely agnostic as to the nature of the files themselves; it can put any content you want into IPFS, for any purpose you need. Uploaded files are assigned an internal ID for tracking purposes, although metadata about the files is available via query.

The IPFS service should support uploading of both a ZIP collection of files, as well as a single file. The flow is slightly different for each. 

## ZIP Flow

The flow has three major phases, staging, decompression and pinning.

In the staging phase, a service requests the creation of a staging area. The IPFS Service will create a Google (or AWS or Storj...) bucket and store a reference to that in its DB, and emit an event saying it has been created. The requesting service will be given a link it can use or publish to allow a ZIP file to be uploaded to the staging bucket.

Once a ZIP file is put into the staging bucket, the IPFS service must decompress it, and parse the results, creating a File for each component of the ZIP. An individual event will be emitted for each File.

In the pinning phase, the service will publish files from the staging bucket and put them into IPFS, recording the IPFS Content identifier (CID) and emitting an event. The pinning service will track the status of the file and make sure it is properly pinned in IPFS, until the requesting service tells it otherwise.

## Single File Flow

This flow is easier and can make use of a shared, persistent bucket. A single file is uploaded to the staging bucket, and then pinned to IPFS.
Events are emitted when the file is collected and for updates to the file status including pinning complete.

## Abstractions

### File
The file represents a single File that lives in IPFS. Each File maintains status so that we can track it from Upload to Stable On IPFS. The File will have metadata about the file, and its IPFS CID.

### File Collection
This is used to track ZIP file uploads. ZIPs must be decompressed, and each constituent file recorded seperately as a File.

## Commands
The service will support, at minimum, the following commands:

## Events
The service will listen for at least the following events:
