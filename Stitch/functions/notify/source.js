exports = function(changeEvent) {
  var doc = changeEvent.fullDocument;
  const twilio = context.services.get("twil");
  const ourNumber = context.values.get("twilphone");
  const notifyNumber = context.values.get("notifynumber");
  twilio.send({
      from: ourNumber,
      to: notifyNumber,
      body: 'New registration of device token: ' + doc.token
    });
};
