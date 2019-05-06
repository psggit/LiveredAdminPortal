export function getHasuraRole(data) {
  const hasuraRoles = data.hasura_roles
  // const hasuraRoles = ["user", "support_person", "excise", "support_admin"]
  const rolesMap = {
    "user": 1,
    "admin": 6,
    "excise-person": 3,
    "squad_leader": 5,
    "squad_member": 4
  }
  let maxRole = rolesMap["user"]
  let xHasuraRole = "user"
  for(let i=0; i<hasuraRoles.length; i++) {
    if (maxRole < rolesMap[hasuraRoles[i]]) {
      maxRole = rolesMap[hasuraRoles[i]]
      xHasuraRole = hasuraRoles[i]
    }
  }
  return xHasuraRole
}

export function getHasuraId(data) {
  const hasuraId = data.hasura_id
  return hasuraId
}


export function createSession(data) {
  localStorage.setItem('x-hasura-role', getHasuraRole(data))
  localStorage.setItem('hasura-id', getHasuraId(data))
}
