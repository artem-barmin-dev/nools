"use strict";
var it = require("it"),
  assert = require("assert"),
  nools = require("../../");

function Customer(name) {
  this.name = name;
  this.items = [];
}
function Item(type, price, customer) {
  this.type = type;
  this.price = price;
  this.customer = customer;
}

it.describe("collect retract", function(it) {
  it.describe("two collections + retract", function(it) {
    debugger;
    var flow = nools.flow(
      "collect test 1",
      function(flow) {
        flow.addDefined("Customer", Customer);
        flow.addDefined("Item", Item);
        flow.rule(
          "rule 1",
          { salience: 10, scope: { Customer: Customer, Item: Item } },
          [
            [Customer, "c"],
            [
              Array,
              "allItems",
              "true",
              "from collect( item1 : Item item1.customer==c )"
            ],
            [
              Array,
              "filledItems",
              "allItems.length === filledItems.length",
              "from collect( item2 : Item item2.customer==c && item2.price>10 )"
            ]
          ],
          function(facts) {
            console.log("called");
          }
        );
      }
    );
    //
    it.should(
      "rhs for collection called a single time and set avaialable in lhs",
      function() {
        var session = flow.getSession();
        var customer = new Customer("John");
        var stroller = new Item("stroller", 50, customer);
        var bike = new Item("bike", 11, customer);
        var car = new Item("car", 2500, customer);
        session.assert(customer);
        session.assert(stroller);
        session.assert(bike);
        session.assert(car);
        session.match().then(function() {});
        session.retract(customer);
      }
    );
  });
});
