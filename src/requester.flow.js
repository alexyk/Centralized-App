export type IRequester = {
  createListing: CreateListing
};

export type CreateListing = (listing: CreateListingArg) => void

export type CreateListingArg = {
  // private String location;
  location: string, // city, state, country, countryCode
  // private Set<Long> amenities;
  amenities: [number],
  // private Long currency;
  currency: number,
  // private Long type;
  type: number,
  // private Set<Room> rooms;
  rooms: [
    {
      doubleBedCount: number,
      kingBedCount: number,
      singleBedCount: number
    }
    ]
  // private List<Picture> pictures;
  pictures: [{
    sortOrder: number,
    original: string, //url
    thumbnail: string //url
  }]
  // private DescriptionDTO description;
  description: {
    street: string,
    text: string,
    interaction: string,
    houseRules: string
  };
  // private String name;
  name: string,
  // private BigDecimal securityDeposit;
  securityDeposit: number,
  // private BigDecimal cleaningFee;
  cleaningFee: number,
  // private BigDecimal extraPersonFee;
  extraPersonFee: number,
  // private BigDecimal depositRate;
  depositRate: number,
  // private int guestsIncluded;
  guestsIncluded: number,
  // private BigDecimal defaultDailyPrice;
  defaultDailyPrice: number,
  // private BigDecimal weekendPrice;
  weekendPrice: number,
  // private Date checkinStart;
  weekendPrice: string,
  // private Date checkinEnd;
  checkinEnd: string,
  // private Date checkoutStart;
  checkoutStart: string,
  // private Date checkoutEnd;
  checkoutEnd: string,
  // private Long listingType;
  listingType: number,
  // private Set<ListingDetail> details;
  details: [{
    value: string,
    detail: { name: string }
  }],
  // private Long progressId;
  progressId: number
};
