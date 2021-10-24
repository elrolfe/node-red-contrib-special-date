const checkDate = require("./checkDate");

function setupDates(dateList, defaultResposne) {
  let maxDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let nodeDates = [];

  dateList.forEach(entry => {
    if (entry.response.trim().length === 0) return;

    switch (entry.type) {
      case "date":
        if (entry.startDate < 1 || entry.startDate > maxDays[entry.startMonth]) return;
        break;

      case "range":
        if (entry.startDate < 1 || entry.startDate > maxDays[entry.startMonth] || entry.endDate < 1 || entry.endDate > maxDays[entry.endMonth]) return;
        break;

      case "ordinal-offset":
        if (entry.offsetOrdinalBefore < 0 || entry.offsetOrdinalAfter < 0) return;
        break;
    }

    nodeDates.push(entry);
  });

  nodeDates.push({
    type: "default",
    response: defaultResposne,
  });

  return nodeDates;
}

module.exports = function (RED) {
  function SpecialDateNode(config) {
    RED.nodes.createNode(this, config);
    let node = this;

    node.dates = setupDates(config.dates, config.defaultResponse);
    node.messageProperty = config.messageProperty;

    const run = function(msg, send, done) {
      if (!msg) msg = {};

      try {
        msg[node.messageProperty] = checkDate(new Date(), node.dates);
      } catch (err) {
        if (node.showStatus)
          node.status({ fill: "red", shape: "dot", text: err.message || err });

        if (done)
          done(err);
        else
          node.error(err, msg);

        return;
      }

      node.status({ fill: "green", shape: "dot", text: msg[node.messageProperty] });

      if (send)
        send(msg);
      else
        node.send(msg);
    }

    node.on("input", run);
  }

  RED.nodes.registerType("special-date", SpecialDateNode);
};
