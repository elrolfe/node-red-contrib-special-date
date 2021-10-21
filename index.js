// function checkDate(specialDates, date = new Date()) {

// }

module.exports = function (RED) {
  function SpecialDateNode(config) {
    RED.nodes.createNode(this, config);

    let node = this;

    node.dates = config.dates || [];
    node.defaultResponse = config.defaultResponse || "No match";

    node.on("input", function(msg, send, done) {
      console.log(node.dates);
      send({ ...msg, payload: node.defaultResponse });
      if (done) done();
    });
  }

  RED.nodes.registerType("special-date", SpecialDateNode);
};
