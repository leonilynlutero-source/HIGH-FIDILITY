var Auth = (function () {
  var USERS = "bcirs_users", SESSION = "bcirs_session";

  function readUsers() {
    try { return JSON.parse(localStorage.getItem(USERS)) || []; }
    catch (e) { return []; }
  }
  function writeUsers(list) { localStorage.setItem(USERS, JSON.stringify(list)); }
  function norm(s) { return String(s).trim().toLowerCase(); }
  function indexOfEmail(list, email) {
    for (var i = 0; i < list.length; i++) {
      if (norm(list[i].email) === norm(email)) return i;
    }
    return -1;
  }

  return {
    signup: function (u) {
      if (!u.name || !u.dob || !u.sex || !u.email || !u.password) return "Fill in every field.";
      var list = readUsers();
      if (indexOfEmail(list, u.email) !== -1) return "That email is already registered.";
      list.push(u);
      writeUsers(list);
      return "";
    },
    login: function (email, pass, role) {
      if (!email || !pass) return "Enter your email and password.";
      var list = readUsers(), i = indexOfEmail(list, email);
      if (i === -1 || list[i].password !== pass) return "Wrong email or password.";
      if (role && list[i].role !== role) return "This is not a " + role + " account.";
      sessionStorage.setItem(SESSION, list[i].email);
      return "";
    },
    current: function () {
      var email = sessionStorage.getItem(SESSION);
      if (!email) return null;
      var list = readUsers(), i = indexOfEmail(list, email);
      return i === -1 ? null : list[i];
    },
    require: function (role, loginPage) {
      var u = Auth.current();
      if (!u || (role && u.role !== role)) {
        window.location.replace(loginPage || "login.html");
        return null;
      }
      return u;
    },
    update: function (data) {
      var email = sessionStorage.getItem(SESSION);
      var list = readUsers(), i = indexOfEmail(list, email);
      if (i === -1) return "Please sign in again.";
      var j = indexOfEmail(list, data.email);
      if (j !== -1 && j !== i) return "That email is used by another account.";
      data.role = list[i].role;
      list[i] = data;
      writeUsers(list);
      sessionStorage.setItem(SESSION, data.email);
      return "";
    },
    logout: function () { sessionStorage.removeItem(SESSION); }
  };
})();
