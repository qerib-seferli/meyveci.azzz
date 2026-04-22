function renderFeaturedCard(product, favoriteIds=new Set()){
  const fav = favoriteIds.has(product.id);
  return `
    <article class="product-card featured-card">
      <a class="product-image-link" href="./product.html?slug=${encodeURIComponent(product.slug)}">
        <img class="product-thumb" src="${product.image_url||'./assets/img/placeholders/product-placeholder.png'}" alt="${product.name}">
        <button class="floating-cart" onclick="event.preventDefault();event.stopPropagation();handleFeaturedAddToCart('${product.id}')" aria-label="Səbətə at">🛒</button>
      </a>
      <div class="product-body">
        <div class="product-head-row"><h3 class="product-title clamp-2">${product.name}</h3><span class="unit-badge">${product.unit||'ədəd'}</span></div>
        <div class="price-stack"><strong class="product-price">${Number(product.price).toFixed(2)} ₼</strong>${product.old_price?`<span class="product-old-price">${Number(product.old_price).toFixed(2)} ₼</span>`:''}</div>
        <div class="rating-row">${buildStars(product.rating_avg || 0)}<span>${Number(product.rating_avg||0).toFixed(1)}</span></div>
        <p class="product-desc clamp-2">${product.short_description || product.description || 'Təzə və keyfiyyətli məhsul.'}</p>
        <div class="product-foot-row"><span class="stock-pill">Stok: ${product.stock_quantity ?? 0}</span><button class="fav-toggle ${fav?'active':''}" onclick="event.preventDefault();event.stopPropagation();toggleFeaturedFavorite('${product.id}', this)">♥</button></div>
      </div>
    </article>`;
}
function buildStars(value){ const rounded=Math.round(Number(value)||0); return `<span class="stars">${Array.from({length:5},(_,i)=>`<span class="star ${i<rounded?'filled':''}">★</span>`).join('')}</span>`; }
async function handleFeaturedAddToCart(productId){ try{ const {error}=await UserAPI.addToCart(productId,1); if(error) return showToast(error.message||'Səbətə əlavə olunmadı','error'); showToast('Məhsul səbətə əlavə olundu','success'); }catch(err){ showToast(err.message,'error'); } }
async function toggleFeaturedFavorite(productId,btn){ try{ const {error,action}=await UserAPI.toggleFavorite(productId); if(error) return showToast(error.message||'Əməliyyat alınmadı','error'); btn.classList.toggle('active', action==='added'); showToast(action==='added'?'Sevimlilərə əlavə olundu':'Sevimlilərdən çıxarıldı','success'); }catch(err){ showToast(err.message,'error'); } }
(async function initHome(){
  const heroProducts=document.getElementById('featuredProducts');
  if(!heroProducts||typeof UserAPI==='undefined') return;
  heroProducts.innerHTML='<div class="card">Məhsullar yüklənir...</div>';
  const [{data,error},{data:favIds}] = await Promise.all([UserAPI.getProducts({featured:true}), UserAPI.getFavoriteIds()]);
  if(error){ heroProducts.innerHTML=`<div class="card">Xəta: ${error.message}</div>`; return; }
  if(!data?.length){ heroProducts.innerHTML='<div class="card">Hələ seçilmiş məhsul yoxdur.</div>'; return; }
  const favSet=new Set(favIds||[]);
  heroProducts.innerHTML=data.slice(0,6).map(product=>renderFeaturedCard(product,favSet)).join('');
})();
