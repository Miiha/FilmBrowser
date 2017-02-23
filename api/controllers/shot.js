function load(req, res, next, id) {
}

function get(req, res) {
  return res.json(req.shot);
}

function update(req, res, next) {
}

function list(req, res, next) {
  const shots = req.db.get("shots");
  shots.find()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}

function remove(req, res, next) {
  const shot = req.user;
  shot.remove()
    .then(deletedShot => res.json(deletedUser))
    .catch(e => next(e));
}

export default { load, get, update, list, remove };
