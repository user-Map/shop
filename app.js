let currentUser = null;

/* LOGIN */
async function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if(error){
    alert(error.message);
  } else {
    currentUser = data.user;
    showApp();
  }
}

/* REGISTER */
async function register(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if(error){
    alert(error.message);
  } else {
    alert("Register success");
  }
}

/* SHOW APP */
async function showApp(){
  document.getElementById("auth").style.display = "none";
  document.getElementById("app").style.display = "block";

  document.getElementById("user").innerText = currentUser.email;

  loadBalance();
}

/* LOAD BALANCE */
async function loadBalance(){
  const { data } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .single();

  document.getElementById("balance").innerText =
    "Balance: " + (data?.balance || 0);
}

/* BUY */
async function buy(name, price){
  const { data } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .single();

  if(!data || data.balance < price){
    alert("Không đủ tiền");
    return;
  }

  await supabaseClient
    .from("profiles")
    .update({ balance: data.balance - price })
    .eq("id", currentUser.id);

  alert("Mua thành công!");
  loadBalance();
}

/* AUTO SESSION */
supabaseClient.auth.getSession().then(({ data }) => {
  if(data.session){
    currentUser = data.session.user;
    showApp();
  }
});
