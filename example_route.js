const index = function index(req, res, done) {
  res.send('test shit yo!');
};

const post = function post(req, res) {
  res.send('im /example post request');
};

const get = function get(req, res) {
  res.send('sending id' + req.params.id);
};

exports.routes = function routes() {
  return {
    _: {
      get: index,
      post: post
    },
    ':type': {
      post: post
    }
  };
};
