const models = require('../models');
const Domo = models.Domo;

const makeDomo = (req, res) => {

    if (!req.body.name || !req.body.age || !req.body.color) {
      return res.status(400).json({ error: 'RAWR! Name, age and color are all required!' });
    }
  
    const domoData = {
      name: req.body.name,
      age: req.body.age,
      color: req.body.color,
      owner: req.session.account._id,
    };
  
    const newDomo = new Domo.DomoModel(domoData);
  
    const domoPromise = newDomo.save();
  
    domoPromise.then(() => res.json({ redirect: '/maker' }));
  
    domoPromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Domo already exists' });
      }
  
      return res.status(400).json({ error: 'An error occured' });
    });
  
    return domoPromise;
};

const deleteDomo = (req, res) => {

    console.log(`request body: ${req.body}`);

    return Domo.DomoModel.removeById(req.body._id, (err) => {
      if(err){
        console.log(`Error: ${err}`)
        return res.status(400).json({err: 'An error occured'});
      }
      return res.status(204).json();
    });
}


const makerPage = (req, res) => {
    Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occured' });
        }

        return res.render('app', {csrfToken: req.csrfToken(), domos: docs });
    });
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if(err){
      console.log(err);
      return res.status(400).json({error: 'An error occurred'});
    }

    return res.json({domos: docs});
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.deleteDomo = deleteDomo;
