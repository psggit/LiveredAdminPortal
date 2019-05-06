const express = require('express');
const path = require('path')
const app = express();
// const ASSET_PATH = process.env.ASSET_PATH || '/'

app.get('*.js', function (req, res, next) {
  const runtimeUrlRegex = /runtime.*.js/
  const vendorUrlRegex = /vendor.*.js/
  if(!runtimeUrlRegex.test(req.url)) {
     req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
  } 
  if (vendorUrlRegex.test(req.url)) {
    res.setHeader('Cache-Control', 'private, max-age=31536000')
  }
  next();
});

app.use('/admin', express.static(path.join(__dirname, 'dist')))

app.get('/*', (req, res)=>{
  //console.log(req.query);
  res.sendFile(path.join(__dirname, 'dist/index.html'), (err) => {
    if (err) {
      res.status(500).send(err)
    }
  })
});

// Serve the files on port 3000.
app.listen(8080, function () {
  console.log('Example app listening on port 3000!\n');
});