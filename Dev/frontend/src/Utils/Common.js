// return the user data from the session storage
export const getUser = () => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    else return null;
  }
   
  export const getEmail = () => {
    const emailStr = sessionStorage.getItem('email');
    if (emailStr){
      return JSON.parse(emailStr)
    }else {
      return null;
    }
  }
  export const getRole = () => {
    const roleStr = sessionStorage.getItem('role');
    if (roleStr){
      return JSON.parse(roleStr)
    }else {
      return null;
    }
  }
  
  export const getId = () => {
    const IdStr = sessionStorage.getItem('id');
    if (IdStr){
      return JSON.parse(IdStr)
    }else {
      return null;
    }
  }
  
  
  // return the token from the session storage
  export const getToken = () => {
    return sessionStorage.getItem('token') || null;
  }
  
  // remove the token and user from the session storage
  export const removeUserSession = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('id');
  }
  
  // set the token and user from the session storage
  export const setUserSession = (token, user, email, role, id) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('role', JSON.stringify(role));
    sessionStorage.setItem('email', JSON.stringify(email));
    sessionStorage.setItem('id', JSON.stringify(id));
  }