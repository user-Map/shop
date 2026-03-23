let currentUser = null;

async function login(){
  const email = emailInput().value;
  const password = passInput().value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email, password
  });

  if(error){
    alert(error.message);
    return;
  }

  currentUser = data.user;
  showApp();
}

async function register(){
  const email = emailInput().value;
  const password = passInput().value;

  const { error } = await supabaseClient.auth.signUp({
    email, password
  });

  if(error){
    alert(error.message);
  } else {
    alert("Registered!");
  }
}

function emailInput(){
  return document.getElementById("email");
}
function passInput(){
  return document.getElementById("password");
}

async function showApp(){
  document.getElementById("auth").style.display = "none";
  document.getElementById("app").style.display = "block";

  document.getElementById("user").innerText = currentUser.email;

  loadBalance();
}

async function loadBalance(){
  let { data } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .single();

  if(!data){
    await supabaseClient.from("profiles").insert({
      id: currentUser.id,
      email: currentUser.email,
      balance: 0
    });
    data = { balance: 0 };
  }

  document.getElementById("balance").innerText = "Balance: " + data.balance;
}

async function buy(price, name){
  let { data } = await supabaseClient
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

  alert("Mua " + name + " thành công!");
  loadBalance();
}

function showTab(tab){
  document.getElementById("buy").style.display = tab === "buy" ? "block" : "none";
  document.getElementById("free").style.display = tab === "free" ? "block" : "none";
}

function logout(){
  supabaseClient.auth.signOut();
  location.reload();
}

/* auto session */
supabaseClient.auth.getSession().then(({ data }) => {
  if(data.session){
    currentUser = data.session.user;
    showApp();
  }
});
