let currentUser = null;

/* LOGIN */
async function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email, password
  });

  if(data.user){
    currentUser = data.user;
    initApp();
  } else {
    status.innerText = error.message;
  }
}

/* REGISTER */
async function register(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({
    email, password
  });

  status.innerText = error ? error.message : "Register OK";
}

/* INIT */
async function initApp(){
  document.getElementById("auth").style.display="none";
  document.getElementById("app").style.display="block";

  document.getElementById("user").innerText = currentUser.email;

  loadBalance();
}

/* LOAD BALANCE */
async function loadBalance(){
  let { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .single();

  document.getElementById("balance").innerText =
    "Balance: " + (data?.balance || 0);
}

/* BUY */
async function buy(name, price){

  let { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .single();

  if(data.balance < price){
    alert("Không đủ tiền");
    return;
  }

  await supabase
    .from("profiles")
    .update({ balance: data.balance - price })
    .eq("id", currentUser.id);

  await supabase.from("orders").insert({
    user_id: currentUser.id,
    package: name,
    price: price
  });

  alert("Mua thành công!");
  loadBalance();
}

/* LOGOUT */
async function logout(){
  await supabase.auth.signOut();
  location.reload();
}

/* AUTO SESSION */
supabase.auth.getSession().then(({ data }) => {
  if(data.session){
    currentUser = data.session.user;
    initApp();
  }
});
