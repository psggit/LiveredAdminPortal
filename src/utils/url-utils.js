export function getBreadCrumbPath() {
  return location.pathname.split('/').slice(1).map(item => item.split('-').join(' ').replace(/%20/g, ' ')).join('  /  ')
}

export function getQueryUri(queryObj) {
  const queryUri = Object.entries(queryObj).map(obj => obj.join('=')).join('&')
  return queryUri
}

export function getUriFromBreadCrumb(path) {
  return path.split('/').map(item => item.split(' ').join('-')).join('/')
}

export function getQueryObj(queryUri) {
  if (!queryUri.length) return {}

  const queryObj = queryUri.replace(/%20/g, ' ').split('&').reduce((a, b) => {
    if (b.split("=")[1] == 'true' || b.split("=")[1] == 'false') {
      a[b.split("=")[0]] = JSON.parse(b.split("=")[1])
    } else {
      a[b.split("=")[0]] = b.split("=")[1]
    }
    return a
  }, {})

  //const queryObj = JSON.parse('{"' + decodeURI(queryUri).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')

  return queryObj
}
