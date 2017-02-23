
function load(req, res, next, id) {
  const projects = req.db.get("titles");
  projects.findOne({ identifier: id})
    .then((project) => {
      req.project = project;
      next();
    })
    .catch((err) => {
      next();
    });
}

function get(req, res) {
  if (req.project) {
    res.status(200).json(req.project);
  } else {
    res.status(404).json({});
  }
}

function update(req, res, next) {
}

function list(req, res, next) {
  const projects = req.db.get("titles");
  projects.find()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}

function getShots(req, res, next) {
  if (req.project) {
    const shots = req.db.get("shots");

    shots.find({titleId: req.project._id})
      .then((docs) => {
        res.status(200).json(docs);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    res.status(404).json({});
  }
}

function getChapters(req, res, next) {
  if (req.project) {
    const chapters = req.db.get("chapters");

    chapters.find({titleId: req.project._id})
      .then((docs) => {
        res.status(200).json(docs);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    res.status(404).json({});
  }
}

function getSubtitles(req, res, next) {
  if (req.project) {
    const subtitles = req.db.get("subtitles");
    const searchQuery = req.query.search;

    var find;
    if (searchQuery) {
      const query = {titleId: req.project._id, $text: {$search: req.query.search, $language: 'en'}};

      find = subtitles.find(query, {fields: {score: {$meta: "textScore"}}, sort: {score: {$meta: "textScore"}}})
    } else {
      find = subtitles.find({titleId: req.project._id})
    }

    find
        .then((docs) => {
          res.status(200).json(docs);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
  } else {
    res.status(404).json({});
  }
}

function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

export default { load, get, update, list, remove, getShots, getChapters, getSubtitles};
