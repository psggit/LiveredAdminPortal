
function getAPIObj() {
  console.log(process.env.BASE_URL)
  const baseHost = process.env.BASE_URL
  return {
    api1: 'https://api1.' + baseHost,
    authUrl: "https://auth." + baseHost,
  }
}

// export const api_base_url = getApiBaseUrl()
// export const host_server = getHostServer()

export const Api = getAPIObj()

