var $ = function (s) { return document.querySelector(s) }, C = {
    Coffee: ['#8a5230', 'Espresso', 'Double shot, bold and syrupy', 110, 'Americano', 'Espresso with hot water', 120, 'Latte', 'Silky steamed milk, light crema', 145, 'Cappuccino', 'Equal thirds, thick foam', 145, 'Mocha', 'Espresso, cocoa, steamed milk', 160, 'Spanish Latte', 'Sweet condensed milk, strong espresso', 165, 'Caramel Macchiato', 'Vanilla, milk, espresso, caramel drizzle', 175],
    'Cold Coffee': ['#5a3a28', 'Iced Latte', 'Espresso over cold milk and ice', 150, 'Cold Brew', 'Steeped 18 hours, ultra smooth', 160, 'Iced Mocha', 'Chocolate and espresso, chilled', 165, 'Brown Sugar Coffee', 'Muscovado syrup, creamy milk', 170],
    'Non-Coffee': ['#6f8a63', 'Matcha Cream', 'Ceremonial matcha, sweet cream cap', 175, 'Hot Chocolate', 'Dark cocoa, steamed milk', 140, 'Strawberry Milk', 'Fresh strawberry, cold milk', 150, 'Peach Fruit Tea', 'Black tea, peach, honey', 130],
    'Pastries': ['#c68a52', 'Butter Croissant', 'Flaky, golden, baked each morning', 95, 'Cinnamon Roll', 'Warm, cream cheese glaze', 120, 'Blueberry Muffin', 'Soft crumb, jammy centre', 90, 'Choc Chip Cookie', 'Chewy, sea salt top', 75],
    'Desserts': ['#a0522d', 'Basque Cheesecake', 'Burnt top, creamy inside', 185, 'Chocolate Cake', 'Three layers, ganache', 170, 'Tiramisu', 'Espresso-soaked, mascarpone', 180]
};
var F = [['Bara Signature Latte', 'Brown sugar, oat cream, double shot', 180, 'Coffee', '#8a5230'], ['Brown Sugar Iced Coffee', 'Muscovado and cold milk', 170, 'Cold', '#5a3a28'], ['Caramel Cloud', 'Whipped caramel foam over espresso', 175, 'Coffee', '#c68a52'], ['Spanish Latte', 'Condensed milk, strong espresso', 165, 'Coffee', '#a8672f'], ['Matcha Cream', 'Ceremonial matcha, sweet cream', 175, 'Non-coffee', '#6f8a63'], ['Chocolate Mocha', 'Dark cocoa meets espresso', 160, 'Coffee', '#4a2a17'], ['Butter Croissant', 'Flaky and still warm', 95, 'Pastry', '#d9a35f'], ['Chocolate Cake', 'Three layers of ganache', 170, 'Dessert', '#7a3b20']];
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') }
function card(n, d, p, c, k) { return '<div class="pc"><div class="pi" style="background:' + c + '"><svg viewBox="0 0 100 100"><use href="#cp"/></svg></div><div class="pb"><small>' + esc(k) + '</small><h3>' + esc(n) + '</h3><p>' + esc(d) + '</p><div class="pr">₱' + p + '<button class="add-cart" type="button" data-name="' + esc(n) + '" data-price="' + p + '" aria-label="Add ' + esc(n) + ' to cart">+</button></div></div></div>' }
$('#fg').innerHTML = F.map(function (x) { return card(x[0], x[1], x[2], x[4], x[3]) }).join('');
function show(k) { var a = C[k], h = ''; for (var i = 1; i < a.length; i += 3)h += card(a[i], a[i + 1], a[i + 2], a[0], k); $('#mg').innerHTML = h;[].forEach.call($('#mg').children, function (e, i) { e.style.animationDelay = i * 60 + 'ms' });[].forEach.call($('#tb').children, function (b) { b.classList.toggle('on', b.textContent == k) }) }
$('#tb').innerHTML = Object.keys(C).map(function (k) { return '<button>' + esc(k) + '</button>' }).join(''); $('#tb').onclick = function (e) { if (e.target.tagName == 'BUTTON') show(e.target.textContent) }; show('Coffee');
var cart = [], returnFocus = null;
function money(amount) { return '₱' + amount.toLocaleString('en-PH') }
function renderCart() {
    var list = $('#cart-items'), total = 0, count = 0;
    list.textContent = '';
    cart.forEach(function (item, index) {
        var row = document.createElement('li'), details = document.createElement('div'), name = document.createElement('strong'), each = document.createElement('small'), controls = document.createElement('div'), minus = document.createElement('button'), quantity = document.createElement('span'), plus = document.createElement('button'), subtotal = document.createElement('strong');
        row.className = 'cart-row'; details.className = 'cart-item-details'; controls.className = 'cart-quantity';
        name.textContent = item.name; each.textContent = money(item.price) + ' each'; details.appendChild(name); details.appendChild(each);
        minus.type = plus.type = 'button'; minus.textContent = '−'; plus.textContent = '+';
        minus.setAttribute('aria-label', 'Remove one ' + item.name); plus.setAttribute('aria-label', 'Add one ' + item.name);
        minus.setAttribute('data-cart-action', 'decrease'); plus.setAttribute('data-cart-action', 'increase');
        minus.setAttribute('data-cart-index', index); plus.setAttribute('data-cart-index', index);
        quantity.textContent = item.quantity; controls.appendChild(minus); controls.appendChild(quantity); controls.appendChild(plus);
        subtotal.textContent = money(item.price * item.quantity);
        row.appendChild(details); row.appendChild(controls); row.appendChild(subtotal); list.appendChild(row);
        total += item.price * item.quantity; count += item.quantity;
    });
    $('#cart-count').textContent = count;
    $('#cart-trigger').setAttribute('aria-label', 'Shopping cart, ' + count + (count === 1 ? ' item' : ' items'));
    $('#cart-empty').hidden = cart.length > 0;
    $('#cart-total').textContent = money(total);
    $('#cart-checkout').disabled = cart.length === 0;
    $('#cart-status').textContent = count ? count + (count === 1 ? ' item' : ' items') + ' in cart' : 'Cart is empty';
}
function addToCart(name, price) {
    var item = null;
    cart.forEach(function (entry) { if (entry.name === name) item = entry });
    if (item) item.quantity++;
    else cart.push({ name: name, price: price, quantity: 1 });
    renderCart();
}
function openCart() {
    returnFocus = document.activeElement;
    $('#cart-view').hidden = false; $('#order-confirmation').hidden = true;
    $('#md').setAttribute('aria-labelledby', 'cart-title');
    $('#md').classList.add('on'); $('#mc').focus();
}
function closeCart() {
    $('#md').classList.remove('on');
    if (returnFocus && returnFocus.focus) returnFocus.focus();
}
document.addEventListener('click', function (e) {
    var open = e.target.closest('.cart-open'), add = e.target.closest('.add-cart'), action = e.target.closest('[data-cart-action]');
    if (open) {
        if ($('#ul').classList.contains('on')) { $('#hb').classList.remove('x'); $('#ul').classList.remove('on') }
        openCart();
    } else if (add) {
        addToCart(add.getAttribute('data-name'), Number(add.getAttribute('data-price')));
        add.textContent = '✓'; clearTimeout(add._resetTimer);
        add._resetTimer = setTimeout(function () { if (document.body.contains(add)) add.textContent = '+' }, 800);
    } else if (action) {
        var index = Number(action.getAttribute('data-cart-index')), item = cart[index];
        if (!item) return;
        if (action.getAttribute('data-cart-action') === 'increase') item.quantity++;
        else if (--item.quantity === 0) cart.splice(index, 1);
        renderCart();
    }
});
$('#mc').onclick = closeCart;
$('#confirmation-close').onclick = closeCart;
$('#md').onclick = function (e) { if (e.target === this) closeCart() };
$('#cart-checkout').onclick = function () {
    if (!cart.length) return;
    cart = []; renderCart();
    $('#cart-view').hidden = true; $('#order-confirmation').hidden = false; $('#confirmation-close').focus();
    $('#md').setAttribute('aria-labelledby', 'confirmation-title');
};
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && $('#md').classList.contains('on')) closeCart();
    if (e.key === 'Tab' && $('#md').classList.contains('on')) {
        var buttons = $('#md').querySelectorAll('button:not([disabled])'), first = buttons[0], last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
});
renderCart();
var G = [['☕', 'Fresh pour', '#8a5230', 200], ['🎨', 'Latte art', '#c68a52', 260], ['🛋️', 'Cozy corner', '#6b3f24', 220], ['👩‍🍳', 'Our baristas', '#4a2a17', 280], ['🥐', 'Morning bakes', '#d9a35f', 200], ['🫘', 'Single-origin beans', '#5a3a28', 240], ['🌙', 'Evening glow', '#2a1810', 220], ['🍰', 'Dessert case', '#a0522d', 260], ['👯', 'Catch-up table', '#6f8a63', 200]];
$('#gl').innerHTML = G.map(function (g, i) { return '<div class="gi" data-i="' + i + '" style="background:' + g[2] + '"><div style="height:' + g[3] + 'px">' + g[0] + '</div><span>' + g[1] + '</span></div>' }).join('');
$('#gl').onclick = function (e) { var g = e.target.closest('.gi'); if (!g) return; var d = G[g.dataset.i]; $('#lbi').style.background = d[2]; $('#lbi').textContent = d[0]; $('#lbp').textContent = d[1]; $('#lb').classList.add('on') }; $('#lb').onclick = function () { this.classList.remove('on') };
var T = [['The Spanish Latte is dangerously good.', 'Mia'], ['My new favorite work-from-café spot.', 'Daniel'], ['The pastries disappear way too quickly.', 'Andrea'], ['Perfect for a quiet first date. We stayed three hours.', 'Paolo'], ['They remembered my order on the second visit.', 'Kaye'], ['Best cold brew in the city, honestly.', 'Rico']], ti = 0;
$('#ts').innerHTML = T.map(function (t, i) { return '<div class="t' + (i ? '' : ' on') + '"><q>“' + t[0] + '”</q><b>— ' + t[1] + '</b></div>' }).join(''); $('#dt').innerHTML = T.map(function (t, i) { return '<button class="' + (i ? '' : 'on') + '" aria-label="Slide ' + (i + 1) + '"></button>' }).join('');
function go(i) { ti = i;[].forEach.call($('#ts').children, function (e, j) { e.classList.toggle('on', j == i) });[].forEach.call($('#dt').children, function (e, j) { e.classList.toggle('on', j == i) }) }
$('#dt').onclick = function (e) { var b = [].indexOf.call($('#dt').children, e.target); if (b > -1) go(b) }; setInterval(function () { go((ti + 1) % T.length) }, 4500);
[].forEach.call(document.querySelectorAll('form.demo'), function (f) { f.onsubmit = function (e) { e.preventDefault(); f.querySelector('.ok').style.display = 'block'; f.reset() } });
function done() { $('#ld').classList.add('out') } setTimeout(done, 3600); $('#sk').onclick = done;
var nv = $('#nv'); addEventListener('scroll', function () { nv.classList.toggle('sc', scrollY > 40); $('.sv').style.setProperty('--py', ((scrollY - $('#story').offsetTop) * .06) + 'px') }, { passive: true });
$('#hb').onclick = function () { this.classList.toggle('x'); $('#ul').classList.toggle('on') }; $('#ul').onclick = function (e) { if (e.target.tagName == 'A') { $('#hb').classList.remove('x'); this.classList.remove('on') } };
var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in');[].forEach.call(e.target.querySelectorAll('[data-n]'), cnt); if (e.target.dataset.n) cnt(e.target); io.unobserve(e.target) } }) }, { threshold: .15 });
[].forEach.call(document.querySelectorAll('.rv'), function (e) { io.observe(e) });
function cnt(el) { if (el.done) return; el.done = 1; var n = +el.dataset.n, s = performance.now(); (function t(now) { var p = Math.min((now - s) / 1400, 1); el.textContent = Math.round(n * p).toLocaleString(); if (p < 1) requestAnimationFrame(t) })(s) }
var FA = ['Coffee beans are actually seeds.', 'Espresso means “pressed out” in Italian.', 'Espresso forces hot water through finely ground coffee.', 'Arabica and Robusta are the two major coffee species.', 'Coffee is one of the world’s most traded commodities.', 'The coffee plant produces fruit called cherries.', 'Latte art comes from carefully pouring steamed milk.', 'Robusta has roughly twice the caffeine of Arabica.', 'Finland drinks more coffee per person than any other country.', 'Cold brew is steeped for 12–24 hours, never heated.', 'A cappuccino traditionally has equal parts espresso, milk and foam.', 'Coffee plants can take 3–4 years to bear their first fruit.', 'The word “coffee” traces back to the Arabic “qahwa”.', 'Light roasts keep more of a bean’s origin flavor.', 'Coffee “crema” is the golden foam on a fresh espresso.', 'Brazil is the largest coffee producer in the world.', 'The Philippines grows all four main coffee types, including rare Liberica.', 'A flat white uses a thin layer of microfoam, not thick foam.', 'Beans are usually roasted between 190 and 240°C.', 'Freshly roasted coffee needs a few days to release gas before it tastes best.'], last = -1, bt, cb = $('#cb');
cb.onclick = function () {
    var i; do { i = Math.floor(Math.random() * FA.length) } while (i == last); last = i; var b = $('#bb'); b.textContent = 'Did you know? ' + FA[i]; b.classList.add('on'); clearTimeout(bt); bt = setTimeout(function () { b.classList.remove('on') }, 5000);
    var c = ['a1', 'a2', 'a3'][Math.floor(Math.random() * 3)]; cb.classList.remove('a1', 'a2', 'a3'); void cb.offsetWidth; cb.classList.add(c);
    for (var k = 0; k < 5; k++) { var s = document.createElement('span'); s.className = 'sp'; s.textContent = ['✨', '☕', '🫘', '♥', '💨'][k]; s.style.cssText = 'left:' + (10 + k * 10) + 'px;top:0;--dx:' + ((k - 2) * 14) + 'px'; cb.appendChild(s); setTimeout(function (x) { x.remove() }, 1000, s) }
};
var th = $('#th'), R = document.documentElement; th.onclick = function () { var d = R.dataset.theme != 'dark'; R.dataset.theme = d ? 'dark' : 'light'; th.textContent = d ? '☀️' : '🌙' };