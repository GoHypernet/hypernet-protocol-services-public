// Based on answers at https://stackoverflow.com/questions/929684/is-there-common-street-addresses-database-design-for-all-addresses-of-the-world
export class PhysicalAddress {
	public constructor(
		public addressLine1: string,
		public addressLine2: string | null,
		public addressLine3: string | null,
		public city: string,
		public zipOrPostcode: string,
		public stateProvinceCounty: string,
		public country: string,
	) {}
}
