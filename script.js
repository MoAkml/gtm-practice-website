// ===========================
// GTM PRACTICE ACADEMY - COMPLETE JAVASCRIPT
// ===========================

// Initialize dataLayer
window.dataLayer = window.dataLayer || [];

// ===========================
// PAGE LOAD EVENT
// ===========================
window.dataLayer.push({
    'event': 'page_load',
    'page_title': document.title,
    'page_location': window.location.href,
    'page_path': window.location.pathname,
    'user_type': 'new_visitor',
    'timestamp': new Date().toISOString()
});

// ===========================
// STATE MANAGEMENT
// ===========================
let cart = [];
let selectedPlan = null;
let selectedAddons = [];
let funnelStep = 1;

// ===========================
// SCROLL DEPTH TRACKING
// ===========================
let scrollDepths = [25, 50, 75, 100];
let trackedDepths = [];

window.addEventListener('scroll', function() {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.getElementById('scrollProgress').style.width = scrollPercent + '%';
    
    scrollDepths.forEach(depth => {
        if (scrollPercent >= depth && !trackedDepths.includes(depth)) {
            trackedDepths.push(depth);
            window.dataLayer.push({
                'event': 'scroll_depth',
                'scroll_percentage': depth,
                'page_location': window.location.href
            });
            console.log(`✅ Scroll depth tracked: ${depth}%`);
        }
    });
});

// ===========================
// NAVIGATION CLICKS
// ===========================
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const section = this.getAttribute('data-nav');
        window.dataLayer.push({
            'event': 'navigation_click',
            'nav_section': section,
            'click_text': this.textContent,
            'click_url': this.href
        });
        console.log(`✅ Navigation: ${section}`);
    });
});

// ===========================
// CTA BUTTON CLICKS
// ===========================
document.querySelectorAll('.cta-button').forEach(btn => {
    btn.addEventListener('click', function() {
        const buttonName = this.getAttribute('data-button');
        window.dataLayer.push({
            'event': 'cta_click',
            'button_name': buttonName,
            'button_text': this.textContent.trim(),
            'button_location': 'home_section'
        });
        console.log(`✅ CTA clicked: ${buttonName}`);
    });
});

// ===========================
// SITE SEARCH TRACKING
// ===========================
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && this.value.trim()) {
        const searchTerm = this.value.trim();
        window.dataLayer.push({
            'event': 'site_search',
            'search_term': searchTerm,
            'search_location': 'home_page'
        });
        console.log(`✅ Search: ${searchTerm}`);
        alert(`Search tracked: "${searchTerm}"`);
    }
});

// ===========================
// VIDEO TRACKING
// ===========================
let videoStarted = false;
let videoProgress = 0;
let videoInterval;

document.getElementById('videoPlayer').addEventListener('click', function() {
    if (!videoStarted) {
        videoStarted = true;
        
        // Video Start Event
        window.dataLayer.push({
            'event': 'video_start',
            'video_title': 'GTM Tutorial Introduction',
            'video_duration': 180,
            'video_url': 'demo_video.mp4',
            'video_provider': 'self_hosted'
        });
        console.log('✅ Video started');
        
        const progressBar = document.getElementById('videoProgress');
        progressBar.classList.remove('hidden');
        
        // Simulate video progress
        videoInterval = setInterval(function() {
            videoProgress += 5;
            progressBar.style.width = videoProgress + '%';
            
            // Track progress milestones
            if (videoProgress === 25 || videoProgress === 50 || videoProgress === 75) {
                window.dataLayer.push({
                    'event': 'video_progress',
                    'video_title': 'GTM Tutorial Introduction',
                    'video_percent': videoProgress
                });
                console.log(`✅ Video progress: ${videoProgress}%`);
            }
            
            // Video Complete
            if (videoProgress >= 100) {
                clearInterval(videoInterval);
                window.dataLayer.push({
                    'event': 'video_complete',
                    'video_title': 'GTM Tutorial Introduction'
                });
                console.log('✅ Video completed');
            }
        }, 1000);
    }
});

// ===========================
// NEWSLETTER SIGNUP
// ===========================
document.getElementById('newsletterBtn').addEventListener('click', function() {
    const email = document.getElementById('newsletterEmail').value;
    
    if (email && validateEmail(email)) {
        window.dataLayer.push({
            'event': 'newsletter_signup',
            'signup_location': 'home_page',
            'user_email': email
        });
        console.log(`✅ Newsletter signup: ${email}`);
        alert('✅ Newsletter signup tracked!');
        document.getElementById('newsletterEmail').value = '';
    } else {
        alert('❌ Please enter a valid email');
    }
});

// ===========================
// E-COMMERCE: ADD TO CART
// ===========================
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.product-card');
        const product = {
            id: card.getAttribute('data-product-id'),
            name: card.getAttribute('data-product-name'),
            price: parseFloat(card.getAttribute('data-product-price')),
            category: card.getAttribute('data-product-category')
        };
        
        cart.push(product);
        updateCart();
        
        // GA4 E-commerce Event
        window.dataLayer.push({
            'event': 'add_to_cart',
            'ecommerce': {
                'currency': 'USD',
                'value': product.price,
                'items': [{
                    'item_id': product.id,
                    'item_name': product.name,
                    'price': product.price,
                    'item_category': product.category,
                    'quantity': 1
                }]
            }
        });
        console.log(`✅ Added to cart: ${product.name}`);
    });
});

// ===========================
// UPDATE CART DISPLAY
// ===========================
function updateCart() {
    const cartEl = document.getElementById('shoppingCart');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length > 0) {
        cartEl.classList.remove('hidden');
        cartCount.classList.remove('hidden');
        cartCount.textContent = cart.length;
        
        // Render cart items
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="flex justify-between items-center border-b pb-4">
                <div>
                    <p class="font-semibold">${item.name}</p>
                    <p class="text-gray-600">$${item.price}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-600 hover:text-red-800">
                    Remove
                </button>
            </div>
        `).join('');
        
        // Calculate total
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    } else {
        cartEl.classList.add('hidden');
        cartCount.classList.add('hidden');
    }
}

// ===========================
// REMOVE FROM CART
// ===========================
function removeFromCart(index) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    updateCart();
    
    window.dataLayer.push({
        'event': 'remove_from_cart',
        'ecommerce': {
            'currency': 'USD',
            'items': [{
                'item_id': removedItem.id,
                'item_name': removedItem.name
            }]
        }
    });
    console.log(`✅ Removed from cart: ${removedItem.name}`);
}

// ===========================
// CHECKOUT
// ===========================
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            
            window.dataLayer.push({
                'event': 'begin_checkout',
                'ecommerce': {
                    'currency': 'USD',
                    'value': total,
                    'items': cart.map(item => ({
                        'item_id': item.id,
                        'item_name': item.name,
                        'price': item.price,
                        'quantity': 1
                    }))
                }
            });
            console.log('✅ Checkout started');
            alert('🛒 Checkout event tracked!');
        }
    });
}

// ===========================
// MULTI-STEP FUNNEL: PRICING
// ===========================

// Step 1: Plan Selection
document.querySelectorAll('.plan-select').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('[data-plan]');
        selectedPlan = {
            name: card.getAttribute('data-plan'),
            price: parseFloat(card.getAttribute('data-price'))
        };
        
        window.dataLayer.push({
            'event': 'funnel_step_1',
            'funnel_name': 'pricing_subscription',
            'step_number': 1,
            'plan_selected': selectedPlan.name,
            'plan_price': selectedPlan.price
        });
        console.log(`✅ Funnel Step 1: ${selectedPlan.name}`);
        
        document.getElementById('funnelStep1').classList.add('hidden');
        document.getElementById('funnelStep2').classList.remove('hidden');
        funnelStep = 2;
    });
});

// Step 2: Add-ons Selection
document.getElementById('continueStep2').addEventListener('click', function() {
    selectedAddons = [];
    let addonsTotal = 0;
    
    document.querySelectorAll('.addon-checkbox:checked').forEach(cb => {
        const addon = {
            name: cb.getAttribute('data-addon'),
            price: parseFloat(cb.getAttribute('data-price'))
        };
        selectedAddons.push(addon);
        addonsTotal += addon.price;
    });
    
    window.dataLayer.push({
        'event': 'funnel_step_2',
        'funnel_name': 'pricing_subscription',
        'step_number': 2,
        'addons_selected': selectedAddons.map(a => a.name).join(','),
        'addons_total': addonsTotal
    });
    console.log(`✅ Funnel Step 2: ${selectedAddons.length} add-ons`);
    
    // Show order summary
    const total = selectedPlan.price + addonsTotal;
    document.getElementById('orderSummary').innerHTML = `
        <div class="space-y-2">
            <div class="flex justify-between">
                <span>${selectedPlan.name} Plan</span>
                <span>$${selectedPlan.price}/mo</span>
            </div>
            ${selectedAddons.map(a => `
                <div class="flex justify-between text-sm">
                    <span>${a.name}</span>
                    <span>+$${a.price}/mo</span>
                </div>
            `).join('')}
            <div class="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>$${total}/mo</span>
            </div>
        </div>
    `;
    
    document.getElementById('funnelStep2').classList.add('hidden');
    document.getElementById('funnelStep3').classList.remove('hidden');
    funnelStep = 3;
});

// Step 3: Purchase Complete
document.getElementById('completePurchase').addEventListener('click', function() {
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const total = selectedPlan.price + addonsTotal;
    
    window.dataLayer.push({
        'event': 'purchase',
        'funnel_name': 'pricing_subscription',
        'transaction_id': 'TXN-' + Date.now(),
        'value': total,
        'currency': 'USD',
        'plan': selectedPlan.name,
        'addons': selectedAddons.map(a => a.name).join(',')
    });
    console.log(`✅ Purchase complete: $${total}`);
    alert('🎉 Purchase tracked! Check dataLayer.');
    
    // Reset funnel
    document.getElementById('funnelStep3').classList.add('hidden');
    document.getElementById('funnelStep1').classList.remove('hidden');
    selectedPlan = null;
    selectedAddons = [];
    funnelStep = 1;
});

// ===========================
// FILE DOWNLOADS
// ===========================
document.querySelectorAll('.download-file').forEach(btn => {
    btn.addEventListener('click', function() {
        const fileName = this.getAttribute('data-file');
        const fileSize = this.getAttribute('data-size');
        
        window.dataLayer.push({
            'event': 'file_download',
            'file_name': fileName,
            'file_extension': fileName.split('.').pop(),
            'file_size_mb': fileSize,
            'download_location': 'about_section'
        });
        console.log(`✅ Downloaded: ${fileName}`);
        alert(`📥 Download tracked: ${fileName}`);
    });
});

// ===========================
// SOCIAL SHARING
// ===========================
document.querySelectorAll('.social-share').forEach(btn => {
    btn.addEventListener('click', function() {
        const platform = this.getAttribute('data-platform');
        
        window.dataLayer.push({
            'event': 'social_share',
            'social_platform': platform,
            'share_url': window.location.href,
            'share_title': document.title
        });
        console.log(`✅ Shared on: ${platform}`);
        alert(`📱 Share tracked: ${platform}`);
    });
});

// ===========================
// CONTACT FORM SUBMISSION
// ===========================
document.getElementById('submitContact').addEventListener('click', function() {
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    if (name && email && message) {
        if (validateEmail(email)) {
            window.dataLayer.push({
                'event': 'form_submission',
                'form_name': 'contact_form',
                'form_category': 'lead_generation',
                'user_name': name,
                'user_email': email
            });
            console.log('✅ Contact form submitted');
            alert('✅ Form submission tracked!');
            
            // Reset form
            document.getElementById('contactName').value = '';
            document.getElementById('contactEmail').value = '';
            document.getElementById('contactMessage').value = '';
        } else {
            triggerFormError('Invalid email address');
        }
    } else {
        triggerFormError('Please fill all required fields');
    }
});

// ===========================
// ERROR TRACKING
// ===========================

// 404 Error
document.getElementById('trigger404').addEventListener('click', function() {
    window.dataLayer.push({
        'event': 'error',
        'error_type': '404',
        'error_message': 'Page not found',
        'error_url': window.location.href + '/nonexistent-page'
    });
    console.log('🐛 404 Error tracked');
    alert('🐛 404 Error tracked!');
});

// JavaScript Error
document.getElementById('triggerJSError').addEventListener('click', function() {
    try {
        // Intentionally cause an error
        nonExistentFunction();
    } catch (error) {
        window.dataLayer.push({
            'event': 'error',
            'error_type': 'javascript',
            'error_message': error.message,
            'error_stack': error.stack
        });
        console.log('🐛 JavaScript Error tracked');
        alert('🐛 JS Error tracked!');
    }
});

// Form Validation Error
document.getElementById('triggerFormError').addEventListener('click', function() {
    triggerFormError('Test validation error');
});

function triggerFormError(message) {
    const form = document.getElementById('contactForm');
    form.classList.add('error-shake');
    setTimeout(() => form.classList.remove('error-shake'), 500);
    
    window.dataLayer.push({
        'event': 'form_error',
        'form_name': 'contact_form',
        'error_message': message
    });
    console.log(`🐛 Form Error: ${message}`);
    alert(`❌ ${message}`);
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Global error handler
window.addEventListener('error', function(e) {
    window.dataLayer.push({
        'event': 'javascript_error',
        'error_message': e.message,
        'error_url': e.filename,
        'error_line': e.lineno
    });
});

// ===========================
// CONSOLE HELPER
// ===========================
console.log(`
🎓 GTM PRACTICE ACADEMY LOADED
================================
✅ All event tracking is active
📊 Open Console and type: dataLayer
🎯 Interact with the page to see events

Events Available:
- Page Load
- Navigation Clicks  
- CTA Buttons
- Scroll Depth (25%, 50%, 75%, 100%)
- Site Search
- Video Tracking (Start, Progress, Complete)
- Newsletter Signup
- E-commerce (Add/Remove Cart, Checkout)
- Multi-step Funnel (3 steps)
- Form Submissions
- File Downloads
- Social Sharing
- Error Tracking
`);