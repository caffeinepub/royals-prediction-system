import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

actor {
  type Commodity = {
    name : Text;
    hindiName : Text;
    marathiName : Text;
    category : Text;
    unit : Text;
    emoji : Text;
  };

  type Market = {
    name : Text;
    region : Text;
    state : Text;
  };

  type PriceRecord = {
    commodity : Text;
    market : Text;
    date : Int;
    price : Float;
  };

  type NewsItem = {
    title : Text;
    content : Text;
    market : Text;
    timestamp : Int;
  };

  module PriceRecord {
    public func compare(p1 : PriceRecord, p2 : PriceRecord) : Order.Order {
      if (p1.date < p2.date) { return #less };
      if (p1.date > p2.date) { return #greater };
      #equal;
    };
  };

  module NewsItem {
    public func compare(n1 : NewsItem, n2 : NewsItem) : Order.Order {
      if (n1.timestamp < n2.timestamp) { return #less };
      if (n1.timestamp > n2.timestamp) { return #greater };
      #equal;
    };
  };

  // Data storage
  var commodityMap = Map.empty<Text, Commodity>();
  var marketMap = Map.empty<Text, Market>();
  var priceRecordMap = Map.empty<Nat, PriceRecord>();
  var newsMap = Map.empty<Nat, NewsItem>();

  var nextPriceRecordId = 0;
  var nextNewsId = 0;

  // Seed data (called once by admin)
  public shared ({ caller }) func seedData() : async () {
    seedCommodities();
    seedMarkets();
  };

  func seedCommodities() {
    let commodities : [Commodity] = [
      { name = "Tomato"; hindiName = "Tamatar"; marathiName = "टमाटर"; category = "Vegetable"; unit = "KG"; emoji = "🍅" },
      { name = "Onion"; hindiName = "Pyaaz"; marathiName = "कांदा"; category = "Vegetable"; unit = "KG"; emoji = "🧅" },
      { name = "Potato"; hindiName = "Aloo"; marathiName = "बटाटा"; category = "Vegetable"; unit = "KG"; emoji = "🥔" },
      { name = "Wheat"; hindiName = "Gehu"; marathiName = "गहू"; category = "Grain"; unit = "KG"; emoji = "🌾" },
      { name = "Rice"; hindiName = "Chawal"; marathiName = "तांदूळ"; category = "Grain"; unit = "KG"; emoji = "🍚" },
      { name = "Mango"; hindiName = "Aam"; marathiName = "आंबा"; category = "Fruit"; unit = "KG"; emoji = "🥭" },
      { name = "Banana"; hindiName = "Kela"; marathiName = "केळी"; category = "Fruit"; unit = "Dozen"; emoji = "🍌" },
      { name = "Cauliflower"; hindiName = "Gobi"; marathiName = "फूलकोबी"; category = "Vegetable"; unit = "KG"; emoji = "🥦" },
    ];

    let iter = commodities.values();
    let iterWithKeys = iter.map(func(commodity) { (commodity.name, commodity) });
    commodityMap := Map.fromIter(iterWithKeys);
  };

  func seedMarkets() {
    let markets : [Market] = [
      { name = "Nasik"; region = "West"; state = "Maharashtra" },
      { name = "Pune"; region = "West"; state = "Maharashtra" },
      { name = "Delhi"; region = "North"; state = "Delhi" },
      { name = "Bangalore"; region = "South"; state = "Karnataka" },
    ];

    let iter = markets.values();
    let iterWithKeys = iter.map(func(market) { (market.name, market) });
    marketMap := Map.fromIter(iterWithKeys);
  };

  // Commodity functions
  public query ({ caller }) func getCommodity(name : Text) : async Commodity {
    switch (commodityMap.get(name)) {
      case (null) { Runtime.trap("Commodity not found") };
      case (?commodity) { commodity };
    };
  };

  public query ({ caller }) func getAllCommodities() : async [Commodity] {
    commodityMap.values().toArray();
  };

  // Market functions
  public query ({ caller }) func getMarket(name : Text) : async Market {
    switch (marketMap.get(name)) {
      case (null) { Runtime.trap("Market not found") };
      case (?market) { market };
    };
  };

  public query ({ caller }) func getAllMarkets() : async [Market] {
    marketMap.values().toArray();
  };

  // Price record functions
  public shared ({ caller }) func addPriceRecord(commodity : Text, market : Text, price : Float) : async () {
    let record : PriceRecord = {
      commodity;
      market;
      date = Time.now();
      price;
    };
    priceRecordMap.add(nextPriceRecordId, record);
    nextPriceRecordId += 1;
  };

  public query ({ caller }) func getPriceHistory(commodity : Text, market : Text, days : Int) : async [PriceRecord] {
    let cutoffTime = Time.now() - (days * 24 * 60 * 60 * 1000000000); // days in nanoseconds
    priceRecordMap.values().filter(
      func(record) { record.commodity == commodity and record.market == market and record.date >= cutoffTime }
    ).toArray();
  };

  // News functions
  public shared ({ caller }) func addNewsItem(title : Text, content : Text, market : Text) : async () {
    let news : NewsItem = {
      title;
      content;
      market;
      timestamp = Time.now();
    };
    newsMap.add(nextNewsId, news);
    nextNewsId += 1;
  };

  public query ({ caller }) func getNewsForMarket(market : Text) : async [NewsItem] {
    newsMap.values().filter(
      func(news) { news.market == market }
    ).toArray();
  };

  public query ({ caller }) func getAllNews() : async [NewsItem] {
    newsMap.values().toArray().sort();
  };
};
