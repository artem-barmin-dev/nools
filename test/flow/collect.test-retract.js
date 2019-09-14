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
  it.describe("two collections + retract + assert after", function(it) {
    var called = 0;
    var flow = nools.flow(
      "collect test 1",
      function(flow) {
        flow.addDefined("Customer", Customer);
        flow.addDefined("Item", Item);
        flow.rule(
          "rule 1",
          { salience: 10, scope: { Customer: Customer, Item: Item } },
          [
            [Array, "allItems", "true", "from collect( item1 : Item)"],
            [
              Array,
              "filledItems",
              "true",
              "from collect( item2 : Item item2.price>10)"
            ]
          ],
          function(facts) {
            console.log(
              "called:",
              facts.filledItems.length,
              facts.allItems.length
            );
            if (facts.filledItems.length == 3 && facts.allItems.length == 4)
              called++;
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
        var bike = new Item("bike", 12, customer);
        var wrong = new Item("bike", 8, customer);
        var car = new Item("car", 2500, customer);
        var someOther = new Item("someOther", 12, customer);
        session.assert(customer);
        session.assert(stroller);
        session.assert(bike);
        session.assert(wrong);
        console.log(">>>>assert good");
        session.assert(car);
        session.match().then(function() {
          console.log(">>>>retract");
          session.retract(bike);
          console.log(">>>>assert");
          session.assert(someOther);
          session.match().then(function() {
            assert(called == 2);
          });
        });
      }
    );
  });
});
