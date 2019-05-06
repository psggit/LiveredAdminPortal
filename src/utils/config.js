
// function getAPIObj() {
//   if (window.location.href.split(':')[1] === '//localhost' || window.location.href.split(':')[1] === '//192.168.5.1') {
    
//     let scheme = 'https'
//     let baseHost = '.amebae21.hasura-app.io'
//     let appName = 'amebae21'
//     return {
//       authUrl: 'https://auth.' + appName + '.hasura-app.io',
//       blogicUrl: 'https://api1.' + appName + '.hasura-app.io',
//       gremlinUrl: scheme + '://gremlin' + baseHost,
//       odin: scheme + '://odin' + baseHost,
//       catman: scheme + '://catman' + baseHost,
//       orderman: scheme + '://orderman' + baseHost,
//       socketUrl: 'https://livered' + baseHost,
//       api2: 'https://api2.' + appName + '.hasura-app.io',
//       catalogsystem: 'https://catalogsystem.' + appName + '.hasura-app.io',
//       retailerMgmt: 'https://retailer.' + appName + '.hasura-app.io',
//       stockandprice: 'https://stockandprice.' + appName + '.hasura-app.io',
//     }
//   } else {
//     let scheme = window.location.href.split(':')[0]
//     let baseHost = window.location.hostname.match(/.*?(\..*)/)[1]
//     let subdomain = window.location.hostname.split('.')[0]
//     //console.log("scheme", scheme, "baseHost", baseHost, "subdomain", subdomain)
//     // let authUrl = subdomain === 'support' || subdomain === 'delivery'
//     //               ? scheme + '://auth' + baseHost
//     //               : scheme + '://gremlin' + baseHost
//     let authUrl =  scheme + '://auth' + baseHost

//     return {
//       authUrl: authUrl,
//       blogicUrl: scheme + '://api1' + baseHost,
//       gremlinUrl: scheme + '://gremlin' + baseHost,
//       odin: scheme + '://odin' + baseHost,
//       catman: scheme + '://catman' + baseHost,
//       orderman: scheme + '://orderman' + baseHost,
//       socketUrl: scheme + '://livered' + baseHost,
//       api2: scheme + '://api2' + baseHost,
//       catalogsystem: scheme + '://catalogsystem' + baseHost,
//       retailerMgmt: scheme + '://retailer' + baseHost,
//       stockandprice: scheme + '://stockandprice' + baseHost,
//     }
//   }
// }

// // export const api_base_url = getApiBaseUrl()
// // export const host_server = getHostServer()

// export const Api = getAPIObj()

function getAPIObj() {
  // console.log(BASE_URL)
  console.log(process.env.BASE_URL)
  const baseHost = process.env.BASE_URL
  console.log("basehost", baseHost)
  return {
    //livered: '192.168.5.86:8084',
    api1: 'https://api1.' + baseHost,
    authUrl: "https://auth." + baseHost,
  }
}

// export const api_base_url = getApiBaseUrl()
// export const host_server = getHostServer()

export const Api = getAPIObj()

