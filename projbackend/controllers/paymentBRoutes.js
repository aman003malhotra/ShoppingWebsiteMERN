var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId:"zzsj9t8b4pcpjjbj",
  publicKey:"9mbcwhy78w9gc8hm",
  privateKey:"df361d87422cadf1bbe6306ff8f48628"
});


exports.getToken = (req,res) =>{
  gateway.clientToken.generate({}, function (err, response) {
  if(err){
    res.status(500).send(err); // don't use json it is not properly formatted
  }else{
    res.send(response);
  }
});
};


exports.processPayment = (req,res) =>{
  let nonceFromTheClient = req.body.paymentMethodNonce
  let amountFromTheClient = req.body.amount

  gateway.transaction.sale({
  amount: amountFromTheClient,
  paymentMethodNonce: nonceFromTheClient,
  // deviceData: deviceDataFromTheClient,
  options: {
    submitForSettlement: true
  }
}, function (err, result) {
    if(err){
      return res.status(500).json(err);
    }else{
      return res.json(result);
    }
  });
};
