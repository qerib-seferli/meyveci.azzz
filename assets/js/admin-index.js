const statsGrid=document.getElementById('statsGrid');
const ordersStateBox=document.getElementById('ordersStateBox');
const logoutBtn=document.getElementById('logoutBtn');
function statCard(title, value, sub=''){ return `<article class="stat-card"><h3>${title}</h3><strong>${value}</strong>${sub?`<p class="muted" style="margin:8px 0 0;">${sub}</p>`:''}</article>`; }
(async function initAdminIndex(){
  const ok = await adminPageGuard(); if(!ok) return;
  await loadAdminSidebar();
  statsGrid.innerHTML = Array.from({length:6},()=>'<article class="stat-card"><h3>Yüklənir</h3><strong>...</strong></article>').join('');
  const {data,error}=await AdminAPI.getDashboardStats();
  if(error){ statsGrid.innerHTML=`<div class="admin-card">Xəta: ${error.message}</div>`; return; }
  const onlineCouriers=(data.couriersRaw||[]).filter(item=>item.is_online).length;
  const paidCount=(data.paymentsRaw||[]).filter(item=>item.status==='paid').length;
  const totalRevenue=(data.paymentsRaw||[]).filter(item=>item.status==='paid').reduce((s,i)=>s+Number(i.amount||0),0).toFixed(2);
  statsGrid.innerHTML=[statCard('Məhsullar', data.products),statCard('Sifarişlər', data.orders),statCard('İstifadəçilər', data.users),statCard('Online kuryerlər', onlineCouriers),statCard('Ödəniş qeydləri', data.payments),statCard('Gəlir', `${totalRevenue} ₼`, `${paidCount} ödəniş`) ].join('');
  const orderGroups={}; (data.ordersRaw||[]).forEach(item=>{ orderGroups[item.status]=(orderGroups[item.status]||0)+1; });
  ordersStateBox.innerHTML = Object.keys(orderGroups).length ? Object.entries(orderGroups).map(([key,value])=>`<div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #edf2ee;"><span>${key}</span><strong>${value}</strong></div>`).join('') : '<p>Sifariş yoxdur.</p>';
  logoutBtn?.addEventListener('click', async()=>{ await AuthService.signOut(); window.location.href='../login.html'; });
})();
