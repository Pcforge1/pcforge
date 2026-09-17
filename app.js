const SUPABASE_URL = "https://oasckbwthiavmyuhmyiz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WT4qALE5VKnEllxiRkc4uw_NuLPYENh";
const CHECKOUT_FUNCTION = `${SUPABASE_URL}/functions/v1/pc-checkout`;

const categories = ["CPU","GPU","Motherboard","RAM","Storage","Case","PSU","Cooling"];
const selected = {};
let parts = [];

const $ = (id) => document.getElementById(id);
const money = (cents) => `$${(cents/100).toFixed(2)}`;

async function loadParts(){
  const res = await fetch(`${SUPABASE_URL}/rest/v1/pc_parts?select=id,category,name,description,price_cents&active=eq.true&order=category,price_cents`,{
    headers:{apikey:SUPABASE_ANON_KEY,Authorization:`Bearer ${SUPABASE_ANON_KEY}`}
  });
  if(!res.ok) throw new Error("Could not load parts.");
  parts = await res.json();
  render();
}

function render(){
  $("categories").innerHTML = categories.map(category => {
    const list = parts.filter(p=>p.category===category);
    return `<div class="category">
      <div class="category-title"><h3>${category}</h3><small>${selected[category] ? "Selected" : "Choose one"}</small></div>
      <div class="options">${list.map(p => `
        <button class="option ${selected[category]===p.id?"selected":""}" data-id="${p.id}">
          <div class="option-name">${escapeHtml(p.name)}</div>
          <div class="option-desc">${escapeHtml(p.description||"")}</div>
          <div class="option-price">${money(p.price_cents)}</div>
        </button>`).join("")}</div>
    </div>`;
  }).join("");

  document.querySelectorAll(".option").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const p = parts.find(x=>x.id===btn.dataset.id);
      selected[p.category]=p.id;
      render();
    });
  });
  updateSummary();
}

function updateSummary(){
  const chosen = categories.map(c=>parts.find(p=>p.id===selected[c])).filter(Boolean);
  const subtotal = chosen.reduce((sum,p)=>sum+p.price_cents,0);
  $("progress").textContent = `${chosen.length} / 8 selected`;
  $("summary").innerHTML = chosen.length
    ? chosen.map(p=>`<div class="summary-row"><span>${p.category}</span><strong>${escapeHtml(p.name)}</strong></div>`).join("")
    : `<div class="muted">Your selected parts will appear here.</div>`;
  $("parts-total").textContent = money(subtotal);
  $("grand-total").textContent = money(subtotal+7500);
  $("checkout").disabled = chosen.length !== 8;
  $("checkout").textContent = chosen.length === 8 ? `Checkout · ${money(subtotal+7500)}` : `Choose all parts`;
}

async function checkout(){
  $("checkout").disabled = true;
  $("checkout").textContent = "Starting checkout...";
  try{
    const res = await fetch(CHECKOUT_FUNCTION,{
      method:"POST",
      headers:{"Content-Type":"application/json",apikey:SUPABASE_ANON_KEY,Authorization:`Bearer ${SUPABASE_ANON_KEY}`},
      body:JSON.stringify({part_ids:categories.map(c=>selected[c])})
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error||"Checkout failed.");
    window.location.href = data.url;
  }catch(err){
    showNotice(err.message);
    updateSummary();
  }
}
function showNotice(text){$("notice").textContent=text;$("notice").classList.remove("hidden")}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
$("checkout").addEventListener("click",checkout);
if(new URLSearchParams(location.search).get("cancelled")) showNotice("Checkout was cancelled. Your build is still here.");
loadParts().catch(err=>showNotice(err.message));
