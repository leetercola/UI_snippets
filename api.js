const app = express();
const expressWs = require('express-ws')(app);

app.use(function CORS(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());
// Need to set a high limit for very large Form POSTs of HTML strings, otherwise express throws a 413 error.
// 500kb is just an arbitrary value I picked, we can choose what we want based on what we think the largest possible
// payload will be. Solution from http://stackoverflow.com/questions/19917401/node-js-express-request-entity-too-large
app.use(bodyParser.urlencoded({extended: false, limit: '10mb'}));

const filePaths = [];
const registeredRoutes = [];

fs.walk('./api/routes')
  .on('readable', function readable() {
    let item;
    while ((item = this.read())) {
      if (item.path.endsWith('.js')) {
        filePaths.push(item.path);
      }
    }
  })
  .on('end', function end() {
    _.each(filePaths, function loop(r) {
      var rMod = require(r);

      if (!rMod.hasOwnProperty('routes')) {
        console.warn('Module: ' + r + ' doesn\'t define any routes.');
      } else {
        if (typeof(rMod.routes) === 'function' && rMod.routes.length === 1) {
          rMod.routes(app);
        } else {
          let _routes;

          if (typeof(rMod.routes) === 'function') {
            _routes = rMod.routes();
          } else {
            _routes = rMod.routes;
          }

          _.each(_routes, function loopTwo(val, routePath) {
            _.each(val, function loopThree(bindFunc, httpMethod) {
              var route = r.replace(__dirname, '').replace('/routes', '').replace('.js', '');

              if (routePath.match(/^\//)) {
                route = routePath;
              } else if (routePath !== '_') {
                route = route + '/' + routePath;
              }

              // console.log('loading route: ', route);
              app[httpMethod](route, bindFunc);
              registeredRoutes.push(route);
            });
          });
        }
      }
    });
  });

// Need to implement this after the routes array has been filled
app.use(versioning(registeredRoutes));
app.use(securityHeaders);

if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
